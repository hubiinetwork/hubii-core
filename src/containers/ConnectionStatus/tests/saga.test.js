/**
 * App sagas
 */

import { expectSaga } from 'redux-saga-test-plan';

/* eslint-disable redux-saga/yield-effects */
import { takeEvery } from 'redux-saga/effects';

import {
  LOAD_NAHMII_BALANCES_ERROR,
  LOAD_NAHMII_BALANCES_SUCCESS,
} from 'containers/NahmiiHoc/constants';

import root, { handleError, errorSuccessPairs } from '../saga';
import { networkFailure, networkReconnected } from '../actions';

describe('handleError saga', () => {
  it('handles a network failure of over 5 seconds', () =>
    expectSaga(handleError, { type: LOAD_NAHMII_BALANCES_ERROR })
      .provide({
        race: () => ({ timeout: true }),
        take: () => {},
      })
      .put(networkFailure(LOAD_NAHMII_BALANCES_ERROR))
      .dispatch(LOAD_NAHMII_BALANCES_SUCCESS)
      .put(networkReconnected(LOAD_NAHMII_BALANCES_ERROR))
      .run()
  );

  it('handles a network failure of less than 5 seconds', () =>
    expectSaga(handleError, { type: LOAD_NAHMII_BALANCES_ERROR })
      .provide({
        race: () => ({ timeout: false }),
        take: () => {},
      })
      .not.put(networkFailure(LOAD_NAHMII_BALANCES_ERROR))
      .not.put(networkReconnected(LOAD_NAHMII_BALANCES_ERROR))
      .run()
  );
});

describe('root Saga', () => {
  const rootSaga = root();

  it('should start task to listen for all keys in the errorSuccessPairs object', () => {
    const takeDescriptor = rootSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery([...Object.keys(errorSuccessPairs)], handleError));
  });
});
