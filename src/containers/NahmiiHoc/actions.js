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
} from './constants';

export function nahmiiDeposit(address, currency, amount, options) {
  return {
    type: NAHMII_DEPOSIT,
    address,
    currency,
    amount,
    options,
  };
}

export function nahmiiApproveTokenDeposit(address, currency, amount, options) {
  return {
    type: NAHMII_APPROVE_TOKEN_DEPOSIT,
    currency,
    address,
    amount,
    options,
  };
}

export function nahmiiCompleteTokenDeposit(address, currency, amount, options) {
  return {
    type: NAHMII_COMPLETE_TOKEN_DEPOSIT,
    currency,
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

export function nahmiiDepositFailed() {
  return {
    type: NAHMII_DEPOSIT_FAILED,
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
