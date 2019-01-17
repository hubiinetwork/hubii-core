/*
 *
 * EthOperationsHoc reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_BLOCK_HEIGHT_ERROR,
  LOAD_BLOCK_HEIGHT_SUCCESS,
  LOAD_GAS_STATISTICS,
  LOAD_GAS_STATISTICS_SUCCESS,
  LOAD_GAS_STATISTICS_ERROR,
} from './constants';

export const initialState = fromJS({
  blockHeight: {
    loading: true,
    error: null,
    height: -1,
  },
  gasStatistics: {},
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
    case LOAD_GAS_STATISTICS:
      return state
        .setIn(['gasStatistics', 'loading'], true);
    case LOAD_GAS_STATISTICS_SUCCESS:
      return state
        .setIn(['gasStatistics', 'loading'], false)
        .setIn(['gasStatistics', 'estimate'], action.gasStatistics);
    case LOAD_GAS_STATISTICS_ERROR:
      return state
        .setIn(['gasStatistics', 'loading'], false)
        .setIn(['gasStatistics', 'error'], action.error)
        .setIn(['gasStatistics', 'estimate'], null);
    default:
      return state;
  }
}

export default ethOperationsHocReducer;
