/*
 *
 * HubiiApiHoc reducer
 *
 */

import { fromJS } from 'immutable';
import { CHANGE_NETWORK } from 'containers/App/constants';
import {
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  LOAD_SUPPORTED_TOKENS,
  LOAD_SUPPORTED_TOKENS_SUCCESS,
  LOAD_SUPPORTED_TOKENS_ERROR,
  LOAD_PRICES_SUCCESS,
  LOAD_PRICES_ERROR,
  LOAD_TRANSACTIONS_SUCCESS,
  LOAD_TRANSACTIONS_ERROR,
} from './constants';

export const initialState = fromJS({
  transactions: {},
  balances: {},
  prices: {
    loading: true,
    error: null,
    assets: [],
  },
  supportedAssets: {
    loading: true,
    error: null,
    assets: [],
  },
});

function hubiiApiHocReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_WALLET_BALANCES:
      return state
        .setIn(['balances', action.address], state.getIn(['balances', action.address]) || fromJS({ loading: true }));
    case LOAD_WALLET_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'loading'], false)
        .setIn(['balances', action.address, 'error'], null)
        .setIn(['balances', action.address, 'assets'], fromJS(action.assets || []));
    case LOAD_WALLET_BALANCES_ERROR:
      return state
        .setIn(['balances', action.address, 'loading'], false)
        .setIn(['balances', action.address, 'error'], action.error);
    case LOAD_SUPPORTED_TOKENS:
      return state
        .setIn(['supportedAssets', 'loading'], true)
        .setIn(['supportedAssets', 'error'], null);
    case LOAD_SUPPORTED_TOKENS_SUCCESS:
      return state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['supportedAssets', 'error'], null)
        .setIn(['supportedAssets', 'assets'], fromJS(action.assets));
    case LOAD_SUPPORTED_TOKENS_ERROR:
      return state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['supportedAssets', 'error'], action.error);
    case LOAD_PRICES_SUCCESS:
      return state
        .setIn(['prices', 'loading'], false)
        .setIn(['prices', 'error'], null)
        .setIn(['prices', 'assets'], fromJS(action.prices));
    case LOAD_PRICES_ERROR:
      return state
        .setIn(['prices', 'error'], action.error);
    case LOAD_TRANSACTIONS_SUCCESS:
      return state
        .setIn(['transactions', action.address, 'loading'], false)
        .setIn(['transactions', action.address, 'error'], null)
        .setIn(['transactions', action.address, 'transactions'], fromJS(action.transactions || []));
    case LOAD_TRANSACTIONS_ERROR:
      return state
        .setIn(['transactions', action.address, 'loading'], false)
        .setIn(['transactions', action.address, 'error'], action.error)
        .setIn(['transactions', action.address, 'transactions'], fromJS([]));
    case CHANGE_NETWORK:
      return state
        .setIn(['supportedAssets', 'loading'], true)
        .setIn(['prices', 'loading'], true)
        .set('transactions', fromJS({}))
        .set('balances', fromJS({}));
    default:
      return state;
  }
}

export default hubiiApiHocReducer;
