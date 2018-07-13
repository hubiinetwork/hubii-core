
import { fromJS } from 'immutable';
import exchangeRateReducer from '../reducer';

import {
  loadExchangeRate,
  exchangeRateLoaded,
  exchangeRateLoadingError,
} from '../actions';

describe('exchangeRateReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({ rates: {}, tickers: [] });
  });

  it('returns the initial state', () => {
    expect(exchangeRateReducer(undefined, {})).toEqual(state);
  });

  it('should handle loadExchangeRate action correctly', () => {
    const ticker = 'HBT';
    const convert = 'USD';
    const exchangeRates = { BTC_USD: { loading: false } };
    const initState = state.set('rates', fromJS(exchangeRates));
    const expected = initState.updateIn(['rates'], (rates) => rates.set(`${ticker}_${convert}`, { loading: true }));
    expect(exchangeRateReducer(initState, loadExchangeRate({ ticker, convert }))).toEqual(expected);
  });

  it('should handle loadExchangeRateLoaded action correctly', () => {
    const ticker = 'HBT';
    const tickerData = {
      data: {
        id: 2031,
        symbol: ticker,
        quotes: {
          USD: {
            price: 0.624956,
          },
        },
        last_updated: 1527660864,
      },
    };
    const initState = state;
    const convert = 'USD';
    const expected = state.updateIn(['rates'], (rates) => rates.set(`${ticker}_${convert}`, {
      loading: false,
      error: null,
      data: {
        id: tickerData.data.id,
        symbol: tickerData.data.symbol,
        price: tickerData.data.quotes[convert].price,
        last_updated: tickerData.data.last_updated,
      },
      original: tickerData,
    }));

    expect(exchangeRateReducer(initState, exchangeRateLoaded({ tickerData, convert }))).toEqual(expected);
  });

  it('should handle exchangeRateLoadingError action correctly', () => {
    const error = 'Something went wrong!';
    const ticker = 'HBT';
    const convert = 'USD';
    const initState = state;

    const expected = state.updateIn(['rates'], (rates) => rates.set(`${ticker}_${convert}`, { loading: false, error }));

    expect(exchangeRateReducer(initState, exchangeRateLoadingError({ error, ticker, convert }))).toEqual(expected);
  });
});
