/*
 *
 * WalletManager actions
 *
 */

import {
  CREATE_NEW_WALLET,
  CREATE_WALLET_BY_PRIVATE_KEY,
  CREATE_NEW_WALLET_FAILURE,
  CREATE_NEW_WALLET_SUCCESS,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  SHOW_DECRYPT_WALLET_MODAL,
  HIDE_DECRYPT_WALLET_MODAL,
  SET_CURRENT_WALLET,
  LOAD_WALLETS,
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  TRANSFER_SUCCESS,
  TRANSFER_ERROR,
  TRANSACTION_CONFIRMED,
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

export function createWalletFromPrivateKey(privateKey, name, password) {
  return {
    type: CREATE_WALLET_BY_PRIVATE_KEY,
    privateKey,
    name,
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

export function decryptWallet(name, encryptedWallet, password) {
  return {
    type: DECRYPT_WALLET,
    name,
    encryptedWallet,
    password,
  };
}

export function decryptWalletSuccess(name, decryptedWallet) {
  return {
    type: DECRYPT_WALLET_SUCCESS,
    name,
    decryptedWallet,
  };
}

export function decryptWalletFailed(error) {
  return {
    type: DECRYPT_WALLET_FAILURE,
    error,
  };
}

export function showDecryptWalletModal(walletName) {
  return {
    type: SHOW_DECRYPT_WALLET_MODAL,
    walletName,
  };
}

export function hideDecryptWalletModal(walletName) {
  return {
    type: HIDE_DECRYPT_WALLET_MODAL,
    walletName,
  };
}

export function setCurrentWallet(name, address) {
  return {
    type: SET_CURRENT_WALLET,
    name,
    address,
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

export function loadWalletsBalances() {
  return {
    type: LOAD_WALLETS_SUCCESS,
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

export function transfer(payload) {
  return {
    type: TRANSFER,
    wallet: payload.wallet,
    token: payload.token,
    toAddress: payload.toAddress,
    amount: payload.amount,
    gasPrice: payload.gasPrice,
    gasLimit: payload.gasLimit,
    contractAddress: payload.contractAddress,
  };
}

export function transferEther(payload) {
  return {
    type: TRANSFER_ETHER,
    toAddress: payload.toAddress,
    amount: payload.amount,
    gasPrice: payload.gasPrice,
    gasLimit: payload.gasLimit,
  };
}

export function transferERC20(payload) {
  return {
    type: TRANSFER_ERC20,
    token: payload.token,
    contractAddress: payload.contractAddress,
    toAddress: payload.toAddress,
    amount: payload.amount,
    gasPrice: payload.gasPrice,
    gasLimit: payload.gasLimit,
  };
}

export function transferSuccess(transaction, token) {
  return {
    type: TRANSFER_SUCCESS,
    transaction,
    token,
  };
}

export function transactionConfirmed(transaction) {
  return {
    type: TRANSACTION_CONFIRMED,
    transaction,
  };
}

export function transferError(error) {
  return {
    type: TRANSFER_ERROR,
    error,
  };
}
