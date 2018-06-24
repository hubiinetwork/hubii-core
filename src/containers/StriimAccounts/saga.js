import { takeLatest, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '../../utils/request';

import { LOAD_STRIIM_ACCOUNTS } from './constants';
import {
  striimAccountsLoaded,
  striimAccountsLoadingError,
} from './actions';


export function* getInfo() {
  // TODO the user id should be an API key that could be fetched from the session.
  const id = 1;
  const requestPath = `striim-accounts/?uid=${id}`;
  try {
    const returnData = yield call(request, requestPath, null, 'http://localhost:8000/');
    yield delay(750); // simulate wait
    yield put(striimAccountsLoaded(returnData));
  } catch (err) {
    yield put(striimAccountsLoadingError(err));
  }
}

export default function* listenStriimAccountsData() {
  yield takeLatest(LOAD_STRIIM_ACCOUNTS, getInfo);
}
