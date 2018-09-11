import { fromJS } from 'immutable';

import {
  LOAD_RELEASE_NOTES_SUCCESS,
  HIDE_RELEASE_NOTES,
  SHOW_RELEASE_NOTES,
} from './constants';

export const initialState = fromJS({
  show: false,
  version: null,
  body: null,
});


function releaseNotesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_RELEASE_NOTES_SUCCESS:
      return state
        .setIn(['show'], true)
        .setIn(['body'], action.notes.body)
        .setIn(['version'], action.notes.tag_name);
    case HIDE_RELEASE_NOTES:
      return state
        .setIn(['show'], false);
    case SHOW_RELEASE_NOTES:
      return state
        .setIn(['show'], true);
    default:
      return state;
  }
}

export default releaseNotesReducer;
