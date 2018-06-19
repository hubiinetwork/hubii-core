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

export function createNewWalletSuccess(name, encryptedWallet, decryptedWallet, derivationPath) {
  return {
    type: CREATE_NEW_WALLET_SUCCESS,
    newWalletName: name,
    newWallet: {
      encrypted: encryptedWallet,
      decrypted: decryptedWallet,
      derivationPath,
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
