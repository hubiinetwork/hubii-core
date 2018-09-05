/**
 * App sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeEvery, takeLatest, all, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';

import Notification from 'components/Notification';

import request from 'utils/request'

import appReducer from '../reducer'

import app, {
  notifyUI,
  installNewRelease,
  watchNewRelease,
  releaseNotesChannel,
} from '../saga';

import * as actions from '../actions'

import {
  NOTIFY,
  INSTALL_NEW_RELEASE,
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

describe('release notes', () => {
  const releaseNotes = {
    show: true,
    tag_name: '1',
    body: 'test',
  }
  it('should load and store release notes', () => {
    return expectSaga(watchNewRelease)
    .withReducer(appReducer)
    .provide({
      call(effect) {
        let result
        if (effect.fn === releaseNotesChannel) {
          result = eventChannel((emitter) => {
            setTimeout(() => {
              emitter({ });
            }, 100);
            return () => {};
          });
        }
        if (effect.fn === request) {
          result = [
            releaseNotes, {}
          ]
        }
        return result;
      },
    })
    .put(actions.loadReleaseNotesSuccess(releaseNotes))
    .run({ silenceTimeout: true })
    .then((result) => {
      const state = result.storeState;
      expect(state.getIn(['releaseNotes', 'show'])).toEqual(releaseNotes.show);
      expect(state.getIn(['releaseNotes', 'version'])).toEqual(releaseNotes.tag_name);
      expect(state.getIn(['releaseNotes', 'body'])).toEqual(releaseNotes.body);
    });
  });
})

describe('root Saga', () => {
  const appSaga = app();

  it('should start task to watch for NOTIFY action', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(
      all(
        [
          takeEvery(NOTIFY, notifyUI),
          takeLatest(INSTALL_NEW_RELEASE, installNewRelease),
          fork(watchNewRelease),
        ]
      )
    );
  });
});
