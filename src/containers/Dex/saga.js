import {
  takeEvery,
  put,
  call,
  select,
  take,
} from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';

import request from 'utils/request';

import {
  LOAD_PRICE_HISTORY, LISTEN_LATEST_PRICE,
} from './constants';

import * as actions from './actions';

export function* loadPriceHistory({ currency, toCcy, interval }) {
  try {
    const requestPath = `/smartvikisogn/cryptocurrency/master/${currency}.json`;
    const endpoint = 'https://raw.githubusercontent.com';
    const returnData = yield call(request, requestPath, null, endpoint);
    yield put(actions.loadPriceHistorySuccess(currency, returnData));
  } catch (e) {
    yield put(actions.loadPriceHistoryError(e));
  }
}

let latestPriceChannel;
export const createLatestPriceChannel = (currency) => eventChannel((emit) => {
  if (latestPriceChannel) {
    latestPriceChannel.close();
  }
  const mock = {
    date: '2-2-2018',
    open: 10237.3,
    high: 10288.8,
    low: 8812.28,
    close: 9170.54,
    volume: 9959400000,
  };
  setInterval(() => {
    emit({ currency, price: mock });
  }, 1000);
  return () => { };
});

export function* listenLatestPrice({ currency, toCcy, interval }) {
  const chan = yield call(createLatestPriceChannel, currency);

  while (true) { // eslint-disable-line no-constant-condition
    try {
      const data = yield take(chan);
      yield put(actions.updateLatestPriceSuccess(data.currency, data.price));
    } catch (e) {
      yield put(actions.updateLatestPriceError(currency, e));
    }
  }
}

export default function* dexWatcher() {
  yield takeEvery(LOAD_PRICE_HISTORY, loadPriceHistory);
  yield takeEvery(LISTEN_LATEST_PRICE, listenLatestPrice);
}
