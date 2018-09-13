/*
 *
 * App level reducer
 *
 */

import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

import {
  CHANGE_NETWORK,
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
    default:
      return state;
  }
}

export default appReducer;
