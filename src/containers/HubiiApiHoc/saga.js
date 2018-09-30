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

import { requestWalletAPI, requestAPIToken } from 'utils/request';
import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { ADD_NEW_WALLET } from 'containers/WalletHOC/constants';

import {
  makeSelectWallets,
} from 'containers/WalletHOC/selectors';

import {
  loadIdentityServiceToken,
} from 'containers/App/actions';

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


export function* loadWalletBalances({ address, noPoll }, _network) {
  const requestPath = `ethereum/wallets/${address}/balances`;
  let network = _network;
  while (true) { // eslint-disable-line no-constant-condition
    network = yield checkNetworkTokenValidity(network);
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

export function* loadSupportedTokens(_network) {
  const requestPath = 'ethereum/supported-tokens';
  let network = _network;
  network = yield checkNetworkTokenValidity(network);
  try {
    const returnData = yield call(requestWalletAPI, requestPath, network); yield put(loadSupportedTokensSuccess(returnData));
  } catch (err) {
    yield put(loadSupportedTokensError(err));
  }
}

export function* loadPrices(_network) {
  const requestPath = 'ethereum/prices';
  let network = _network;
  while (true) { // eslint-disable-line no-constant-condition
    network = yield checkNetworkTokenValidity(network);
    try {
      const returnData = yield call(requestWalletAPI, requestPath, network); yield put(loadPricesSuccess(returnData));
    } catch (err) {
      yield put(loadPricesError(err));
    } finally {
      const ONE_MINUTE_IN_MS = 1000 * 60;
      yield delay(ONE_MINUTE_IN_MS);
    }
  }
}

export function* loadTransactions({ address }, _network) {
  let network = _network;
  const requestPath = `ethereum/wallets/${address}/transactions`;
  while (true) { // eslint-disable-line no-constant-condition
    network = yield checkNetworkTokenValidity(network);
    try {
      const returnData = yield call(requestWalletAPI, requestPath, network);
      yield put(loadTransactionsSuccess(address, returnData));
    } catch (err) {
      yield put(loadTransactionsError(address, err));
    } finally {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS / 1000);
    }
  }
}

export function* requestWalletAPIToken(_network) {
  const requestPath = 'identity/apptoken';
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const network = {
        endpoint: _network.walletApiEndpoint,
        options: {
          appid: _network.identityServiceAppId,
          secret: _network.identityServiceSecret,
        },
      };
      const returnToken = yield call(requestAPIToken, requestPath, network);
      // console.log(returnToken);
      yield put(loadIdentityServiceToken(returnToken));
      const ONE_MINUTE_IN_MS = 1000 * 60;
      yield delay(ONE_MINUTE_IN_MS);
    } catch (err) {
      const FIVE_SECONDS_IN_MS = 1000 * 5;
      yield delay(FIVE_SECONDS_IN_MS);
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
        fork(requestWalletAPIToken, network),
        ...wallets.map((wallet) => fork(loadWalletBalances, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, network)),
        fork(loadSupportedTokens, network),
        fork(loadPrices, network),
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

function* checkNetworkTokenValidity(_network) {
  let network = _network;
  const currentNetwork = yield select(makeSelectCurrentNetwork());
  if (currentNetwork !== network) {
    network = currentNetwork;
  }
  while (!network.identityServiceToken) {
    network = yield select(makeSelectCurrentNetwork());
    const ONE_HUNDRED_MS = 100;
    yield delay(ONE_HUNDRED_MS);
  }
  return network;
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, networkApiOrcestrator);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalances);
}
