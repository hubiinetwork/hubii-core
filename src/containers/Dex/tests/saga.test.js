import { eventChannel } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';

import { storeMock } from 'mocks/store';
import dexWatcher, { createLatestPriceChannel } from '../saga';

import dexReducer, { initialState } from '../reducer';

import * as actions from '../actions';

const withReducer = (state, action) => state.set('dex', dexReducer(state.get('dex'), action));

describe('dex saga', () => {
  it('should load and store price history', () => {
    const data = [
      {
        date: '1-31-2018',
        open: 10108.2,
        high: 10381.6,
        low: 9777.42,
        close: 10221.1,
        volume: 8041160000,
      },
      {
        date: '2-1-2018',
        open: 10237.3,
        high: 10288.8,
        low: 8812.28,
        close: 9170.54,
        volume: 9959400000,
      },
    ];
    const currency = 'bitcoin';
    const state = storeMock.set('dex', initialState);
    return expectSaga(dexWatcher)
      .withReducer(withReducer, state)
      .provide({
        call() {
          return data;
        },
      })
      .dispatch(actions.loadPriceHistory(currency))
      .run()
      .then((result) => {
        const priceHistory = result.storeState.getIn(['dex', 'prices', currency, 'history']);
        expect(priceHistory.length).toEqual(2);
      });
  });
  it('should update latest price', () => {
    const price = fromJS({
      date: '2-2-2018',
      open: 10237.3,
      high: 10288.8,
      low: 8812.28,
      close: 9170.54,
      volume: 9959400000,
    });
    const currency = 'bitcoin';
    const state = storeMock.set('dex', initialState);
    return expectSaga(dexWatcher)
      .withReducer(withReducer, state)
      .provide({
        call(effect) {
          let result;
          if (effect.fn === createLatestPriceChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ currency: 'bitcoin', price });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
      })
      .dispatch(actions.listenLatestPrice(currency))
      .run()
      .then((result) => {
        const priceHistory = result.storeState.getIn(['dex', 'latestPrice', currency]);
        expect(priceHistory).toEqual(price);
      });
  });
});
