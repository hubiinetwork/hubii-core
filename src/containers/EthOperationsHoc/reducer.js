/*
 *
 * EthOperationsHoc reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_BLOCK_HEIGHT_ERROR,
  LOAD_BLOCK_HEIGHT_SUCCESS,
} from './constants';

export const initialState = fromJS({
  blockHeight: {
    loading: true,
    error: null,
    height: -1,
  },
});

function ethOperationsHocReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BLOCK_HEIGHT_SUCCESS:
      return state
        .setIn(['blockHeight', 'loading'], false)
        .setIn(['blockHeight', 'error'], null)
        .setIn(['blockHeight', 'height'], action.blockHeight);
    case LOAD_BLOCK_HEIGHT_ERROR:
      return state
        .setIn(['blockHeight', 'loading'], false)
        .setIn(['blockHeight', 'error'], action.error);
    default:
      return state;
  }
}

export default ethOperationsHocReducer;
