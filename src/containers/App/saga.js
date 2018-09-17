import { takeEvery, put } from 'redux-saga/effects';

import Notification from 'components/Notification';

import { NOTIFY, CHANGE_NETWORK } from './constants';
import { notify } from './actions';

export function* notifyUI({ messageType, message, customDuration }) {
  yield Promise.resolve(Notification(messageType, message, customDuration));
}

export function* hookChangeNetwork() {
  yield put(notify('success', 'Network changed'));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
  yield takeEvery(CHANGE_NETWORK, hookChangeNetwork);
}
