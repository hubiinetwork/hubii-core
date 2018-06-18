import { take, put, select } from 'redux-saga/effects';
import ethers, { Wallet } from 'ethers';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
} from './constants';
import {
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
} from './selectors';
import {
  createNewWalletFailed,
  createNewWalletSuccess,
  updateProgress,
} from './actions';

// Called as wallet is being encrypted/decrypted
function* progressCallback(percent) {
  yield put(updateProgress(percent));
}

// Creates a new software wallet based on a mnemonic
export function* createWallet() {
  try {
    const password = yield select(makeSelectPasswordInput());
    const derivationPath = yield select(makeSelectDerivationPathInput());
    const mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
    const wallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    const encryptedWallet = yield wallet.encrypt(password, progressCallback);
    yield put(createNewWalletSuccess(encryptedWallet));
  } catch (e) {
    yield put(createNewWalletFailed(e));
  }
}

// Decrypt a software wallet using a password
export function* decryptWallet() {
  try {
    const password = yield select(makeSelectPasswordInput());
    const walletName = yield select(makeSelectSelectedWalletName());
    const encryptedWallet = yield select(makeSelectWallets()).getIn(['software', walletName]);
    const decryptedWallet = yield Wallet.fromEncryptedWallet(encryptedWallet, password, progressCallback);
    yield put(createNewWalletSuccess(decryptedWallet));
  } catch (e) {
    yield put(createNewWalletFailed(e));
  }
}

// Root watcher
export default function* rootSaga() {
  yield take(CREATE_NEW_WALLET, createWallet);
  yield take(DECRYPT_WALLET, decryptWallet);
}
