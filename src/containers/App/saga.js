import { takeEvery } from 'redux-saga/effects';

import Notification from 'components/Notification';

import { NOTIFY } from './constants';

export function* notifyUI({ messageType, message, customDuration }) {
  yield Promise.resolve(Notification(messageType, message, customDuration));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
}
