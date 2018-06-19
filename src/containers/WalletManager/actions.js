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
} from './constants';

export function createNewWallet() {
  return {
    type: CREATE_NEW_WALLET,
  };
}

export function createNewWalletSuccess(encryptedWallet, decryptedWallet) {
  return {
    type: CREATE_NEW_WALLET_SUCCESS,
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
