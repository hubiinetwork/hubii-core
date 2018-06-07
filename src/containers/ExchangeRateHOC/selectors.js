import { createSelector } from 'reselect';

const selectExchangeRatesDomain = (state) => state.get('exchangeRates');

const makeSelectExchangeRates = () => createSelector(
  selectExchangeRatesDomain,
  (exchangeRatesDomain) => exchangeRatesDomain.get('rates')
);
const makeSelectExchangeRateCache = (ticker, convert) => createSelector(
  selectExchangeRatesDomain,
  (exchangeRatesDomain) => {
    const rate = exchangeRatesDomain.get('rates').toJS()[`${ticker}_${convert}`];
    if (rate && rate.original) {
      return rate.original;
    }
    return null;
  }
);

const makeSelectTickers = () => createSelector(
  selectExchangeRatesDomain,
  (exchangeRatesDomain) => exchangeRatesDomain.get('tickers')
);

export default selectExchangeRatesDomain;
export {
  makeSelectExchangeRates,
  makeSelectExchangeRateCache,
  makeSelectTickers,
};
