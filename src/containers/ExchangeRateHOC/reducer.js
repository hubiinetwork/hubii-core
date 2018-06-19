import { fromJS } from 'immutable';

import {
  LOAD_EXCHANGE_RATE,
  LOAD_EXCHANGE_RATE_SUCCESS,
  LOAD_EXCHANGE_RATE_FAILURE,
  LOAD_TICKERS_SUCCESS,
} from './constants';

const initialState = fromJS({ rates: {}, tickers: [] });

function exchangeRateReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_EXCHANGE_RATE:
      return state.updateIn(['rates'], (rates) => {
        const rateKey = `${action.ticker}_${action.convert}`;
        const tickerData = rates.toJS()[rateKey] || {};
        tickerData.loading = true;
        return rates.set(rateKey, tickerData);
      });
    case LOAD_EXCHANGE_RATE_SUCCESS:
      return state.updateIn(['rates'], (rates) => rates.set(`${action.tickerData.data.symbol}_${action.convert}`, {
        loading: false,
        error: null,
        data: {
          id: action.tickerData.data.id,
          symbol: action.tickerData.data.symbol,
          price: action.tickerData.data.quotes[action.convert].price,
          last_updated: action.tickerData.data.last_updated,
        },
        original: action.tickerData,
      }));
    case LOAD_EXCHANGE_RATE_FAILURE:
      return state.updateIn(['rates'], (rates) => rates.set(`${action.ticker}_${action.convert}`, {
        loading: false,
        error: action.error,
      }));
    case LOAD_TICKERS_SUCCESS:
      return state
        .set('tickers', action.tickers);
    default:
      return state;
  }
}

export default exchangeRateReducer;
