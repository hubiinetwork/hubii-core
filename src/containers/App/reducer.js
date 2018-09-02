/*
 *
 * App level reducer
 *
 */

import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

import { CHANGE_NETWORK } from './constants';

export const initialState = fromJS({
  currentNetwork: 'mainnet',
  supportedNetworks: SUPPORTED_NETWORKS,
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NETWORK:
      return state
        .set('currentNetwork', action.name);
    default:
      return state;
  }
}

export default appReducer;
