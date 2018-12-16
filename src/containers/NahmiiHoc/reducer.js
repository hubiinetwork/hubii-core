/*
 *
 * nahmiiHoc reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  LOAD_NAHMII_RECEIPTS,
  LOAD_NAHMII_RECEIPTS_SUCCESS,
  LOAD_NAHMII_RECEIPTS_ERROR,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
  receipts: {},
  transactions: {},
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_NAHMII_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'available', 'loading'], false)
        .setIn(['balances', action.address, 'available', 'error'], null)
        .setIn(['balances', action.address, 'available', 'assets'], fromJS(action.balances));
    case LOAD_NAHMII_STAGED_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'staged', 'loading'], false)
        .setIn(['balances', action.address, 'staged', 'error'], null)
        .setIn(['balances', action.address, 'staged', 'assets'], fromJS(action.balances));
    case LOAD_NAHMII_STAGING_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'staging', 'loading'], false)
        .setIn(['balances', action.address, 'staging', 'error'], null)
        .setIn(['balances', action.address, 'staging', 'assets'], fromJS(action.balances));
    case LOAD_NAHMII_RECEIPTS:
      return state
        .setIn(['receipts', action.address, 'available', 'loading'], true)
        .setIn(['receipts', action.address, 'available', 'error'], null)
        .setIn(['receipts', action.address, 'available', 'assets'], fromJS([]));
    case LOAD_NAHMII_RECEIPTS_SUCCESS:
      return state
        .setIn(['receipts', action.address, 'loading'], false)
        .setIn(['receipts', action.address, 'error'], null)
        .setIn(['receipts', action.address, 'receipts'], fromJS(action.receipts));
    case LOAD_NAHMII_RECEIPTS_ERROR:
      return state
        .setIn(['receipts', action.address, 'loading'], false)
        .setIn(['receipts', action.address, 'error'], action.error)
        .setIn(['receipts', action.address, 'receipts'], fromJS([]));
    default:
      return state;
  }
}

export default nahmiiHocReducer;
