/**
 * App sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeEvery } from 'redux-saga/effects';

import Notification from 'components/Notification';


import app, {
  notifyUI,
} from '../saga';

import {
  NOTIFY,
} from '../constants';

describe('notifyUI saga', () => {
  it('should dispatch the notify action', () => {
    const type = 'success';
    const message = 'hello world!';
    const notifyUIGenerator = notifyUI({ type, message });
    const promiseDescriptor = notifyUIGenerator.next().value;
    expect(promiseDescriptor).toEqual(Promise.resolve(Notification(type, message)));
  });
});


describe('root Saga', () => {
  const appSaga = app();

  it('should start task to watch for NOTIFY action', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(NOTIFY, notifyUI));
  });
});
