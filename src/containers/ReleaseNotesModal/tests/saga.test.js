
import { takeLatest, all, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';

import request from 'utils/request';

import appReducer from '../reducer';

import app, {
  installNewRelease,
  watchNewRelease,
  releaseNotesChannel,
} from '../saga';

import * as actions from '../actions';

import {
  INSTALL_NEW_RELEASE,
} from '../constants';

describe('release notes', () => {
  const releaseNotes = {
    show: true,
    tag_name: '1',
    body: 'test',
  };
  it('should load and store release notes', () => expectSaga(watchNewRelease)
    .withReducer(appReducer)
    .provide({
      call(effect) {
        let result;
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
            releaseNotes, {},
          ];
        }
        return result;
      },
    })
    .put(actions.loadReleaseNotesSuccess(releaseNotes))
    .run({ silenceTimeout: true })
    .then((result) => {
      const state = result.storeState;
      expect(state.getIn(['show'])).toEqual(releaseNotes.show);
      expect(state.getIn(['version'])).toEqual(releaseNotes.tag_name);
      expect(state.getIn(['body'])).toEqual(releaseNotes.body);
    }));
});

describe('root Saga', () => {
  const appSaga = app();

  it('should start task to watch for actions', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(
      all(
        [
          takeLatest(INSTALL_NEW_RELEASE, installNewRelease),
          fork(watchNewRelease),
        ]
      )
    );
  });
});
