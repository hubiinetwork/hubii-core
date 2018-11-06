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