/*
 *
 * WalletHoc actions
 *
 */
import { utils } from 'ethers';
import abiDecoder from 'abi-decoder';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  CREATE_WALLET_FAILURE,
  CREATE_WALLET_SUCCESS,
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
  LISTEN_TOKEN_BALANCES,
  UPDATE_TOKEN_BALANCES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  TRANSFER_SUCCESS,
  TRANSFER_ERROR,
  TRANSACTION_CONFIRMED,
  DELETE_WALLET,
} from './constants';

export function deleteWallet(walletToRemove) {
  return {
    type: DELETE_WALLET,
    name: walletToRemove.name,
  };
}

export function createWalletFromMnemonic(name, mnemonic, derivationPath, password) {
  return {
    type: CREATE_WALLET_FROM_MNEMONIC,
    name,
    mnemonic,
    derivationPath,
    password,
  };
}

export function createWalletFromPrivateKey(privateKey, name, password) {
  return {
    type: CREATE_WALLET_FROM_PRIVATE_KEY,
    privateKey,
    name,
    password,
  };
}

export function createWalletSuccess(name, encryptedWallet, decryptedWallet) {
  return {
    type: CREATE_WALLET_SUCCESS,
    name,
    newWallet: {
      name,
      type: 'software',
      encrypted: encryptedWallet,
      decrypted: decryptedWallet,
    },
  };
}

export function createWalletFailed(error) {
  return {
    type: CREATE_WALLET_FAILURE,
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

export function listenBalances(walletName) {
  return {
    type: LISTEN_TOKEN_BALANCES,
    walletName,
  };
}

export function updateBalances(name, newBalance) {
  return {
    type: UPDATE_TOKEN_BALANCES,
    name,
    newBalance,
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
  const formatedTransaction = {
    timestamp: new Date().getTime(),
    token,
    from: transaction.from,
    to: transaction.to,
    hash: transaction.hash,
    value: parseFloat(utils.formatEther(transaction.value)),
    input: transaction.data,
    original: transaction,
  };
  if (token !== 'ETH') {
    const inputData = abiDecoder.decodeMethod(transaction.data);
    const toAddress = inputData.params.find((param) => param.name === '_to');
    const tokens = inputData.params.find((param) => param.name === '_tokens');
    const wei = utils.bigNumberify(tokens.value);
    formatedTransaction.to = toAddress.value;
    formatedTransaction.value = parseFloat(utils.formatEther(wei));
  }
  return {
    type: TRANSFER_SUCCESS,
    transaction: formatedTransaction,
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
