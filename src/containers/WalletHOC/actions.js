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
  ADD_NEW_WALLET,
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
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
  LEDGER_ETH_CONNECTED,
  LEDGER_ETH_DISCONNECTED,
  LEDGER_ERROR,
  FETCH_LEDGER_ADDRESSES,
  FETCHED_LEDGER_ADDRESS,
  TRANSACTION_CONFIRMED,
  DELETE_WALLET,
  INIT_LEDGER,
} from './constants';

import getFriendlyError from '../../utils/ledger/friendlyErrors';

export function deleteWallet(address) {
  return {
    type: DELETE_WALLET,
    address,
  };
}

export function addNewWallet(newWallet) {
  return {
    type: ADD_NEW_WALLET,
    newWallet,
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
      address: decryptedWallet.address,
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

export function decryptWallet(address, encryptedWallet, password) {
  return {
    type: DECRYPT_WALLET,
    encryptedWallet,
    address,
    password,
  };
}

export function decryptWalletSuccess(address, decryptedWallet) {
  return {
    type: DECRYPT_WALLET_SUCCESS,
    address,
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

export function setCurrentWallet(address) {
  return {
    type: SET_CURRENT_WALLET,
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
  const ethBalance = tokenBalances[0];
  const legacyTokenBalances = { tokens: [
    { symbol: 'ETH', balance: ethBalance.balance, price: { USD: 487.23 }, primaryColor: 'grey', decimals: 18 },
  ] };
  return {
    type: LOAD_WALLET_BALANCES_SUCCESS,
    address,
    tokenBalances: legacyTokenBalances,
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

export function initLedger() {
  return {
    type: INIT_LEDGER,
  };
}

export function fetchLedgerAddresses(derivationPaths, ethTransport) {
  return {
    type: FETCH_LEDGER_ADDRESSES,
    derivationPaths,
    ethTransport,
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
  const newWallet = {
    deviceId,
    address,
    type: 'lns',
    name,
    derivationPath,
  };
  return {
    type: CREATE_WALLET_SUCCESS,
    newWallet,
  };
}

export function ledgerConnected(descriptor) {
  return {
    type: LEDGER_CONNECTED,
    descriptor,
  };
}

export function ledgerDisconnected(descriptor) {
  return {
    type: LEDGER_DISCONNECTED,
    descriptor,
  };
}

export function ledgerEthAppConnected(descriptor, id) {
  return {
    type: LEDGER_ETH_CONNECTED,
    descriptor,
    id,
  };
}

export function ledgerEthAppDisconnected(descriptor) {
  return {
    type: LEDGER_ETH_DISCONNECTED,
    descriptor,
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
