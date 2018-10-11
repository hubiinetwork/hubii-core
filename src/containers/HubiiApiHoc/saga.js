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

import { requestWalletAPI } from 'utils/request';
import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { ADD_NEW_WALLET } from 'containers/WalletHoc/constants';

import {
  makeSelectWallets,
} from 'containers/WalletHoc/selectors';

import {
  LOAD_WALLET_BALANCES,
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


export function* loadWalletBalances({ address, noPoll }, network) {
  const requestPath = `ethereum/wallets/${address}/balances`;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, network);
      yield put(loadWalletBalancesSuccess(address, returnData));
    } catch (err) {
      if (!noPoll) {
        yield put(loadWalletBalancesError(address, err));
      }
    } finally {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
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

export function* loadPrices(network) {
  const requestPath = 'ethereum/prices';
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, network);
      yield put(loadPricesSuccess(returnData));
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
      // try again in 5sec
      const FIVE_SEC_IN_MS = 5 * 5000;
      yield delay(FIVE_SEC_IN_MS);
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
