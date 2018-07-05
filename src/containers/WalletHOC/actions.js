/*
 *
 * WalletHoc actions
 *
 */

import {
  CREATE_NEW_WALLET,
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
  POLL_LEDGER,
  LEDGER_DETECTED,
  LEDGER_ERROR,
  START_LEDGER_SYNC,
  STOP_LEDGER_SYNC,
  FETCH_LEDGER_ADDRESSES,
  FETCHED_LEDGER_ADDRESS,
  SAVE_LEDGER_ADDRESS,
  TRANSACTION_CONFIRMED,
} from './constants';

import getFriendlyError from '../../utils/ledger/friendlyErrors';

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

export function pollLedger() {
  return {
    type: POLL_LEDGER,
  };
}

export function startLedgerSync() {
  return {
    type: START_LEDGER_SYNC,
  };
}

export function stopLedgerSync() {
  return {
    type: STOP_LEDGER_SYNC,
  };
}

export function fetchLedgerAddresses(derivationPaths) {
  return {
    type: FETCH_LEDGER_ADDRESSES,
    derivationPaths,
  };
}

export function fetchedLedgerAddress(derivationPath, address) {
  return {
    type: FETCHED_LEDGER_ADDRESS,
    derivationPath,
    address,
  };
}

export function saveLedgerAddress(name, address, mnemonic, ledgerId) {
  const newLedgerWallet = {
    ledgerId,
    address,
    mnemonic,
  };
  return {
    type: SAVE_LEDGER_ADDRESS,
    name,
    newLedgerWallet,
  };
}

export function ledgerDetected(id) {
  return {
    type: LEDGER_DETECTED,
    id,
  };
}

export function ledgerError(rawError) {
  const friendlyError = getFriendlyError(rawError);
  return {
    type: LEDGER_ERROR,
    error: friendlyError,
  };
}

export function transferError(error) {
  return {
    type: TRANSFER_ERROR,
    error,
  };
}
