import { takeEvery, takeLatest, call, put } from 'redux-saga/effects';

import Notification from 'components/Notification';
import request from 'utils/request';

import { NOTIFY, LOAD_RELEASE_NOTES } from './constants';
import { loadReleaseNotesSuccess } from './actions';

export function* notifyUI({ messageType, message }) {
  yield Promise.resolve(Notification(messageType, message));
}

export function* loadReleaseNotes() {
  const response = yield call(request, '/repos/LedgerHQ/ledger-live-desktop/releases', {}, 'https://api.github.com');
  yield put(loadReleaseNotesSuccess(response[0]));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
  yield takeLatest(LOAD_RELEASE_NOTES, loadReleaseNotes);
}
