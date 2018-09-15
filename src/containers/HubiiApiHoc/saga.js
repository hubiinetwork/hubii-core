import {
  all,
  takeEvery,
  fork,
  put,
  call,
  select,
  take,
  cancel,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';

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
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPricesSuccess,
  loadPricesError,
  loadTransactionsSuccess,
  loadTransactionsError,
} from './actions';


export function* loadWalletBalances({ address, noPoll }, _endpoint) {
  const requestPath = `ethereum/wallets/${address}/balances`;
  let endpoint = _endpoint;
  if (!endpoint) {
    endpoint = (yield select(makeSelectCurrentNetwork())).walletApiEndpoint;
  }
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, endpoint);
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

export function* loadSupportedTokens(endpoint) {
  const requestPath = 'ethereum/supported-tokens';
  try {
    const returnData = yield call(requestWalletAPI, requestPath, endpoint);
    yield put(loadSupportedTokensSuccess(returnData));
  } catch (err) {
    yield put(loadSupportedTokensError(err));
  }
}

export function* loadPrices(endpoint) {
  const requestPath = 'ethereum/prices';
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, endpoint);
      yield put(loadPricesSuccess(returnData));
    } catch (err) {
      yield put(loadPricesError(err));
    } finally {
      const ONE_MINUTE_IN_MS = 1000 * 60;
      yield delay(ONE_MINUTE_IN_MS);
    }
  }
}

export function* loadTransactions({ address }, endpoint) {
  const requestPath = `ethereum/wallets/${address}/transactions`;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, endpoint);

      yield put(loadTransactionsSuccess(address, returnData));
    } catch (err) {
      yield put(loadTransactionsError(address, err));
    } finally {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
    }
  }
}

// manages calling of hubii network specific APIs
export function* networkApiOrcestrator() {
  try {
    while (true) { // eslint-disable-line no-constant-condition
      // fork new processes, some of which will poll
      const network = yield select(makeSelectCurrentNetwork());
      const wallets = yield select(makeSelectWallets());
      const allTasks = yield all([
        ...wallets.map((wallet) => fork(loadWalletBalances, { address: wallet.get('address') }, network.walletApiEndpoint)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, network.walletApiEndpoint)),
        fork(loadSupportedTokens, network.walletApiEndpoint),
        fork(loadPrices, network.walletApiEndpoint),
      ]);

      // on network change kill all forks and restart
      yield take([CHANGE_NETWORK, ADD_NEW_WALLET]);
      yield cancel(...allTasks);
    }
  } catch (e) {
    // errors in the forked processes themselves should be caught
    // and handled before they get here. if something goes wrong here
    // there was probably an error with the wallet selector, which should
    // never happen
    throw new Error(e);
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, networkApiOrcestrator);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalances);
}
