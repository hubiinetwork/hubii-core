/*
 *
 * nahmiiHoc reducer
 *
 */

import { fromJS } from 'immutable';

import { CHANGE_NETWORK } from 'containers/App/constants';
import {
  SET_SELECTED_WALLET_CURRENCY,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  SETTLE,
  SETTLE_SUCCESS,
  SETTLE_ERROR,
  START_REQUIRED_SETTLEMENTS_SUCCESS,
  LOAD_SETTLE_TX_REQUEST,
  LOAD_SETTLE_RECEIPT_SUCCESS,
  STAGE,
  STAGE_ERROR,
  STAGE_ALL_SETTLEMENTS_SUCCESS,
  LOAD_STAGE_TX_REQUEST,
  LOAD_STAGE_TX_RECEIPT_SUCCESS,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_WITHDRAW_TX_RECEIPT_SUCCESS,
  LOAD_NAHMII_RECEIPTS,
  LOAD_NAHMII_RECEIPTS_SUCCESS,
  LOAD_NAHMII_RECEIPTS_ERROR,
  NAHMII_DEPOSIT_ETH,
  NAHMII_DEPOSIT_ETH_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_DEPOSIT_FAILED,
  LOAD_SETTLEMENTS_SUCCESS,
  LOAD_SETTLEMENTS_ERROR,
  RELOAD_SETTLEMENT_STATES,
  NEW_RECEIPT_RECEIVED,
  LOAD_CLAIMABLE_FEES,
  LOAD_CLAIMABLE_FEES_SUCCESS,
  LOAD_CLAIMABLE_FEES_ERROR,
  LOAD_WITHDRAWABLE_FEES,
  LOAD_WITHDRAWABLE_FEES_SUCCESS,
  LOAD_WITHDRAWABLE_FEES_ERROR,
  CLAIM_FEES_FOR_ACCRUALS,
  CLAIM_FEES_FOR_ACCRUALS_SUCCESS,
  CLAIM_FEES_FOR_ACCRUALS_ERROR,
  WITHDRAW_FEES,
  WITHDRAW_FEES_SUCCESS,
  WITHDRAW_FEES_ERROR,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
  receipts: {},
  transactions: {},
  selectedCurrency: '0x0000000000000000000000000000000000000000',
  depositStatus: {},
  settlements: {},
  withdrawals: {},
  claimFees: {},
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_WALLET_CURRENCY:
      return state.set('selectedCurrency', action.currencyAddress);
    case NAHMII_DEPOSIT_ETH:
      return state
        .setIn(['depositStatus', action.address, 'ETH', 'depositing'], true)
        .setIn(['depositStatus', action.address, 'ETH', 'error'], null);
    case NAHMII_DEPOSIT_ETH_SUCCESS:
      return state
        .setIn(['depositStatus', action.address, 'ETH', 'depositing'], false)
        .setIn(['depositStatus', action.address, 'ETH', 'error'], null);
    case NAHMII_APPROVE_TOKEN_DEPOSIT:
      return state
        .setIn(['depositStatus', action.address, action.symbol, 'approvingTokenDeposit'], true)
        .setIn(['depositStatus', action.address, action.symbol, 'error'], null);
    case NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS:
      return state
        .setIn(['depositStatus', action.address, action.symbol, 'approvingTokenDeposit'], false)
        .setIn(['depositStatus', action.address, action.symbol, 'error'], null);
    case NAHMII_COMPLETE_TOKEN_DEPOSIT:
      return state
        .setIn(['depositStatus', action.address, action.symbol, 'completingTokenDeposit'], true)
        .setIn(['depositStatus', action.address, action.symbol, 'error'], null);
    case NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS:
      return state
        .setIn(['depositStatus', action.address, action.symbol, 'completingTokenDeposit'], false)
        .setIn(['depositStatus', action.address, action.symbol, 'error'], null);
    case NAHMII_DEPOSIT_FAILED:
      return state
        .setIn(['depositStatus', action.address, action.symbol, 'depositing'], false)
        .setIn(['depositStatus', action.address, action.symbol, 'approvingTokenDeposit'], false)
        .setIn(['depositStatus', action.address, action.symbol, 'completingTokenDeposit'], false)
        .setIn(['depositStatus', action.address, action.symbol, 'error'], action.error);
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
    case LOAD_SETTLEMENTS_SUCCESS:
      return state
        .setIn(['settlements', action.address, action.currencyAddress, 'loading'], false)
        .setIn(['settlements', action.address, action.currencyAddress, 'details'], fromJS(action.settlements.map((s) => s.toJSON())));
    case LOAD_SETTLEMENTS_ERROR:
      return state
        .setIn(['settlements', action.address, action.currencyAddress, 'details'], null);
    case RELOAD_SETTLEMENT_STATES:
      return state
        .setIn(['settlements', action.address, action.currency, 'loading'], true);
    case SETTLE:
      return state
        .setIn(['settlements', action.address, action.currency, 'settling', 'status'], 'requesting');
    case START_REQUIRED_SETTLEMENTS_SUCCESS:
      return state
        .setIn(['settlements', action.address, action.currency, 'settling', 'status'], 'success');
    case SETTLE_SUCCESS:
      return state
        .setIn(['settlements', action.address, action.currency, 'settling', 'status'], 'success');
    case SETTLE_ERROR:
      return state
        .setIn(['settlements', action.address, action.currency, 'settling', 'status'], 'failed');
    case LOAD_SETTLE_TX_REQUEST:
      return state
        .setIn(['settlements', action.address, action.currency, 'settling', 'status'], 'mining');
    case LOAD_SETTLE_RECEIPT_SUCCESS:
      return state
        .setIn(['settlements', action.address, action.currency, 'settling', 'status'], 'receipt');
    case STAGE:
      return state
        .setIn(['settlements', action.address, action.currency, 'staging', 'status'], 'requesting');
    case STAGE_ALL_SETTLEMENTS_SUCCESS:
      return state
        .setIn(['settlements', action.address, action.currency, 'details'], null)
        .setIn(['settlements', action.address, action.currency, 'staging', 'status'], 'success');
    case STAGE_ERROR:
      return state
        .setIn(['settlements', action.address, action.currency, 'staging', 'status'], 'failed');
    case LOAD_STAGE_TX_REQUEST:
      return state
        .setIn(['settlements', action.address, action.currency, 'staging', 'status'], 'mining');
    case LOAD_STAGE_TX_RECEIPT_SUCCESS:
      return state
        .setIn(['settlements', action.address, action.currency, 'staging', 'status'], 'receipt');
    case WITHDRAW:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'requesting');
    case WITHDRAW_SUCCESS:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'success')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case WITHDRAW_ERROR:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'failed');
    case LOAD_WITHDRAW_TX_REQUEST:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'mining')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txRequest.hash], action.txRequest);
    case LOAD_WITHDRAW_TX_RECEIPT_SUCCESS:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'receipt')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case LOAD_CLAIMABLE_FEES:
      return state
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'loading'], true);
    case LOAD_CLAIMABLE_FEES_SUCCESS:
      return state
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'loading'], false)
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'error'], null)
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'amount'], action.amount)
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'startPeriod'], action.startPeriod)
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'endPeriod'], action.endPeriod);
    case LOAD_CLAIMABLE_FEES_ERROR:
      return state
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'loading'], false)
        .setIn(['claimFees', action.address, action.currency, 'claimable', 'error'], action.error);
    case CLAIM_FEES_FOR_ACCRUALS:
      return state
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'status'], 'requesting')
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'startPeriod'], action.startPeriod)
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'endPeriod'], action.endPeriod);
    case CLAIM_FEES_FOR_ACCRUALS_SUCCESS:
      return state
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'status'], 'success')
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'error'], null);
    case CLAIM_FEES_FOR_ACCRUALS_ERROR:
      return state
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'status'], 'failed')
        .setIn(['claimFees', action.address, action.currency, 'claiming', 'error'], action.error);
    case LOAD_WITHDRAWABLE_FEES:
      return state
        .setIn(['claimFees', action.address, action.currency, 'withdrawable', 'loading'], true);
    case LOAD_WITHDRAWABLE_FEES_SUCCESS:
      return state
        .setIn(['claimFees', action.address, action.currency, 'withdrawable', 'loading'], false)
        .setIn(['claimFees', action.address, action.currency, 'withdrawable', 'error'], null)
        .setIn(['claimFees', action.address, action.currency, 'withdrawable', 'amount'], action.amount);
    case LOAD_WITHDRAWABLE_FEES_ERROR:
      return state
        .setIn(['claimFees', action.address, action.currency, 'withdrawable', 'loading'], false)
        .setIn(['claimFees', action.address, action.currency, 'withdrawable', 'error'], action.error);
    case WITHDRAW_FEES:
      return state
        .setIn(['claimFees', action.address, action.currency, 'withdrawing', 'status'], 'requesting');
    case WITHDRAW_FEES_SUCCESS:
      return state
        .setIn(['claimFees', action.address, action.currency, 'withdrawing', 'status'], 'success')
        .setIn(['claimFees', action.address, action.currency, 'withdrawing', 'error'], null);
    case WITHDRAW_FEES_ERROR:
      return state
        .setIn(['claimFees', action.address, action.currency, 'withdrawing', 'status'], 'failed')
        .setIn(['claimFees', action.address, action.currency, 'withdrawing', 'error'], action.error);
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
        .setIn(['receipts', action.address, 'receipts'], state.getIn(['receipts', action.address, 'receipts']) || fromJS([]));
    case NEW_RECEIPT_RECEIVED:
      return state
        .setIn(['receipts', action.address, 'receipts'],
          state.getIn(['receipts', action.address, 'receipts']) ?
            state.getIn(['receipts', action.address, 'receipts']).unshift(fromJS(action.receipt)) :
            fromJS([action.receipt]));
    case CHANGE_NETWORK:
      return state
        .set('balances', initialState.get('balances'))
        .set('receipts', initialState.get('receipts'))
        .set('settlements', initialState.get('settlements'))
        .set('withdrawals', initialState.get('withdrawals'));
    default:
      return state;
  }
}

export default nahmiiHocReducer;
