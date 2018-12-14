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
  START_CHALLENGE_SUCCESS,
  START_CHALLENGE_ERROR,
  LOAD_START_CHALLENGE_TX_REQUEST,
  SETTLE_SUCCESS,
  SETTLE_ERROR,
  LOAD_SETTLE_TX_REQUEST,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_ONGOING_CHALLENGES_SUCCESS,
  LOAD_ONGOING_CHALLENGES_ERROR,
  LOAD_SETTLEABLE_CHALLENGES_SUCCESS,
  LOAD_SETTLEABLE_CHALLENGES_ERROR,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
  LOAD_SETTLEMENT_SUCCESS,
  LOAD_SETTLEMENT_ERROR,
  LOAD_RECEIPTS_SUCCESS,
  LOAD_RECEIPTS_ERROR,
  NAHMII_DEPOSIT_ETH,
  NAHMII_DEPOSIT_ETH_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_DEPOSIT_FAILED,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
  receipts: {},
  transactions: {},
  selectedCurrency: '0x0000000000000000000000000000000000000000',
  depositStatus: {
    depositingEth: false,
    approvingTokenDeposit: false,
    completingTokenDeposit: false,
    error: null,
  },
  ongoingChallenges: {},
  settleableChallenges: {},
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_WALLET_CURRENCY:
      return state.set('selectedCurrency', action.currencyAddress);
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
    case START_CHALLENGE_SUCCESS:
      return state
          .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txStatus'], 'success')
          .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txReceipt'], action.txReceipt)
          .setIn(['transactions', action.address, action.currency, action.txReceipt.transactionHash, 'receipt'], action.txReceipt);
    case START_CHALLENGE_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txStatus'], 'failed')
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txReceipt'], action.txReceipt)
        .setIn(['transactions', action.address, action.currency, action.txReceipt.transactionHash, 'receipt'], action.txReceipt);
    case LOAD_START_CHALLENGE_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txStatus'], 'mining')
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txRequest'], action.txRequest)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'type'], 'start_payment_challenge')
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'network'], action.networkName)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'createdAt'], new Date().getTime())
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'request'], action.txRequest);
    case SETTLE_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txStatus'], 'success')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txReceipt'], action.txReceipt)
        .setIn(['transactions', action.address, action.currency, action.txReceipt.transactionHash, 'receipt'], action.txReceipt);
    case SETTLE_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txStatus'], 'failed')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txReceipt'], action.txReceipt)
        .setIn(['transactions', action.address, action.currency, action.txReceipt.transactionHash, 'receipt'], action.txReceipt);
    case LOAD_SETTLE_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txStatus'], 'mining')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txRequest'], action.txRequest)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'type'], 'settle_payment')
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'network'], action.networkName)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'createdAt'], new Date().getTime())
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'request'], action.txRequest);
    case WITHDRAW_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txStatus'], 'success')
        .setIn(['wallets', action.address, 'lastWithdraw', 'txReceipt'], action.txReceipt)
        .setIn(['transactions', action.address, action.currency, action.txReceipt.transactionHash, 'receipt'], action.txReceipt);
    case WITHDRAW_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txStatus'], 'failed')
        .setIn(['wallets', action.address, 'lastWithdraw', 'txReceipt'], action.txReceipt)
        .setIn(['transactions', action.address, action.currency, action.txReceipt.transactionHash, 'receipt'], action.txReceipt);
    case LOAD_WITHDRAW_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txRequest'], action.txRequest)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'type'], 'withdraw')
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'network'], action.networkName)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'createdAt'], new Date().getTime())
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'request'], action.txRequest);

    case LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'phase'], action.phase);
    case LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'phase'], null);
    case LOAD_ONGOING_CHALLENGES_SUCCESS:
      return state
        .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'details'], action.challenges)
        // .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    case LOAD_ONGOING_CHALLENGES_ERROR:
      return state
        .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'details'], null)
        // .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    case LOAD_SETTLEABLE_CHALLENGES_SUCCESS:
      return state
        .setIn(['settleableChallenges', action.address, action.currencyAddress, 'details'], action.challenges)
        // .setIn(['settleableChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    case LOAD_SETTLEABLE_CHALLENGES_ERROR:
      return state
        .setIn(['settleableChallenges', action.address, action.currencyAddress, 'details'], null)
        // .setIn(['settleableChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    case LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], action.status);
    case LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], null);
    case LOAD_SETTLEMENT_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'settlement'], action.settlement || {})
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'updatedAt'], new Date());
        // .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'loadingSettlement'], false);
    case LOAD_SETTLEMENT_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'settlement'], null)
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'updatedAt'], new Date());
        // .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'loadingSettlement'], false);
    case LOAD_RECEIPTS_SUCCESS:
      return state
        .setIn(['receipts', action.address], action.receipts);
    case LOAD_RECEIPTS_ERROR:
      return state
        .setIn(['receipts', action.address], []);
    case CHANGE_NETWORK:
      return state
        .set('balances', initialState.get('balances'))
        .set('receipts', initialState.get('receipts'))
        .set('transactions', initialState.get('transactions'));
    default:
      return state;
  }
}

export default nahmiiHocReducer;
