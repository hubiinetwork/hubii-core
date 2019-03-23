/**
 * App sagas
 */

import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';

/* eslint-disable redux-saga/yield-effects */
import { takeEvery } from 'redux-saga/effects';
import { NahmiiProvider } from 'nahmii-sdk';

import { SUPPORTED_NETWORKS } from 'config/constants';
import Notification from 'components/Notification';


import app, {
  notifyUI,
  hookChangeNetwork,
  initNahmiiProviders,
} from '../saga';

import {
  NOTIFY,
  CHANGE_NETWORK,
} from '../constants';

import {
  notify,
  initNetworkActivity,
  updateNahmiiProvider,
  updateCurrentNetworkNahmiiProvider,
} from '../actions';

import appReducer, { initialState } from '../reducer';

const withReducer = (state, action) => state.set('app', appReducer(state.get('app'), action));

describe('notifyUI saga', () => {
  it('should create a notification', () => {
    const type = 'success';
    const message = 'hello world!';
    const notifyUIGenerator = notifyUI({ type, message });
    const promiseDescriptor = notifyUIGenerator.next().value;
    expect(promiseDescriptor).toEqual(Promise.resolve(Notification(type, message)));
  });
});

describe('hookChangeNetwork saga', () => {
  it('should dispatch the notify action', () => expectSaga(hookChangeNetwork)
      .put(notify('success', 'Network changed'))
      .run()
  );
});


describe('root Saga', () => {
  const appSaga = app();

  it('should start task to watch for NOTIFY action', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(NOTIFY, notifyUI));
  });

  it('should start task to watch for CHANGE_NETWORK action', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CHANGE_NETWORK, hookChangeNetwork));
  });
});

describe('init nahmii providers', () => {
  it('should dynamically init nahmii providers and init default nahmii provider', () => {
    const nahmiiProviders = [
      { provider: new NahmiiProvider('1', '1', '1', 1), name: 'mainnet' },
      { provider: new NahmiiProvider('3', '3', '3', 3), name: 'ropsten' },
    ];
    return expectSaga(initNahmiiProviders)
        .withReducer(withReducer, fromJS({ app: initialState }))
        .provide({
          call(effect) {
            if (effect.fn.name === 'from') {
              if (effect.args[0] === 'api.nahmii.io') {
                return nahmiiProviders[0].provider;
              }
              return nahmiiProviders[1].provider;
            }
            return null;
          },
        })
        .put(updateNahmiiProvider(nahmiiProviders[0].provider, nahmiiProviders[0].name))
        .put(updateNahmiiProvider(nahmiiProviders[1].provider, nahmiiProviders[1].name))
        .put(
          updateCurrentNetworkNahmiiProvider(
            nahmiiProviders
              .find((p) => p.name === initialState.get('currentNetwork').get('name'))
              .provider
          )
        )
        .put(initNetworkActivity())
        .run({ silenceTimeout: true })
        .then((result) => {
          const supportedNetworks = result.storeState.getIn(['app', 'supportedNetworks']);
          const currentNetwork = result.storeState.getIn(['app', 'currentNetwork']);
          expect(supportedNetworks.getIn(['mainnet', 'nahmiiProvider'])).toEqual(nahmiiProviders[0].provider);
          expect(supportedNetworks.getIn(['ropsten', 'nahmiiProvider'])).toEqual(nahmiiProviders[1].provider);
          expect(currentNetwork.get('nahmiiProvider')).toEqual(nahmiiProviders[1].provider);
        });
  });
  it('should use default default nahmii providers when failed to determine from API', () => expectSaga(initNahmiiProviders)
        .withReducer(withReducer, fromJS({ app: initialState }))
        .provide({
          call() {
            throw new Error();
          },
        })
        .put(updateNahmiiProvider(SUPPORTED_NETWORKS.mainnet.defaultNahmiiProvider, SUPPORTED_NETWORKS.mainnet.name))
        .put(updateNahmiiProvider(SUPPORTED_NETWORKS.ropsten.defaultNahmiiProvider, SUPPORTED_NETWORKS.ropsten.name))
        .put(updateCurrentNetworkNahmiiProvider(SUPPORTED_NETWORKS[initialState.get('currentNetwork').get('name')].defaultNahmiiProvider))
        .put(initNetworkActivity())
        .run({ silenceTimeout: true })
        .then((result) => {
          const supportedNetworks = result.storeState.getIn(['app', 'supportedNetworks']);
          const currentNetwork = result.storeState.getIn(['app', 'currentNetwork']);
          expect(supportedNetworks.getIn(['mainnet', 'nahmiiProvider'])).toEqual(SUPPORTED_NETWORKS.mainnet.defaultNahmiiProvider);
          expect(supportedNetworks.getIn(['ropsten', 'nahmiiProvider'])).toEqual(SUPPORTED_NETWORKS.ropsten.defaultNahmiiProvider);
          expect(currentNetwork.get('nahmiiProvider')).toEqual(SUPPORTED_NETWORKS[initialState.get('currentNetwork').get('name')].defaultNahmiiProvider);
        }));
});
