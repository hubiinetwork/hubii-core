/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { dynamic } from 'redux-saga-test-plan/providers';
import listenExchangeRateAction, { getInfo, getTickers, getTickerData } from '../saga';
import { LOAD_TICKERS_SUCCESS, LOAD_TICKERS_FAILURE } from '../constants';
// import { makeSelectTickers } from '../selectors';
import {
  loadExchangeRate,
  exchangeRateLoaded,
  exchangeRateLoadingError,
  tickersLoadingError,
  tickersLoaded,
} from '../actions';

describe('getInfo Saga', () => {
  const tickers = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      website_slug: 'bitcoin',
    },
    {
      id: 2,
      name: 'Litecoin',
      symbol: 'LTC',
      website_slug: 'litecoin',
    },
    {
      id: 2031,
      name: 'Namecoin',
      symbol: 'HBT',
      website_slug: 'hubii',
    },
  ];
  describe('#getTickers', () => {
    let getTickersGenerator;
    const tickersResponse = {
      data: tickers,
    };
    beforeEach(() => {
      getTickersGenerator = getTickers();
      const yieldValue = getTickersGenerator.next().value;
      expect(yieldValue.SELECT).toBeDefined();
      expect(yieldValue.SELECT.selector).toBeDefined();
    });
    describe('with cache', () => {
      it('should return tickers from cache if available', () => {
        const yieldValue = getTickersGenerator.next(tickers).value;
        expect(yieldValue).toEqual(tickers);
      });
    });
    describe('without cache', () => {
      beforeEach(() => {
        const yieldValue = getTickersGenerator.next().value;
        expect(yieldValue.CALL).toBeDefined();
        expect(yieldValue.CALL.args[0]).toEqual('listings/');
        expect(yieldValue.CALL.args[2]).toEqual('https://api.coinmarketcap.com/v2/');
      });
      it('should fetch tickers if no cache is available', () => {
        const yieldValue = getTickersGenerator.next(tickersResponse).value;
        expect(yieldValue).toEqual(put(tickersLoaded(tickers)));

        const returnValue = getTickersGenerator.next().value;
        expect(returnValue).toEqual(tickers);
      });
      it('should handle request exception', () => {
        const response = new Error('error');
        const yieldValue = getTickersGenerator.throw(response).value;
        expect(yieldValue).toEqual(put(tickersLoadingError(response)));
      });
    });
  });

  describe('#getTickerData', () => {
    let getTickersGenerator;
    const tickerData = { data: {} };
    const action = { ticker: 'HBT', convert: 'BTC' };
    beforeEach(() => {
      getTickersGenerator = getTickerData(tickers, action);
      const yieldValue = getTickersGenerator.next().value;
      expect(yieldValue.SELECT).toBeDefined();
      expect(yieldValue.SELECT.selector).toBeDefined();
    });
    describe('with cache', () => {
      it('should return tickerData from cache if available', () => {
        getTickersGenerator.next(tickerData);

        // yield delay
        const yieldValue = getTickersGenerator.next().value;

        expect(yieldValue).toEqual(put(exchangeRateLoaded({ tickerData, convert: action.convert })));
      });
    });
    describe('without cache', () => {
      beforeEach(() => {
        const yieldValue = getTickersGenerator.next().value;
        expect(yieldValue.CALL).toBeDefined();
        const tickerId = tickers.filter((ticker) => ticker.symbol === action.ticker)[0].id;
        expect(yieldValue.CALL.args[0]).toEqual(`ticker/${tickerId}/?convert=${action.convert}`);
        expect(yieldValue.CALL.args[2]).toEqual('https://api.coinmarketcap.com/v2/');
      });
      it('should fetch tickers if no cache is available', () => {
        getTickersGenerator.next(tickerData);

        // yield delay
        const yieldValue = getTickersGenerator.next().value;

        expect(yieldValue).toEqual(put(exchangeRateLoaded({ tickerData, convert: action.convert })));
      });
      it('should handle request exception', () => {
        const response = new Error('error');
        const yieldValue = getTickersGenerator.throw(response).value;
        expect(yieldValue).toEqual(put(exchangeRateLoadingError({ error: response, ticker: action.ticker, convert: action.convert })));
      });
    });
  });
  describe('#getInfo', () => {
    let getInfoGenerator;
    const action = { ticker: 'HBT', convert: 'BTC' };
    it('should dispatch exchangeRateLoadingError action when tickers no available', () => {
      getInfoGenerator = getInfo(action);
      getInfoGenerator.next();
      const yieldValue = getInfoGenerator.next().value;
      expect(yieldValue).toEqual(put(exchangeRateLoadingError({
        error: new Error('no tickers available'),
        ticker: action.ticker,
        convert: action.convert,
      })));
    });
  });
});

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

describe('root Saga', () => {
  // const exchangeRateGenerator = listenExchangeRateAction();

  it('should start task to watch for LOAD_EXCHANGE_RATE action', () => {
    const loadExchangeRateAction = loadExchangeRate({ ticker: 'test', convert: 'test' });
    return expectSaga(listenExchangeRateAction)
      .provide([
        [matchers.call.fn(getTickers), dynamic((args, next) => delay(10).then(next))],
        [matchers.call.fn(getInfo), {}],
      ])
      .dispatch(loadExchangeRateAction)
      .dispatch(loadExchangeRateAction)
      .delay(20)
      .dispatch({ type: LOAD_TICKERS_SUCCESS })

      .run({ silenceTimeout: true }).then((result) => {
        const records = result.toJSON();
        expect(records.call.filter((call) => call.CALL.fn === '@@redux-saga-test-plan/json/function/getTickers')).toHaveLength(1);
        expect(records.take.filter((take) => take.TAKE.pattern[0] === LOAD_TICKERS_SUCCESS && take.TAKE.pattern[1] === LOAD_TICKERS_FAILURE)).toHaveLength(1);
        expect(records.call.filter((call) => call.CALL.fn === '@@redux-saga-test-plan/json/function/getInfo')).toHaveLength(2);
      });
  });
});
