/*
 *
 * App level reducer
 *
 */

import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

import {
  CHANGE_NETWORK,
  LOAD_RELEASE_NOTES_SUCCESS,
  HIDE_RELEASE_NOTES,
  SHOW_RELEASE_NOTES,
} from './constants';

export const initialState = fromJS({
  currentNetwork: SUPPORTED_NETWORKS.ropsten,
  supportedNetworks: SUPPORTED_NETWORKS,
  releaseNotes: {
    show: false,
    version: null,
    body: null,
  },
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NETWORK:
      return state
        .set('currentNetwork', fromJS(action.network));
    case LOAD_RELEASE_NOTES_SUCCESS:
      return state
        .setIn(['releaseNotes', 'show'], true)
        .setIn(['releaseNotes', 'body'], action.notes.body)
        .setIn(['releaseNotes', 'version'], action.notes.tag_name);
    case HIDE_RELEASE_NOTES:
      return state
        .setIn(['releaseNotes', 'show'], false);
    case SHOW_RELEASE_NOTES:
      return state
        .setIn(['releaseNotes', 'show'], true);
    default:
      return state;
  }
}

export default appReducer;
