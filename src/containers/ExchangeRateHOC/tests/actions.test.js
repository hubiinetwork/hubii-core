import {
  LOAD_EXCHANGE_RATE,
  LOAD_EXCHANGE_RATE_SUCCESS,
  LOAD_EXCHANGE_RATE_FAILURE,
  LOAD_TICKERS_SUCCESS,
  LOAD_TICKERS_FAILURE,
} from '../constants';

import {
  loadExchangeRate,
  exchangeRateLoaded,
  exchangeRateLoadingError,
  tickersLoaded,
  tickersLoadingError,
} from '../actions';

describe('ExchangeRate Actions', () => {
  describe('Exchange Rates', () => {
    describe('loadExchangeRate', () => {
      it('should return the correct type', () => {
        const ticker = 'HBT';
        const convert = 'USD';
        const expected = {
          type: LOAD_EXCHANGE_RATE,
          ticker,
          convert,
        };

        expect(loadExchangeRate({ ticker, convert })).toEqual(expected);
      });
    });

    describe('exchangeRateLoaded', () => {
      it('should return the correct type with data', () => {
        const tickerData = {
          data: {
            id: 2031,
            symbol: 'HBT',
            quotes: {
              USD: {
                price: 0.624956,
              },
            },
          },
        };
        const convert = 'USD';
        const expected = {
          type: LOAD_EXCHANGE_RATE_SUCCESS,
          tickerData,
          convert,
        };

        expect(exchangeRateLoaded({ tickerData, convert })).toEqual(expected);
      });
    });

    describe('exchangeRateLoadingError', () => {
      it('should return the correct type and the error', () => {
        const ticker = 'HBT';
        const convert = 'USD';
        const error = 'Something went wrong!';
        const expected = {
          type: LOAD_EXCHANGE_RATE_FAILURE,
          error,
          ticker,
          convert,
        };

        expect(exchangeRateLoadingError({ error, ticker, convert })).toEqual(expected);
      });
    });
  });
  describe('Tickers', () => {
    describe('tickersLoaded', () => {
      it('should return the correct type with data', () => {
        const tickers = [
          {
            id: 1,
            symbol: 'btc',
          },
          {
            id: 2,
            symbol: 'eth',
          },
        ];
        const expected = {
          type: LOAD_TICKERS_SUCCESS,
          tickers,
        };

        expect(tickersLoaded(tickers)).toEqual(expected);
      });
    });

    describe('tickersLoadingError', () => {
      it('should return the correct type and the error', () => {
        const error = 'Something went wrong!';
        const expected = {
          type: LOAD_TICKERS_FAILURE,
          error,
        };

        expect(tickersLoadingError(error)).toEqual(expected);
      });
    });
  });
});
