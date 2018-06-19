import { takeEvery, take, put, call } from 'redux-saga/effects';
import { Wallet } from 'ethers';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
} from './constants';
import {
  createNewWalletFailed,
  createNewWalletSuccess,
  updateProgress,
} from './actions';

// Called as wallet is being encrypted/decrypted
export function* progressCallback(percent) {
  yield put(updateProgress(percent));
}

// Creates a new software wallet
export function* createWallet({ name, mnemonic, derivationPath, password }) {
  try {
    if (!name || !derivationPath || !password || !mnemonic) throw new Error('invalid param');
    const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    const encryptedWallet = yield call(decryptedWallet.encrypt, password, progressCallback);
    yield put(createNewWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(createNewWalletFailed(e));
  }
}

// Decrypt a software wallet using a password
// export function* decryptWallet() {
//   try {
//     const password = yield select(makeSelectPasswordInput());
//     const walletName = yield select(makeSelectSelectedWalletName());
//     const encryptedWallet = yield select(makeSelectWallets()).getIn(['software', walletName]);
//     const decryptedWallet = yield Wallet.fromEncryptedWallet(encryptedWallet, password, progressCallback);
//     yield put(createNewWalletSuccess(encryptedWallet, decryptedWallet));
//   } catch (e) {
//     yield put(createNewWalletFailed(e));
//   }
// }

// Root watcher
export default function* walletManager() {
  yield takeEvery(CREATE_NEW_WALLET, createWallet);
  // yield take(DECRYPT_WALLET, decryptWallet);
}
