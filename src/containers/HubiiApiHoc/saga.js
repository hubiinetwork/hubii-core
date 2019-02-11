import {
  all,
  takeEvery,
  fork,
  put,
  call,
  select,
  take,
  cancel,
  race,
} from 'redux-saga/effects';

import { delay } from 'redux-saga';
import nahmii from 'nahmii-sdk';
import { utils as ethersUtils } from 'ethers';
import BigNumber from 'bignumber.js';

import { requestWalletAPI } from 'utils/request';
import rpcRequest from 'utils/rpcRequest';
import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { ADD_NEW_WALLET } from 'containers/WalletHoc/constants';

import {
  makeSelectWallets,
} from 'containers/WalletHoc/selectors';


import {
  LOAD_WALLET_BALANCES, LOAD_SUPPORTED_TOKENS_SUCCESS,
} from './constants';

import {
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  loadIdentityServiceTokenSuccess,
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPricesSuccess,
  loadPricesError,
  loadTransactionsSuccess,
  loadTransactionsError,
} from './actions';
import { makeSelectSupportedAssets } from './selectors';


// https://stackoverflow.com/questions/48228662/get-token-balance-with-ethereum-rpc
const BALANCE_OF_FUNCTION_ID = ('0x70a08231');
export function* loadWalletBalances({ address, noPoll, onlyEth }, _network) {
  const network = _network || (yield select(makeSelectCurrentNetwork()));
  let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  if (supportedAssets.loading) {
    yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
    supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  }
  const { nahmiiProvider } = network;
  // const requestPath = `ethereum/wallets/${address}/balances`;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      // const returnData = yield call(requestWalletAPI, requestPath, network);

      /**
       * temporarily fetching balances from node until the backend is fixed
       */
      // get ETH balance
      const ethBal = yield nahmiiProvider.getBalance(address);
      if (onlyEth) {
        yield put(loadWalletBalancesSuccess(address, [{ currency: '0x0000000000000000000000000000000000000000', address, decimals: 18, balance: ethBal }]));
        return;
      }

      // get token balances, batching all the requests in an array and sending them all at once
      // https://stackoverflow.com/questions/48228662/get-token-balance-with-ethereum-rpc
      const supportedTokens = supportedAssets.assets.filter((a) => a.currency !== '0x0000000000000000000000000000000000000000');
      const tokenContractAddresses = supportedTokens.map((a) => a.currency);

      // pad the 20 byte address to 32 bytes
      const paddedAddr = ethersUtils.hexlify(ethersUtils.padZeros(address, 32));

      // concat the balanceOf('address') function identifier to the padded address. this shows our intention to call the
      // balanceOf method with address as the parameter
      const dataArr = ethersUtils.concat([BALANCE_OF_FUNCTION_ID, paddedAddr]);
      const data = ethersUtils.hexlify(dataArr);

      // send a batch of RPC requests asking for all token balances
      // https://www.jsonrpc.org/specification#batch
      const requestBatch = tokenContractAddresses.map((contractAddr) => {
        const params = [{ from: address, to: contractAddr, data }, 'latest'];
        return {
          method: 'eth_call',
          params,
          id: 42,
          jsonrpc: '2.0',
        };
      });
      const response = yield rpcRequest(nahmiiProvider.connection.url, JSON.stringify(requestBatch));

      // process and return the response
      const tokenBals = response.map((item) => new BigNumber(item.result));
      const formattedBalances = tokenBals.reduce((acc, bal, i) => {
        if (!bal.gt('0')) return acc;
        const { currency } = supportedTokens[i];
        return [...acc, { address, currency, balance: bal.toString() }];
      }, []);
      yield put(loadWalletBalancesSuccess(address, [{ currency: '0x0000000000000000000000000000000000000000', address, balance: ethBal.toString() }, ...formattedBalances]));
    } catch (err) {
      yield put(loadWalletBalancesError(address, err));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
    if (noPoll) break;
  }
}

