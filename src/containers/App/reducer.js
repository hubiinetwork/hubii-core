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
  UPDATE_NAHMII_PROVIDER,
  UPDATE_CURRENT_NETWORK_NAHMII_PROVIDER,
} from './constants';

export const initialState = fromJS({
  currentNetwork: SUPPORTED_NETWORKS.mainnet,
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
        .set('currentNetwork', state.get('supportedNetworks').get(action.name));
    case LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS:
      return state
        .setIn(['currentNetwork', 'identityServiceToken'], fromJS(action.token));
    case UPDATE_NAHMII_PROVIDER:
      return state
        .setIn(['supportedNetworks', action.networkName, 'nahmiiProvider'], fromJS(action.nahmiiProvider));
    case UPDATE_CURRENT_NETWORK_NAHMII_PROVIDER:
      return state
        .setIn(['currentNetwork', 'nahmiiProvider'], action.nahmiiProvider);
    default:
      return state;
  }
}

export default appReducer;
