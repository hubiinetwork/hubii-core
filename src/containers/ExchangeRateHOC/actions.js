import {
  LOAD_EXCHANGE_RATE,
  LOAD_EXCHANGE_RATE_SUCCESS,
  LOAD_EXCHANGE_RATE_FAILURE,
  LOAD_TICKERS_SUCCESS,
  LOAD_TICKERS_FAILURE,
} from './constants';

export function loadExchangeRate({ ticker, convert }) {
  return {
    type: LOAD_EXCHANGE_RATE,
    ticker,
    convert,
  };
}

export function exchangeRateLoaded({ tickerData, convert }) {
  return {
    type: LOAD_EXCHANGE_RATE_SUCCESS,
    tickerData,
    convert,
  };
}

export function exchangeRateLoadingError({ error, ticker, convert }) {
  return {
    type: LOAD_EXCHANGE_RATE_FAILURE,
    error,
    ticker,
    convert,
  };
}

export function tickersLoaded(tickers) {
  return {
    type: LOAD_TICKERS_SUCCESS,
    tickers,
  };
}

export function tickersLoadingError(error) {
  return {
    type: LOAD_TICKERS_FAILURE,
    error,
  };
}
