/*
 *
 * WalletManager actions
 *
 */

import {
  CREATE_NEW_WALLET,
  CREATE_NEW_WALLET_FAILURE,
  CREATE_NEW_WALLET_SUCCESS,
  UPDATE_PROGRESS,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  LOAD_WALLETS,
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
} from './constants';

export function createNewWallet(name, mnemonic, derivationPath, password) {
  return {
    type: CREATE_NEW_WALLET,
    name,
    mnemonic,
    derivationPath,
    password,
  };
}

export function createNewWalletSuccess(name, encryptedWallet, decryptedWallet) {
  return {
    type: CREATE_NEW_WALLET_SUCCESS,
    name,
    newWallet: {
      encrypted: encryptedWallet,
      decrypted: decryptedWallet,
    },
  };
}

export function createNewWalletFailed(error) {
  return {
    type: CREATE_NEW_WALLET_FAILURE,
    error,
  };
}

export function decryptWallet() {
  return {
    type: DECRYPT_WALLET,
  };
}

export function decryptWalletSuccess(decryptedWallet) {
  return {
    type: DECRYPT_WALLET_SUCCESS,
    decryptedWallet,
  };
}

export function decryptWalletFailed(error) {
  return {
    type: DECRYPT_WALLET_FAILURE,
    error,
  };
}

export function updateProgress(percent) {
  return {
    type: UPDATE_PROGRESS,
    percent,
  };
}

export function loadWallets() {
  return {
    type: LOAD_WALLETS,
  };
}

export function loadWalletsSuccess(wallets) {
  return {
    type: LOAD_WALLETS_SUCCESS,
    wallets,
  };
}

export function loadWalletBalances(name, walletAddress) {
  return {
    type: LOAD_WALLET_BALANCES,
    name,
    walletAddress,
  };
}

export function loadWalletBalancesSuccess(name, tokenBalances) {
  return {
    type: LOAD_WALLET_BALANCES_SUCCESS,
    name,
    tokenBalances,
  };
}

export function loadWalletBalancesError(name, error) {
  return {
    type: LOAD_WALLET_BALANCES_ERROR,
    name,
    error,
  };
}
