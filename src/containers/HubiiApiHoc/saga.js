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
import ethers from 'ethers';
import BigNumber from 'bignumber.js';

import request, { requestWalletAPI } from 'utils/request';
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
  // const requestPath = `ethereum/wallets/${address}/balances`;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      // const returnData = yield call(requestWalletAPI, requestPath, network);

      /**
       * temporarily fetching balances from node until the backend is fixed
       */
      // get ETH balance
      const ethBal = yield network.provider.getBalance(address);
      if (onlyEth) {
        yield put(loadWalletBalancesSuccess(address, [{ currency: 'ETH', address, decimals: 18, balance: ethBal }]));
        return;
      }

      // get token balances, batching all the requests in an array and sending them all at once
      // https://stackoverflow.com/questions/48228662/get-token-balance-with-ethereum-rpc
      const tokenContractAddresses = supportedAssets.assets.map((a) => a.currency).slice(0, -1);

      // the first provider in network.provider.providers in an Infura node, which supports RPC calls
      const jsonRpcProvider = network.provider.providers[0];

      // pad the 20 byte address to 32 bytes
      const paddedAddr = ethers.utils.hexlify(ethers.utils.padZeros(address, 32));

      // concat the balanceOf('address') function identifier to the padded address. this shows our intention to call the
      // balanceOf method with address as the parameter
      const dataArr = ethers.utils.concat([BALANCE_OF_FUNCTION_ID, paddedAddr]);
      const data = ethers.utils.hexlify(dataArr);

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
      const response = yield rpcRequest(jsonRpcProvider.url, JSON.stringify(requestBatch));

      // process and return the response
      const tokenBals = response.map((item) => new BigNumber(item.result));
      const formattedBalances = tokenBals.reduce((acc, bal, i) => {
        if (!bal.gt('0')) return acc;
        const { currency } = supportedAssets.assets[i];
        return [...acc, { address, currency, balance: bal }];
      }, []);
      yield put(loadWalletBalancesSuccess(address, [{ currency: 'ETH', address, decimals: 18, balance: ethBal }, ...formattedBalances]));
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
    // temporarily filter out the ETH asset details that comes back from backend.
    // in the future we should remove our own ETH asset we add in actions, and
    // start relying on the one from the backend.
    // see https://github.com/hubiinetwork/hubii-core/issues/630
    yield put(loadSupportedTokensSuccess(returnData.filter((asset) => asset.symbol !== 'ETH')));
  } catch (err) {
    yield put(loadSupportedTokensError(err));
  }
}

// temp function to add ETH price, and other broken prices to the load prices response
function* patchPrices(returnData) {
  let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();

  // wait for supported assets to load
  if (supportedAssets.loading) {
    yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
    supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  }

  // get the symbols that need refetching
  let pathSyms = 'ETH';
  const symbols = ['ETH'];
  returnData.forEach((price) => {
    if (!price.eth) {
      const symbol = supportedAssets.assets.find((asset) => asset.currency === price.currency).symbol;
      symbols.push(symbol);
      pathSyms = `${pathSyms},${symbol}`;
    }
  });

  // get the pricing data
  const endpoint = 'https://min-api.cryptocompare.com/';
  const prices = { ETH: {}, USD: {}, BTC: {} };
  const [ethPrices, usdPrices, btcPrices] = yield all(
    Object.keys(prices).map((sym) => {
      const path = `data/price?fsym=${sym}&tsyms=${pathSyms}`;
      return request(path, {}, endpoint);
    })
  );
  prices.ETH = ethPrices;
  prices.USD = usdPrices;
  prices.BTC = btcPrices;

  // massage the data
  Object.keys(prices).forEach((primarySym) => {
    Object.keys(prices[primarySym]).forEach((secondarySym) => {
      const price = new BigNumber(1).dividedBy(prices[primarySym][secondarySym]).toString();
      prices[primarySym][secondarySym] = price;
    });
  });

  // patch the new pricing data onto the hubii data
  const patchedData = [...returnData, { currency: 'ETH', eth: prices.ETH.ETH, btc: prices.BTC.ETH, usd: prices.USD.ETH }];
  symbols.forEach((symbol) => {
    if (symbol === 'ETH') return;
    const currency = supportedAssets.assets.find((a) => a.symbol === symbol).currency;
    const entry = patchedData.find((item) => item.currency === currency);
    entry.eth = prices.ETH[symbol] || '0';
    entry.usd = prices.USD[symbol] || '0';
    entry.btc = prices.BTC[symbol] || '0';
  });

  return patchedData;
}

export function* loadPrices(network) {
  const requestPath = 'ethereum/prices';
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, network);
      const patchedData = yield patchPrices(returnData);
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
      yield put(loadTransactionsSuccess(address, returnData));
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
      yield cancel(...allTasks);
    }
  } catch (e) {
    // errors in the forked processes themselves should be caught
    // and handled before they get here. if something goes wrong here
    // there was probably an error with a selector, which should
    // never happen
    throw new Error(e);
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, networkApiOrcestrator);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalances);
}
