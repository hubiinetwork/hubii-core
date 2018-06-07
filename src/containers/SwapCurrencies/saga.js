import { takeLatest, put, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '../../utils/request';

import { makeSelectPathnameId } from '../App/selectors';
import { LOAD_DEPOSIT_INFO } from './constants';
import {
  depositInfoLoaded,
  depositInfoLoadingError,
} from './actions';


/**
 * Deposit info request/response handler
 */
export function* getInfo() {
  const id = yield select(makeSelectPathnameId());
  const requestPath = `deposits/${id}`;
  try {
    const returnData = yield call(request, requestPath);
    yield delay(750); // simulate wait
    yield put(depositInfoLoaded(returnData));
  } catch (err) {
    yield put(depositInfoLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* depositInfo() {
  yield takeLatest(LOAD_DEPOSIT_INFO, getInfo);
}
