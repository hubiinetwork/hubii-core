import { take, takeEvery, put, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'utils/request';

import { LOAD_EXCHANGE_RATE, LOAD_TICKERS_SUCCESS, LOAD_TICKERS_FAILURE } from './constants';
import {
  exchangeRateLoaded,
  exchangeRateLoadingError,
  tickersLoadingError,
  tickersLoaded,
} from './actions';
import { makeSelectExchangeRateCache, makeSelectTickers } from './selectors';

const endpoint = 'https://api.coinmarketcap.com/v2/';

export function* getTickers() {
  let tickers = yield select(makeSelectTickers());
  try {
    if (!tickers || !tickers.length) {
      const tickersResponse = yield call(request, 'listings/', {}, endpoint);
      tickers = tickersResponse.data;
      yield put(tickersLoaded(tickers));
    }
  } catch (err) {
    yield put(tickersLoadingError(err));
  }
  return tickers;
}

export function* getTickerData(tickers, action) {
  let tickerData = yield select(makeSelectExchangeRateCache(action.ticker, action.convert));
  const ticker = tickers.filter((t) => t.symbol === action.ticker)[0];
  const requestPath = `ticker/${ticker.id}/?convert=${action.convert}`;
  try {
    if (!tickerData) {
      tickerData = yield call(request, requestPath, {}, endpoint);
    }
    yield delay(750); // simulate wait
    yield put(exchangeRateLoaded({ tickerData, convert: action.convert }));
  } catch (err) {
    yield put(exchangeRateLoadingError({ error: err, ticker: ticker.symbol, convert: action.convert }));
  }
}

export function* getInfo(action) {
  const tickers = yield getTickers();
  if (!tickers) {
    return yield put(exchangeRateLoadingError({
      error: new Error('no tickers available'),
      ticker: action.ticker,
      convert: action.convert,
    }));
  }
  return yield getTickerData(tickers, action);
}

export default function* listenExchangeRateAction() {
  let initTickers = false;
  let fetchingTickers = true;
  yield takeEvery(LOAD_EXCHANGE_RATE, function* batch(action) {
    if (!initTickers) {
      initTickers = true;
      yield call(getTickers);
      fetchingTickers = false;
    }

    if (fetchingTickers) {
      yield take([LOAD_TICKERS_SUCCESS, LOAD_TICKERS_FAILURE]);
      fetchingTickers = false;
    }

    yield call(getInfo, action);
  });
}
