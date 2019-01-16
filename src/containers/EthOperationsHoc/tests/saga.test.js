import { testSaga, expectSaga } from 'redux-saga-test-plan';
import { createMockTask } from 'redux-saga/utils';

import { fork, takeEvery } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import {
  CHANGE_NETWORK,
  INIT_NETWORK_ACTIVITY,
} from 'containers/App/constants';

import {
  currentNetworkMock,
} from 'containers/App/tests/mocks/selectors';

import ethOperationsHocReducer, { initialState } from 'containers/EthOperationsHoc/reducer';

import ethOperationsHoc, {
  loadBlockHeight, ethOperationsOrcestrator, loadGasStatistics,
} from '../saga';

import {
  loadBlockHeightSuccess,
  loadBlockHeightError,
  loadGasStatisticsSuccess,
  loadGasStatisticsError,
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
      fork(loadGasStatistics),
    ];
    saga
        .next() // network selector
        .next(currentNetworkMock).all(allSagas)
        .next([mockTask]).take(CHANGE_NETWORK)
        .next().cancel(mockTask)
        .next() // network selector
        .next(currentNetworkMock).all(allSagas);
  });
});

describe('gas estimation', () => {
  const withReducer = (state, action) => state.set('ethOperationsHoc', ethOperationsHocReducer(state.get('ethOperationsHoc'), action));
  it('should load estimation for gas price', () => {
    const state = fromJS({}).set('ethOperationsHoc', initialState);
    const gasEstimate = fromJS({
      safeLow: 19.0,
      safeLowWait: 22.1,
      fast: 100.0,
      fastWait: 0.7,
      fastest: 250.0,
      fastestWait: 0.5,
      average: 41.0,
      avgWait: 1.6,
      block_time: 13.98421052631579,
      speed: 0.8085666916661166,
      blockNum: 7068199,
    });
    return expectSaga(loadGasStatistics)
      .withReducer(withReducer, state)
      .provide({
        call() {
          return gasEstimate;
        },
      })
      .put(loadGasStatisticsSuccess(gasEstimate))
      .run({ silenceTimeout: true })
      .then((result) => {
        const gasStatistics = result.storeState.getIn(['ethOperationsHoc', 'gasStatistics']);
        expect(gasStatistics.get('estimate')).toEqual(gasEstimate);
      });
  });
  it('should handle error', () => {
    const state = fromJS({}).set('ethOperationsHoc', initialState);
    const error = new Error();
    return expectSaga(loadGasStatistics)
      .withReducer(withReducer, state)
      .provide({
        call() {
          throw error;
        },
      })
      .put(loadGasStatisticsError(error))
      .run({ silenceTimeout: true })
      .then((result) => {
        const gasStatistics = result.storeState.getIn(['ethOperationsHoc', 'gasStatistics']);
        expect(gasStatistics.get('estimate')).toEqual(null);
        expect(gasStatistics.get('error')).toEqual(error);
      });
  });
});

describe('root Saga', () => {
  const ethOperationsHocSaga = ethOperationsHoc();
  it('should start task to watch for INIT_NETWORK_ACTIVITY action', () => {
    const takeDescriptor = ethOperationsHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(INIT_NETWORK_ACTIVITY, ethOperationsOrcestrator));
  });
});
