import { eventChannel } from 'redux-saga';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import { fromJS } from 'immutable';
import { ethAppNotOpenErrorMsg, disconnectedErrorMsg } from 'utils/friendlyErrors';

import ledgerHoc, {
  initLedger,
  ledgerChannel,
  ledgerEthChannel,
  pollEthApp,
  tryCreateEthTransportActivity,
  fetchLedgerAddresses,
} from '../saga';

import ledgerHocReducer from '../reducer';

import {
  INIT_LEDGER,
} from '../constants';

import {
  ledgerError,
  ledgerEthAppConnected,
  ledgerEthAppDisconnected,
  ledgerConnected,
  ledgerDisconnected,
} from '../actions';

describe('ledger saga', () => {
  it('should trigger ledgerConnectedAction when ledger usb is connected', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    return expectSaga(initLedger)
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = true;
          }
          if (effect.fn === ledgerChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ type: 'add', descriptor });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
      })
      .put(ledgerConnected(descriptor))
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['ledgerHoc', 'connected'])).toEqual(true);
        expect(state.getIn(['ledgerHoc', 'descriptor'])).toEqual(descriptor);
      });
  });
  it('should trigger ledgerDisconnectedAction when ledger usb is discorded', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    return expectSaga(ledgerHoc)
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = true;
          }
          if (effect.fn === ledgerChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ type: 'remove', descriptor });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
        race() {
          return { timeout: true };
        },
      })
      .dispatch({ type: INIT_LEDGER })
      .put(ledgerDisconnected(descriptor))
      .put(ledgerError({ message: 'Disconnected' }))
      .not.put.actionType(ledgerConnected().type)
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['ledgerHoc', 'status'])).toEqual('disconnected');
        expect(state.getIn(['ledgerHoc', 'connected'])).toEqual(false);
        expect(state.getIn(['ledgerHoc', 'error'])).toEqual(disconnectedErrorMsg);
      });
  });
  it('should trigger nosupport error action when ledger is not supported', () => {
    const storeState = {};
    return expectSaga(initLedger)
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = false;
          }
          return result;
        },
      })
      .put(ledgerError(Error('NoSupport')))
      .not.put.actionType(ledgerDisconnected().type)
      .not.put.actionType(ledgerConnected().type)
      .run({ silenceTimeout: true });
  });
  it('should debounce remove event if add event follows within a second', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    return expectSaga(initLedger)
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = true;
          }
          if (effect.fn === ledgerChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ type: 'remove', descriptor });
                emitter({ type: 'add', descriptor });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
      })
      .put.actionType(ledgerConnected().type)
      .not.put.actionType(ledgerDisconnected().type)
      .run({ silenceTimeout: true });
  });
  it('should trigger ledger detected when ethereum app is open', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    const status = {
      address: {
        publicKey: 'test',
      },
    };
    return expectSaga(pollEthApp, { descriptor })
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          if (effect.fn === ledgerEthChannel) {
            return eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ connected: true, address: status.address });
              }, 100);
              return () => {};
            });
          }
          return true;
        },
      })
      .put(ledgerEthAppConnected(descriptor, status.address.publicKey))
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['ledgerHoc', 'status'])).toEqual('connected');
        expect(state.getIn(['ledgerHoc', 'ethConnected'])).toEqual(true);
        expect(state.getIn(['ledgerHoc', 'id'])).toEqual(status.address.publicKey);
      });
  });
  it('should trigger ledger detected when ethereum app is close', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    const error = { message: 'Incorrect length' };
    return expectSaga(pollEthApp, { descriptor })
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          if (effect.fn === ledgerEthChannel) {
            return eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ connected: false, error });
              }, 100);
              return () => {};
            });
          }
          return true;
        },
      })
      .put(ledgerEthAppDisconnected(descriptor))
      .put(ledgerError(error))
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['ledgerHoc', 'status'])).toEqual('disconnected');
        expect(state.getIn(['ledgerHoc', 'ethConnected'])).toEqual(false);
        expect(state.getIn(['ledgerHoc', 'error'])).toEqual(ethAppNotOpenErrorMsg);
      });
  });
  it('#tryCreateEthTransportActivity should start pollEthApp and rethrow the error to outer scope when throws exception', (done) => {
    const error = new Error();
    const descriptor = 'test';
    const method = 'test';
    const saga = testSaga(tryCreateEthTransportActivity, method, { descriptor });
    try {
      saga
        .next()

        .throw(error)
        .spawn(pollEthApp, { descriptor })

        .next()
        .isDone();
    } catch (err) {
      expect(err).toEqual(error);
      done();
    }
  });
  it('should trigger fetchedLedgerAddressAction when got address by path', () => {
    const storeState = {
      ledgerHoc: {
        descriptor: '123',
      },
    };
    const key = {
      address: '0x35cdc7719948Bba8c23834e1E482f84501C1B182',
      chainCode: '2bb1c3f7487080d8ce50c6768607c96dc5d17ffe31e19457add5be26e6257c7d',
      publicKey: '04c8429d878d35be22549b5e8d6a2c3af3a145f91823824a9fb602e5dbc0a3cf5212b3609e13427a581736d2afbcf3601ce420968c4abab06b3535899786046603',
    };
    const pathTemplate = "m/44'/60'/0'/{index}";
    const expectedAddresses = [
      '0xe1dddBd012f6a9f3F0A346A2b418aEcd03b058e7',
      '0x7344328668927e8B25Ee00751a072f751CBf4993',
      '0x003Ab49013842d8542EF9f2119A1822b1e9002fE',
      '0xDdCe775e7df165A8cd5b65556712d9074AFE2eC6',
      '0x6074A2987AA8A0963d8E0aa618D530fB366F9971',
    ];
    const firstIndex = 0;
    const lastIndex = 4;
    return expectSaga(fetchLedgerAddresses, { pathTemplate, firstIndex, lastIndex })
      .withReducer((state, action) => state.set('ledgerHoc', ledgerHocReducer(state.get('ledgerHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          if (effect.fn === tryCreateEthTransportActivity) {
            return key;
          }
          return {};
        },
      })
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['ledgerHoc', 'addresses']).count()).toEqual((lastIndex - firstIndex) + 1);
        for (let i = 0; i < expectedAddresses.length; i += 1) {
          expect(state.getIn(['ledgerHoc', 'addresses', pathTemplate.replace('{index}', i + firstIndex)])).toEqual(expectedAddresses[i]);
        }
      });
  });
});
