import { takeLatest, put, select } from 'redux-saga/effects';

import { notify } from 'containers/App/actions';
// import { signPersonalMessage } from 'containers/WalletHoc/saga';
import { showDecryptWalletModal, setCurrentWallet } from 'containers/WalletHoc/actions';
import { makeSelectCurrentWalletWithInfo } from 'containers/WalletHoc/selectors';

import { REGISTER } from './constants';
import { registerationSuccess, registerationFailed, register as registerAction } from './actions';

function* register() {
  try {
    const wallet = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
    if (wallet.encrypted && !wallet.decrypted) {
      yield put(setCurrentWallet(wallet.address));
      yield put(registerationFailed(new Error('wallet encrypted')));
      yield put(showDecryptWalletModal(registerAction()));
      return;
    }
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    yield delay(1000);
    // const signedMessage = yield signPersonalMessage({ message: 'test', wallet });
    yield put(notify('success', 'Address registered sucessfully!'));
    yield put(registerationSuccess());
  } catch (e) {
    yield put(registerationFailed());
    yield put(notify('error', `Sorry, something went wrong during registration: ${e}`));
  }
}

// Individual exports for testing
export default function* root() {
  yield takeLatest(REGISTER, register);
}
