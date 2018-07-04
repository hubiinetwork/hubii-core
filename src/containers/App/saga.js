import { takeEvery } from 'redux-saga/effects';

import Notification from 'components/Notification';

import { NOTIFY } from './constants';

export function* notifyUI({ type, message }) {
  yield Promise.resolve(Notification(type, message));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
}
