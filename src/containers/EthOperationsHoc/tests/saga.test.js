import { testSaga } from 'redux-saga-test-plan';
import { createMockTask } from 'redux-saga/utils';

import { fork, takeEvery } from 'redux-saga/effects';

import {
  CHANGE_NETWORK,
  INIT_NETWORK_ACTIVITY,
} from 'containers/App/constants';

import {
  currentNetworkMock,
} from 'containers/App/tests/mocks/selectors';

import ethOperationsHoc, {
  loadBlockHeight, ethOperationsOrcestrator,
} from '../saga';

import {
  loadBlockHeightSuccess,
  loadBlockHeightError,
} from '../actions';


describe('load block height', () => {
  const height = '50';
  let saga;
  beforeEach(() => {
    saga = testSaga(loadBlockHeight, currentNetworkMock.provider);
  });
  it('should correctly handle success scenario', () => {
    saga
        .next() // eth provider
        .next(height).put(loadBlockHeightSuccess(height))
        .next() // delay
        .next() // eth provider
        .next(height).put(loadBlockHeightSuccess(height));
  });

  it('should correctly handle err scenario', () => {
    const e = new Error('some err');
    saga
        .next() // eth provider
        .throw(e).put(loadBlockHeightError(e))
        .next() // delay
        .next() // eth provider
        .next(height).put(loadBlockHeightSuccess(height));
  });

  it('should correctly drop existing call and stop when cancelled', () => {
    const e = new Error(e);
    saga
      .next() // eth provider
      .next().finish()
      .next().isDone();
  });
});

describe('eth operations orcentrator', () => {
  const mockTask = createMockTask();
  it('should fork all required sagas, cancelling and restarting on CHANGE_NETWORK', () => {
    const saga = testSaga(ethOperationsOrcestrator);
    const allSagas = [
      fork(loadBlockHeight, currentNetworkMock.provider),
    ];
    saga
        .next() // network selector
        .next(currentNetworkMock).all(allSagas)
        .next([mockTask]).take(CHANGE_NETWORK)
        .next().cancel(mockTask)
        .next() // notify
        .next() // network selector
        .next(currentNetworkMock).all(allSagas);
  });
});

describe('root Saga', () => {
  const ethOperationsHocSaga = ethOperationsHoc();
  it('should start task to watch for INIT_NETWORK_ACTIVITY action', () => {
    const takeDescriptor = ethOperationsHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(INIT_NETWORK_ACTIVITY, ethOperationsOrcestrator));
  });
});
