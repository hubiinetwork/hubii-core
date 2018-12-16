import {
  LOAD_NAHMII_BALANCES,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  NAHMII_DEPOSIT,
  NAHMII_DEPOSIT_ETH_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  NAHMII_DEPOSIT_ETH,
  NAHMII_DEPOSIT_FAILED,
  MAKE_NAHMII_PAYMENT,
  MAKE_NAHMII_PAYMENT_ERROR,
  MAKE_NAHMII_PAYMENT_SUCCESS,
  LOAD_NAHMII_RECEIPTS,
  LOAD_NAHMII_RECEIPTS_SUCCESS,
  LOAD_NAHMII_RECEIPTS_ERROR,
} from './constants';

export function nahmiiDeposit(address, symbol, amount, options) {
  return {
    type: NAHMII_DEPOSIT,
    address,
    symbol,
    amount,
    options,
  };
}

export function nahmiiApproveTokenDeposit(address, symbol, amount, options) {
  return {
    type: NAHMII_APPROVE_TOKEN_DEPOSIT,
    symbol,
    address,
    amount,
    options,
  };
}

export function nahmiiCompleteTokenDeposit(address, symbol, amount, options) {
  return {
    type: NAHMII_COMPLETE_TOKEN_DEPOSIT,
    symbol,
    address,
    amount,
    options,
  };
}

export function nahmiiDepositEth(address, amount, options) {
  return {
    type: NAHMII_DEPOSIT_ETH,
    address,
    amount,
    options,
  };
}

export function nahmiiDepositEthSuccess() {
  return {
    type: NAHMII_DEPOSIT_ETH_SUCCESS,
  };
}

export function nahmiiApproveTokenDepositSuccess() {
  return {
    type: NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  };
}

export function nahmiiCompleteTokenDepositSuccess() {
  return {
    type: NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  };
}

export function nahmiiDepositFailed(errorMessage) {
  return {
    type: NAHMII_DEPOSIT_FAILED,
    error: errorMessage,
  };
}

export function makeNahmiiPayment(monetaryAmount, recipient, walletOverride = null) {
  return {
    type: MAKE_NAHMII_PAYMENT,
    monetaryAmount,
    recipient,
    walletOverride,
  };
}

export function nahmiiPaymentError(error) {
  return {
    type: MAKE_NAHMII_PAYMENT_ERROR,
    error,
  };
}

export function nahmiiPaymentSuccess() {
  return {
    type: MAKE_NAHMII_PAYMENT_SUCCESS,
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

export function loadStagedBalances(address) {
  return {
    type: LOAD_NAHMII_STAGED_BALANCES,
    address,
  };
}

export function loadStagedBalancesSuccess(address, balances) {
  return {
    type: LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
    address,
    balances,
  };
}

export function loadStagingBalances(address) {
  return {
    type: LOAD_NAHMII_STAGING_BALANCES,
    address,
  };
}

export function loadStagingBalancesSuccess(address, balances) {
  return {
    type: LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
    address,
    balances,
  };
}

export function loadReceipts(address) {
  return {
    type: LOAD_NAHMII_RECEIPTS,
    address,
  };
}

export function loadReceiptsSuccess(address, receipts) {
  return {
    type: LOAD_NAHMII_RECEIPTS_SUCCESS,
    address,
    receipts,
  };
}

export function loadReceiptsError(address, error) {
  return {
    type: LOAD_NAHMII_RECEIPTS_ERROR,
    address,
    error,
  };
}
