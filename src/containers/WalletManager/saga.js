import { takeEvery, put, call, select } from 'redux-saga/effects';
import { Wallet } from 'ethers';
import { makeSelectWallets } from './selectors';
import request from '../../utils/request';
import { getWalletsLocalStorage } from '../../utils/wallet';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  CREATE_NEW_WALLET_SUCCESS,
  LOAD_WALLETS,
  LOAD_WALLET_BALANCES,
} from './constants';
import {
  createNewWalletFailed,
  createNewWalletSuccess,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWalletsSuccess,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
} from './actions';

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
    const res = yield Wallet.fromEncryptedWallet(encryptedWallet, password);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(name, decryptedWallet));
  } catch (e) {
    yield put(decryptWalletFailed(e));
  }
}

export function cacheNewWallet({ name, newWallet }) {
  const existingWallets = getWalletsLocalStorage();
  existingWallets.software[name] = { encrypted: newWallet.encrypted };
  window.localStorage.setItem('wallets', JSON.stringify(existingWallets));
}

export function* loadWallets() {
  const storedWallets = getWalletsLocalStorage();
  const sessionWallets = (yield select(makeSelectWallets())).toJS();

  Object.keys(storedWallets).forEach((type) => {
    Object.keys(storedWallets[type]).forEach((walletName) => {
      sessionWallets[type][walletName] = storedWallets[type][walletName];
    });
  });
  yield put(loadWalletsSuccess(sessionWallets));
}

export function* loadWalletBalances({ name, walletAddress }) {
  const requestPath = `ethereum/wallets/${walletAddress}/balance`;
  try {
    const returnData = yield call(request, requestPath);
    yield put(loadWalletBalancesSuccess(name, returnData));
  } catch (err) {
    yield put(loadWalletBalancesError(name, err));
  }
}

// Root watcher
export default function* walletManager() {
  yield takeEvery(CREATE_NEW_WALLET, createWallet);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(CREATE_NEW_WALLET_SUCCESS, cacheNewWallet);
  yield takeEvery(LOAD_WALLETS, loadWallets);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalances);
}
