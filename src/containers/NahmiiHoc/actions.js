import {
  DEPOSIT,
  DEPOSIT_ETH,
  DEPOSIT_TOKEN,
  DEPOSIT_SUCCESS,
  PAY_SUCCESS,
  LOAD_NAHMII_BALANCES,
  LOAD_NAHMII_BALANCES_SUCCESS,
  START_PAYMENT_CHALLENGE,
  START_PAYMENT_CHALLENGE_SUCCESS,
  START_PAYMENT_CHALLENGE_ERROR,
  LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST,
  SETTLE_PAYMENT_DRIIP,
  SETTLE_PAYMENT_DRIIP_SUCCESS,
  SETTLE_PAYMENT_DRIIP_ERROR,
  LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
  LOAD_SETTLEMENT,
  LOAD_SETTLEMENT_SUCCESS,
  LOAD_SETTLEMENT_ERROR,
  LOAD_RECEIPTS,
  LOAD_RECEIPTS_SUCCESS,
  LOAD_RECEIPTS_ERROR,
} from './constants';

export function deposit(address, currency, amount) {
  return {
    type: DEPOSIT,
    address,
    currency,
    amount,
  };
}

export function depositEth(address, amount) {
  return {
    type: DEPOSIT_ETH,
    address,
    amount,
  };
}

export function depositToken(currency, amount) {
  return {
    type: DEPOSIT_TOKEN,
    currency,
    amount,
  };
}

export function depositSuccess(address, receipt) {
  return {
    type: DEPOSIT_SUCCESS,
    address,
    receipt,
  };
}

export function paySuccess(sender, receipt, payment) {
  return {
    type: PAY_SUCCESS,
    sender,
    receipt,
    payment,
  };
}

export function loadBalances(address) {
  return {
    type: LOAD_NAHMII_BALANCES,
    address,
  };
}

export function loadBalancesSuccess(address, balances) {
  return {
    type: LOAD_NAHMII_BALANCES_SUCCESS,
    address,
    balances,
  };
}

export function startPaymentChallenge(receipt, stageAmount) {
  return {
    type: START_PAYMENT_CHALLENGE,
    receipt,
    stageAmount,
  };
}

export function startPaymentChallengeSuccess(address, txReceipt) {
  return {
    type: START_PAYMENT_CHALLENGE_SUCCESS,
    address,
    txReceipt,
  };
}

export function startPaymentChallengeError(address, txReceipt) {
  return {
    type: START_PAYMENT_CHALLENGE_ERROR,
    address,
    txReceipt,
  };
}

export function loadTxRequestForPaymentChallenge(address, txRequest) {
  return {
    type: LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST,
    address,
    txRequest,
  };
}

export function settlePaymentDriip(receipt) {
  return {
    type: SETTLE_PAYMENT_DRIIP,
    receipt,
  };
}

export function settlePaymentDriipSuccess(address, txReceipt) {
  return {
    type: SETTLE_PAYMENT_DRIIP_SUCCESS,
    address,
    txReceipt,
  };
}

export function settlePaymentDriipError(address, txReceipt) {
  return {
    type: SETTLE_PAYMENT_DRIIP_ERROR,
    address,
    txReceipt,
  };
}

export function loadTxRequestForSettlePaymentDriip(address, txRequest) {
  return {
    type: LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST,
    address,
    txRequest,
  };
}

export function withdraw(amount) {
  return {
    type: WITHDRAW,
    amount,
  };
}

export function withdrawSuccess(address, txReceipt) {
  return {
    type: WITHDRAW_SUCCESS,
    address,
    txReceipt,
  };
}

export function withdrawError(address, txReceipt) {
  return {
    type: WITHDRAW_ERROR,
    address,
    txReceipt,
  };
}

export function loadTxRequestForWithdraw(address, txRequest) {
  return {
    type: LOAD_WITHDRAW_TX_REQUEST,
    address,
    txRequest,
  };
}

export function loadCurrentPaymentChallengePhase(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE,
    address,
  };
}

export function loadCurrentPaymentChallengePhaseSuccess(address, phase) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
    address,
    phase,
  };
}

export function loadCurrentPaymentChallengePhaseError(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
    address,
  };
}

export function loadCurrentPaymentChallengeStatus(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS,
    address,
  };
}

export function loadCurrentPaymentChallengeStatusSuccess(address, status) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
    address,
    status,
  };
}

export function loadCurrentPaymentChallengeStatusError(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
    address,
  };
}

export function loadSettlement(address) {
  return {
    type: LOAD_SETTLEMENT,
    address,
  };
}

export function loadSettlementSuccess(address, settlement) {
  return {
    type: LOAD_SETTLEMENT_SUCCESS,
    address,
    settlement,
  };
}

export function loadSettlementError(address) {
  return {
    type: LOAD_SETTLEMENT_ERROR,
    address,
  };
}

export function loadReceipts(address) {
  return {
    type: LOAD_RECEIPTS,
    address,
  };
}

export function loadReceiptsSuccess(address, receipts) {
  return {
    type: LOAD_RECEIPTS_SUCCESS,
    address,
    receipts,
  };
}

export function loadReceiptsError(address) {
  return {
    type: LOAD_RECEIPTS_ERROR,
    address,
  };
}