import { ipcRenderer } from 'electron';
import { take, takeLatest, call, put, all, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { REPO, OWNER } from 'config/constants';
import request from 'utils/request';

import { notify } from 'containers/App/actions';
import { INSTALL_NEW_RELEASE } from './constants';
import * as actions from './actions';

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
      notify('error', e);
    }
  }
}

export default function* app() {
  yield all([
    takeLatest(INSTALL_NEW_RELEASE, installNewRelease),
    fork(watchNewRelease),
  ]);
}
