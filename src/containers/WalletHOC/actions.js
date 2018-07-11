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
  POLL_LEDGER,
  LEDGER_DETECTED,
  LEDGER_ERROR,
  START_LEDGER_SYNC,
  STOP_LEDGER_SYNC,
  FETCH_LEDGER_ADDRESSES,
  FETCHED_LEDGER_ADDRESS,
  SAVE_LEDGER_ADDRESS,
  TRANSACTION_CONFIRMED,
  DELETE_WALLET,
} from './constants';

import getFriendlyError from '../../utils/ledger/friendlyErrors';

export function deleteWallet(address) {
  return {
    type: DELETE_WALLET,
    address,
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
    newWallet: {
      name,
      address: `0x${JSON.parse(encryptedWallet).address}`,
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

export function decryptWalletSuccess(decryptedWallet) {
  return {
    type: DECRYPT_WALLET_SUCCESS,
    address: decryptedWallet.address,
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

export function loadWalletBalances(address) {
  return {
    type: LOAD_WALLET_BALANCES,
    address,
  };
}

export function loadWalletBalancesSuccess(address, tokenBalances) {
  return {
    type: LOAD_WALLET_BALANCES_SUCCESS,
    address,
    tokenBalances,
  };
}

export function loadWalletBalancesError(address, error) {
  return {
    type: LOAD_WALLET_BALANCES_ERROR,
    address,
    error,
  };
}

export function listenBalances(address) {
  return {
    type: LISTEN_TOKEN_BALANCES,
    address,
  };
}

export function updateBalances(address, newBalance) {
  return {
    type: UPDATE_TOKEN_BALANCES,
    address,
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

export function saveLedgerAddress(name, derivationPath, deviceId, address) {
  const newLedgerWallet = {
    deviceId,
    address,
    derivationPath,
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
