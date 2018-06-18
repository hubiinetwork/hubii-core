import { take, put, select } from 'redux-saga/effects';
import ethers, { Wallet } from 'ethers';

import { CREATE_NEW_WALLET } from './constants';
import makeSelectPasswordInput from './selectors';
import {
  createNewWalletFailed,
  createNewWalletSuccess,
  updateProgress,
} from './actions';

// Called as wallet is being encrypted/decrypted
function* progressCallback(percent) {
  yield put(updateProgress(percent));
}

// Creates a new wallet based on a mnemonic
export function* createWallet() {
  try {
    const password = yield select(makeSelectPasswordInput());
    const mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
    const wallet = Wallet.fromMnemonic(mnemonic);
    const encryptedWallet = yield wallet.encrypt(password, progressCallback);
    yield put(createNewWalletSuccess(encryptedWallet));
  } catch (e) {
    yield put(createNewWalletFailed(e));
  }
}

// Root watcher
export default function* rootSaga() {
  yield take(CREATE_NEW_WALLET, createWallet);
}
