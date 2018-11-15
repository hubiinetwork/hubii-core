/*
 *
 * App level reducer
 *
 */

import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

import {
  LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS,
} from 'containers/HubiiApiHoc/constants';

import {
  CHANGE_NETWORK,
} from './constants';

export const initialState = fromJS({
  currentNetwork: SUPPORTED_NETWORKS.homestead,
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
        .setIn(['currentNetwork', 'identityServiceToken'], fromJS(action.token));
    default:
      return state;
  }
}

export default appReducer;
