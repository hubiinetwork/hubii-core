/*
 *
 * DepositPage reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LOAD_DEPOSIT_INFO,
  LOAD_DEPOSIT_INFO_SUCCESS,
  LOAD_DEPOSIT_INFO_FAILURE,
} from './constants';

const initialState = fromJS({
  loading: true,
  error: null,
  depositInfo: {
    time: 0,
    address: '',
    asset: '',
    amount: 0,
  },
});

function depositPageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DEPOSIT_INFO:
      return state
        .set('loading', true);
    case LOAD_DEPOSIT_INFO_SUCCESS:
      return state
        .set('depositInfo', fromJS(action.depositInfo))
        .set('error', null)
        .set('loading', false);
    case LOAD_DEPOSIT_INFO_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
    default:
      return state;
  }
}

export default depositPageReducer;
