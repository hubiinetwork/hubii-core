import {
  all,
  takeEvery,
  fork,
  call,
  put,
  select,
  take,
  cancel,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'utils/request';

import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';

import {
  loadBlockHeightSuccess,
  loadBlockHeightError,
  loadGasStatisticsSuccess,
  loadGasStatisticsError,
} from './actions';


export function* loadBlockHeight(provider) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const blockHeight = yield provider.getBlockNumber();
      yield put(loadBlockHeightSuccess(blockHeight));
    } catch (error) {
      yield put(loadBlockHeightError(error));
    } finally {
      const TEN_SEC_IN_MS = 1000 * 10;
      yield delay(TEN_SEC_IN_MS);
    }
  }
}

export function* loadGasStatistics() {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const result = yield call(request, '/json/ethgasAPI.json', null, 'https://ethgasstation.info');
      yield put(loadGasStatisticsSuccess(result));
    } catch (error) {
      yield put(loadGasStatisticsError(error));
    } finally {
      const TEN_SEC_IN_MS = 1000 * 10;
      yield delay(TEN_SEC_IN_MS);
    }
  }
}

// manages calling of complex ethOperations
export function* ethOperationsOrcestrator() {
  try {
    while (true) { // eslint-disable-line no-constant-condition
      // fork new processes, some of which will poll
      const network = yield select(makeSelectCurrentNetwork());
      const allTasks = yield all([
        fork(loadBlockHeight, network.nahmiiProvider),
        fork(loadGasStatistics),
      ]);

      // on network change kill all forks and restart
      yield take(CHANGE_NETWORK);
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
export default function* root() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, ethOperationsOrcestrator);
}
