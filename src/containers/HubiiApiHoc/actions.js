/*
 *
 * HubiiApiHoc actions
 *
 */

import {
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  LOAD_SUPPORTED_TOKENS,
  LOAD_SUPPORTED_TOKENS_SUCCESS,
  LOAD_SUPPORTED_TOKENS_ERROR,
  LOAD_PRICES,
  LOAD_PRICES_SUCCESS,
  LOAD_PRICES_ERROR,
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  LOAD_TRANSACTIONS_ERROR,
  LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS,
} from './constants';

export function loadWalletBalances(address, noPoll, onlyEth) {
  return {
    type: LOAD_WALLET_BALANCES,
    address,
    noPoll,
    onlyEth,
  };
}

export function loadWalletBalancesSuccess(address, assets) {
  return {
    type: LOAD_WALLET_BALANCES_SUCCESS,
    address,
    assets,
  };
}

export function loadWalletBalancesError(address, error) {
  return {
    type: LOAD_WALLET_BALANCES_ERROR,
    address,
    error,
  };
}

export function loadSupportedTokens() {
  return {
    type: LOAD_SUPPORTED_TOKENS,
  };
}

export function loadSupportedTokensSuccess(tokens) {
  return {
    type: LOAD_SUPPORTED_TOKENS_SUCCESS,
    assets: [...tokens],
  };
}

export function loadSupportedTokensError(error) {
  return {
    type: LOAD_SUPPORTED_TOKENS_ERROR,
    error,
  };
}

export function loadPrices() {
  return {
    type: LOAD_PRICES,
  };
}

export function loadPricesSuccess(prices) {
  return {
    type: LOAD_PRICES_SUCCESS,
    prices,
  };
}

export function loadPricesError(error) {
  return {
    type: LOAD_PRICES_ERROR,
    error,
  };
}

export function loadTransactions(address) {
  return {
    type: LOAD_TRANSACTIONS,
    address,
  };
}

export function loadTransactionsSuccess(address, transactions) {
  return {
    type: LOAD_TRANSACTIONS_SUCCESS,
    transactions,
    address,
  };
}

export function loadTransactionsError(address, error) {
  return {
    type: LOAD_TRANSACTIONS_ERROR,
    address,
    error,
  };
}

export function loadIdentityServiceTokenSuccess(token) {
  return {
    type: LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS,
    token,
  };
}