export function* loadSupportedTokens(network) {
  const requestPath = 'ethereum/supported-tokens';
  try {
    const returnData = yield call(requestWalletAPI, requestPath, network);
    yield put(loadSupportedTokensSuccess(returnData));
  } catch (err) {
    yield put(loadSupportedTokensError(err));
  }
}

// if supported asset doesn't have a price, set it to 0
function patchPrices(prices, supportedAssets) {
  return supportedAssets.assets.map((a) => {
    const price = prices.find((p) => p.currency === a.currency);
    if (!price) {
      return { currency: a.currency, btc: '0', eth: '0', usd: '0' };
    }
    return price;
  });
}

export function* loadPrices(network) {
  const requestPath = 'ethereum/prices';
  while (true) { // eslint-disable-line no-constant-condition
    try {
      let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
      if (supportedAssets.loading) {
        yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
        supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
      }
      const returnData = yield call(requestWalletAPI, requestPath, network);
      const patchedData = patchPrices(returnData, supportedAssets);
      yield put(loadPricesSuccess(patchedData));
    } catch (err) {
      yield put(loadPricesError(err));
    } finally {
      const ONE_MINUTE_IN_MS = 1000 * 60;
      yield delay(ONE_MINUTE_IN_MS);
    }
  }
}

export function* loadTransactions({ address }, network) {
  const requestPath = `ethereum/wallets/${address}/transactions`;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, network);
      // when backend becomes consistent and uses '0x00...' for currency in this endpoint,
      // we can remove the processing below
      const processedReturnData = returnData.map((t) => {
        if (t.currency !== 'ETH') return t;
        return {
          ...t,
          currency: '0x0000000000000000000000000000000000000000',
        };
      });
      yield put(loadTransactionsSuccess(address, processedReturnData));
    } catch (err) {
      yield put(loadTransactionsError(address, err));
    } finally {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
    }
  }
}

export function* requestToken() {
  while (true) { // eslint-disable-line no-constant-condition
    let nahmiiProvider;
    try {
      const network = yield select(makeSelectCurrentNetwork());
      nahmiiProvider = new nahmii.NahmiiProvider(
        network.walletApiEndpoint(true),
        network.identityServiceAppId,
        network.identityServiceSecret
      );
      const token = yield call([nahmiiProvider, 'getApiAccessToken']);
      yield put(loadIdentityServiceTokenSuccess(token));
      return;
    } catch (e) {
      // try again in 2sec
      const TWO_SEC_IN_MS = 2 * 1000;
      yield delay(TWO_SEC_IN_MS);
    } finally {
      nahmiiProvider.stopUpdate();
    }
  }
}

// manages calling of hubii network specific APIs
export function* networkApiOrcestrator() {
  try {
    while (true) { // eslint-disable-line no-constant-condition
      // wait for a new token to be generated
      yield requestToken();

      // now that we have a valid token, start the rest of the calls
      const network = yield select(makeSelectCurrentNetwork());
      const wallets = yield select(makeSelectWallets());
      const allTasks = yield all([
        ...wallets.map((wallet) => fork(loadWalletBalances, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, network)),
        fork(loadSupportedTokens, network),
        fork(loadPrices, network),
      ]);

      // kill all forks and restart
      //   * when we need to get a new JWT token (1 minute)
      //   * when the network is changed or a wallet is added
      const ONE_MINUTE_IN_MS = 60 * 1000;
      yield race({
        timer: call(delay, ONE_MINUTE_IN_MS),
        override: take([CHANGE_NETWORK, ADD_NEW_WALLET]),
      });
      if (allTasks.length > 0) {
        yield cancel(...allTasks);
      }
    }
  } catch (e) {
    // errors in the forked processes themselves should be caught
    // and handled before they get here. if something goes wrong here
    // there was probably an error with a selector, which should
    // never happen
    throw new Error(e);
  }
}

export function* getNahmiiProvider() {
  const network = yield select(makeSelectCurrentNetwork());
  const nahmiiProvider = new nahmii.NahmiiProvider(
    network.walletApiEndpoint(true),
    network.identityServiceAppId,
    network.identityServiceSecret
  );
  return nahmiiProvider;
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, networkApiOrcestrator);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalances);
}
