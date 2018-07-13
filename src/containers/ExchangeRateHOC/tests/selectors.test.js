import { fromJS } from 'immutable';

import { makeSelectExchangeRates, makeSelectTickers, makeSelectExchangeRateCache } from '../selectors';

describe('selectExchangeRateDomain', () => {
  const mockedState = fromJS({
    exchangeRates: { rates: { HBT_USD: {} }, tickers: [{ id: 1 }, { id: 2 }] },
  });
  it('should select the exchange rates state', () => {
    const exchangeRateSelector = makeSelectExchangeRates();
    const exchangeRatesState = fromJS({
      HBT_USD: {},
    });
    expect(exchangeRateSelector(mockedState)).toEqual(exchangeRatesState);
  });
  it('should select the cached exchange rate response', () => {
    const ticker = 'HBT';
    const convert = 'USD';
    const exchangeRateSelector = makeSelectExchangeRateCache(ticker, convert);
    const original = { data: {} };
    const state = mockedState.updateIn(
      ['exchangeRates', 'rates', 'HBT_USD'],
      (rate) => rate.set('original', original)
    );
    expect(exchangeRateSelector(state)).toEqual(original);
  });
  it('should select tickers state', () => {
    const tickersSelector = makeSelectTickers();
    const tickersState = fromJS([
      { id: 1 }, { id: 2 },
    ]);
    expect(tickersSelector(mockedState)).toEqual(tickersState);
  });
});
