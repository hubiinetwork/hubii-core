/*
 *
 * App level reducer
 *
 */

import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

import {
  CHANGE_NETWORK,
  LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS,
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
    case LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS:
      return state
        .setIn(['currentNetwork', 'identityServiceToken'], fromJS(action.token.userToken));
    default:
      return state;
  }
}

export default appReducer;
