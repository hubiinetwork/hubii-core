/*
 *
 * WalletHoc actions
 *
 */

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  CREATE_WALLET_FROM_KEYSTORE,
  CREATE_WALLET_FAILURE,
  CREATE_WALLET_SUCCESS,
  ADD_NEW_WALLET,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  SHOW_DECRYPT_WALLET_MODAL,
  HIDE_DECRYPT_WALLET_MODAL,
  SET_CURRENT_WALLET,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  TRANSFER_SUCCESS,
  TRANSFER_ERROR,
  DELETE_WALLET,
} from './constants';


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

export function createWalletFromKeystore(name, keystore) {
  return {
    type: CREATE_WALLET_FROM_KEYSTORE,
    name,
    keystore,
  };
}

export function createWalletSuccess(name, encryptedWallet, decryptedWallet, address) {
  return {
    type: CREATE_WALLET_SUCCESS,
    newWallet: {
      name,
      address: address || decryptedWallet.address,
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

export function showDecryptWalletModal(callbackAction = null) {
  return {
    type: SHOW_DECRYPT_WALLET_MODAL,
    callbackAction,
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

export function transferSuccess(transaction) {
  /**
   * Transaction seems to sometimes (1/20~) come back as null from the LNS.
   * Cannot rely on the tx not being null until this is resolved
   */

  // const formatedTransaction = {
  //   timestamp: new Date().getTime(),
  //   token,
  //   from: transaction.from,
  //   to: transaction.to,
  //   hash: transaction.hash,
  //   value: parseFloat(utils.formatEther(transaction.value)),
  //   input: transaction.data,
  //   original: transaction,
  // };
  // if (token !== 'ETH') {
  //   const inputData = abiDecoder.decodeMethod(transaction.data);
  //   const toAddress = inputData.params.find((param) => param.name === '_to');
  //   const tokens = inputData.params.find((param) => param.name === '_tokens');
  //   const wei = utils.bigNumberify(tokens.value);
  //   formatedTransaction.to = toAddress.value;
  //   formatedTransaction.value = parseFloat(utils.formatEther(wei));
  // }
  return {
    type: TRANSFER_SUCCESS,
    transaction: transaction || { to: '0x00' },
  };
}

export function saveTrezorAddress(name, derivationPath, deviceId, address) {
  const newWallet = {
    deviceId,
    address,
    type: 'trezor',
    name,
    derivationPath,
  };
  return {
    type: CREATE_WALLET_SUCCESS,
    newWallet,
  };
}

export function transferError(error) {
  return {
    type: TRANSFER_ERROR,
    error,
  };
}
