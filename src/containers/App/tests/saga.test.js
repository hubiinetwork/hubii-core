/**
 * App sagas
 */

import { expectSaga } from 'redux-saga-test-plan';

/* eslint-disable redux-saga/yield-effects */
import { takeEvery } from 'redux-saga/effects';

import Notification from 'components/Notification';


import app, {
  notifyUI,
  hookChangeNetwork,
} from '../saga';

import {
  NOTIFY,
  CHANGE_NETWORK,
} from '../constants';

import {
  notify,
} from '../actions';

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
