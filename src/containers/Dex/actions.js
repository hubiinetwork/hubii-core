import {
  LOAD_PRICE_HISTORY,
  LOAD_PRICE_HISTORY_SUCCESS,
  LOAD_PRICE_HISTORY_ERROR,
  LISTEN_LATEST_PRICE,
  UPDATE_LATEST_PRICE_SUCCESS,
  UPDATE_LATEST_PRICE_ERROR,
} from './constants';


export function loadPriceHistory(fromCcy) {
  return {
    type: LOAD_PRICE_HISTORY,
    currency: fromCcy,
  };
}
export function loadPriceHistorySuccess(fromCcy, data) {
  return {
    type: LOAD_PRICE_HISTORY_SUCCESS,
    currency: fromCcy,
    data,
  };
}
export function loadPriceHistoryError(fromCcy) {
  return {
    type: LOAD_PRICE_HISTORY_ERROR,
    currency: fromCcy,
  };
}
export function listenLatestPrice(fromCcy) {
  return {
    type: LISTEN_LATEST_PRICE,
    currency: fromCcy,
  };
}
export function updateLatestPriceSuccess(fromCcy, price) {
  return {
    type: UPDATE_LATEST_PRICE_SUCCESS,
    currency: fromCcy,
    price,
  };
}
export function updateLatestPriceError(fromCcy, error) {
  return {
    type: UPDATE_LATEST_PRICE_ERROR,
    currency: fromCcy,
    error,
  };
}
