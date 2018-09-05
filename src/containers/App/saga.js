import { ipcRenderer } from 'electron';
import { takeEvery, take, takeLatest, call, put, all, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { REPO, OWNER } from 'config/constants';
import Notification from 'components/Notification';
import request from 'utils/request';

import { NOTIFY, INSTALL_NEW_RELEASE } from './constants';
import * as actions from './actions';

export function* notifyUI({ messageType, message }) {
  yield Promise.resolve(Notification(messageType, message));
}

export const installNewRelease = () => {
  ipcRenderer.send('install-new-release');
};

export const releaseNotesChannel = () => eventChannel((emit) => {
  ipcRenderer.on('update-downloaded', () => {
    emit({});
  });
  return () => { };
});

export function* watchNewRelease() {
  const chan = yield call(releaseNotesChannel);

  while (true) { // eslint-disable-line no-constant-condition
    try {
      yield take(chan);
      const response = yield call(request, `/repos/${OWNER}/${REPO}/releases`, {}, 'https://api.github.com');
      yield put(actions.loadReleaseNotesSuccess(response[0]));
    } catch (e) {
      actions.notify('error', e);
    }
  }
}

export default function* app() {
  yield all([
    takeEvery(NOTIFY, notifyUI),
    takeLatest(INSTALL_NEW_RELEASE, installNewRelease),
    fork(watchNewRelease),
  ]);
}
