/*
 *
 * nahmiiHoc reducer
 *
 */

import { fromJS } from 'immutable';

import { CHANGE_NETWORK } from 'containers/App/constants';
import {
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  NAHMII_DEPOSIT_ETH,
  NAHMII_DEPOSIT_ETH_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_DEPOSIT_FAILED,
  ENABLE_NAHMII_MAINNET,
  DISABLE_NAHMII_MAINNET,
  HIDE_INFO_BTN,
  SHOW_INFO_BTN,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
  receipts: {},
  transactions: {},
  depositStatus: {
    depositingEth: false,
    approvingTokenDeposit: false,
    completingTokenDeposit: false,
    error: null,
  },
  disclaimerModal: {
    showBtn: true,
    enableMainnet: false,
  },
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case NAHMII_DEPOSIT_ETH:
      return state
        .setIn(['depositStatus', 'depositingEth'], true)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_DEPOSIT_ETH_SUCCESS:
      return state
        .setIn(['depositStatus', 'depositingEth'], false)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_APPROVE_TOKEN_DEPOSIT:
      return state
        .setIn(['depositStatus', 'approvingTokenDeposit'], true)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS:
      return state
        .setIn(['depositStatus', 'approvingTokenDeposit'], false)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_COMPLETE_TOKEN_DEPOSIT:
      return state
        .setIn(['depositStatus', 'completingTokenDeposit'], true)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS:
      return state
        .setIn(['depositStatus', 'completingTokenDeposit'], false)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_DEPOSIT_FAILED:
      return state
        .setIn(['depositStatus', 'depositingEth'], false)
        .setIn(['depositStatus', 'approvingTokenDeposit'], false)
        .setIn(['depositStatus', 'completingTokenDeposit'], false)
        .setIn(['depositStatus', 'error'], action.error);
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
    case CHANGE_NETWORK:
      return state
        .set('balances', initialState.get('balances'))
        .set('receipts', initialState.get('receipts'))
        .set('transactions', initialState.get('transactions'));
    case ENABLE_NAHMII_MAINNET:
      return state
        .setIn(['disclaimerModal', 'enableMainnet'], true);
    case DISABLE_NAHMII_MAINNET:
      return state
        .setIn(['disclaimerModal', 'enableMainnet'], false);
    case SHOW_INFO_BTN:
      return state
        .setIn(['disclaimerModal', 'showBtn'], true);
    case HIDE_INFO_BTN:
      return state
        .setIn(['disclaimerModal', 'showBtn'], false);
    default:
      return state;
  }
}

export default nahmiiHocReducer;
