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
  ENABLE_NAHMII_MAINNET,
  DISABLE_NAHMII_MAINNET,
  HIDE_DISCLAIMER_BTN,
  SHOW_DISCLAIMER_BTN,
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

export function enableNahmiiMainnet() {
  return {
    type: ENABLE_NAHMII_MAINNET,
  };
}

export function disableNahmiiMainnet() {
  return {
    type: DISABLE_NAHMII_MAINNET,
  };
}

export function hideDisclaimerBtn() {
  return {
    type: HIDE_DISCLAIMER_BTN,
  };
}

export function showDisclaimerBtn() {
  return {
    type: SHOW_DISCLAIMER_BTN,
  };
}
