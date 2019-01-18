/*
 *
 * ConnectionStatus reducer
 *
 */

import { fromJS, Set } from 'immutable';
import { NETWORK_FAILURE, NETWORK_RECONNECTED } from './constants';

const initialState = fromJS({
  errors: new Set(),
});

function connectionStatusReducer(state = initialState, action) {
  switch (action.type) {
    case NETWORK_FAILURE:
      return state.updateIn(['errors'], (errors) => errors.add(action.errorType));
    case NETWORK_RECONNECTED:
      return state.updateIn(['errors'], (errors) => errors.remove(action.errorType));
    default:
      return state;
  }
}

export default connectionStatusReducer;
