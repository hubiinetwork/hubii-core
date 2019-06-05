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
  DECRYPT_IMPORT_SUCCESS,
  DECRYPT_IMPORT_ERROR,
  BATCH_EXPORT_ERROR,
  BATCH_IMPORT_SUCCESS,
} from './constants';

export const initialState = fromJS({
  currentNetwork: process.env.NODE_ENV === 'production' ? SUPPORTED_NETWORKS.mainnet : SUPPORTED_NETWORKS.ropsten,
  supportedNetworks: SUPPORTED_NETWORKS,
  releaseNotes: {
    show: false,
    version: null,
    body: null,
  },
  restore: {},
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
    case BATCH_EXPORT_ERROR:
      return state
        .setIn(['restore', 'export', 'error'], action.error);
    case DECRYPT_IMPORT_ERROR:
      return state
        .setIn(['restore', 'import', 'error'], action.error)
        .setIn(['restore', 'import', 'data'], null);
    case DECRYPT_IMPORT_SUCCESS:
      return state
        .setIn(['restore', 'import', 'error'], null)
        .setIn(['restore', 'import', 'data'], action.decryptedContent);
    case BATCH_IMPORT_SUCCESS:
      return state
        .setIn(['restore', 'import', 'error'], null)
        .setIn(['restore', 'import', 'data'], null);
    default:
      return state;
  }
}

export default appReducer;
