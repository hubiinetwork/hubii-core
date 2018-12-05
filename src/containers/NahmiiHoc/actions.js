import {
  LOAD_NAHMII_BALANCES,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  MAKE_NAHMII_PAYMENT,
  MAKE_NAHMII_PAYMENT_ERROR,
  MAKE_NAHMII_PAYMENT_SUCCESS,
} from './constants';

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
