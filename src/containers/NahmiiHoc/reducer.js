/*
 *
 * nahmiiHoc reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEPOSIT,
  DEPOSIT_SUCCESS,
  LOAD_NAHMII_BALANCES_SUCCESS,
  START_PAYMENT_CHALLENGE_SUCCESS,
  START_PAYMENT_CHALLENGE_ERROR,
  LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST,
  SETTLE_PAYMENT_DRIIP_SUCCESS,
  SETTLE_PAYMENT_DRIIP_ERROR,
  LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
  LOAD_SETTLEMENT_SUCCESS,
  LOAD_SETTLEMENT_ERROR,
  LOAD_RECEIPTS_SUCCESS,
  LOAD_RECEIPTS_ERROR,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case DEPOSIT:
      return state
        .setIn(['wallets', action.address, 'depositing'], true);
    case DEPOSIT_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'depositing'], false);
    case START_PAYMENT_CHALLENGE_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txStatus'], 'success')
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txReceipt'], action.txReceipt)
    case START_PAYMENT_CHALLENGE_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txStatus'], 'failed')
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txReceipt'], action.txReceipt)
    case LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txRequest'], action.txRequest)
    case SETTLE_PAYMENT_DRIIP_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txStatus'], 'success')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txReceipt'], action.txReceipt)
    case SETTLE_PAYMENT_DRIIP_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txStatus'], 'failed')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txReceipt'], action.txReceipt)
    case LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txRequest'], action.txRequest)
    case WITHDRAW_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txStatus'], 'success')
        .setIn(['wallets', action.address, 'lastWithdraw', 'txReceipt'], action.txReceipt)
    case WITHDRAW_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txStatus'], 'failed')
        .setIn(['wallets', action.address, 'lastWithdraw', 'txReceipt'], action.txReceipt)
    case LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'phase'], action.phase)
    case LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'phase'], null)
    case LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], action.status)
    case LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], null)
    case LOAD_SETTLEMENT_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'settlement'], action.settlement)
    case LOAD_SETTLEMENT_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'settlement'], null)
        case LOAD_WITHDRAW_TX_REQUEST:
        return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txRequest'], action.txRequest)
        case LOAD_NAHMII_BALANCES_SUCCESS:
        return state
        .setIn(['balances', action.address, 'loading'], false)
        .setIn(['balances', action.address, 'error'], null)
        .setIn(['balances', action.address, 'assets'], action.balances);
    case LOAD_RECEIPTS_SUCCESS:
      return state
        .setIn(['receipts', action.address], action.receipts)
    case LOAD_RECEIPTS_ERROR:
      return state
        .setIn(['receipts', action.address], null)
    default:
      return state;
  }
}

export default nahmiiHocReducer;
