import { takeLatest, put, select } from 'redux-saga/effects';

import { notify } from 'containers/App/actions';
import { signPersonalMessage } from 'containers/WalletHoc/saga';

import { REGISTER } from './constants';
import makeSelectNahmiiAirdriipRegistration from './selectors';

function* register() {
  try {
    const store = yield select(makeSelectNahmiiAirdriipRegistration());
    const signedMessage = yield signPersonalMessage({ message: 'test', wallet: store.get('selectedCoreWallet').toJS() });
    console.log(signedMessage);
  } catch (e) {
    yield put(notify('error', `Sorry, something went wrong during registration: ${e}`));
  }
}

// Individual exports for testing
export default function* root() {
  yield takeLatest(REGISTER, register);
}
