import { takeEvery, put, call, select } from 'redux-saga/effects';
import { Wallet } from 'ethers';
import { fromJS } from 'immutable';
import { makeSelectWallets } from './selectors';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  CREATE_NEW_WALLET_SUCCESS,
  LOAD_WALLETS,
} from './constants';
import {
  createNewWalletFailed,
  createNewWalletSuccess,
  decryptWalletFailed,
  decryptWalletSuccess,
  updateProgress,
  loadWalletsSuccess,
} from './actions';

// Called as wallet is being encrypted/decrypted
export function* progressCallback(percent) {
  if (percent < 0 || percent > 1) throw new Error('invalid param');
  yield put(updateProgress(percent));
}

// Creates a new software wallet
export function* createWallet({ name, mnemonic, derivationPath, password }) {
  try {
    if (!name || !derivationPath || !password || !mnemonic) throw new Error('invalid param');
    const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    // const encryptedWallet = yield call(decryptedWallet.encrypt, password);
    const encryptedWallet = yield decryptedWallet.encrypt(password);
    yield put(createNewWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(createNewWalletFailed(e));
  }
}

// Decrypt a software wallet using a password
export function* decryptWallet({ name, encryptedWallet, password }) {
  try {
    if (!name) throw new Error('name undefined');
    const res = yield call(Wallet.fromEncryptedWallet, encryptedWallet, password, progressCallback);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(name, decryptedWallet));
  } catch (e) {
    yield put(decryptWalletFailed(e));
  }
}

export function cacheNewWallet({ name, newWallet }) {
  const existingWallets = JSON.parse(window.localStorage.getItem('wallets')) || { software: {}, hardware: {} };
  existingWallets.software[name] = { encrypted: newWallet.encrypted };
  window.localStorage.setItem('wallets', JSON.stringify(existingWallets));
}

export function* loadWallets() {
  const storedWallets = JSON.parse(window.localStorage.getItem('wallets')) || { software: {}, hardware: {} };
  const sessionWallets = (yield select(makeSelectWallets())).toJS();

  Object.keys(storedWallets).forEach((type) => {
    Object.keys(storedWallets[type]).forEach((walletName) => {
      if (!sessionWallets[type][walletName]) {
        sessionWallets[type][walletName] = storedWallets[type][walletName];
      }
    });
  });
  yield put(loadWalletsSuccess(fromJS(sessionWallets)));
}

// Root watcher
export default function* walletManager() {
  yield takeEvery(CREATE_NEW_WALLET, createWallet);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(CREATE_NEW_WALLET_SUCCESS, cacheNewWallet);
  yield takeEvery(LOAD_WALLETS, loadWallets);
}
