import ethers from 'ethers';
import utils from 'nahmii-sdk/lib/utils';
import { takeEvery, put, select, call } from 'redux-saga/effects';
import { requestWalletAPI } from 'utils/request';

import { notify } from 'containers/App/actions';
import { signPersonalMessage } from 'containers/WalletHoc/saga';
import { showDecryptWalletModal, setCurrentWallet } from 'containers/WalletHoc/actions';
import { makeSelectCurrentWalletWithInfo } from 'containers/WalletHoc/selectors';
import { SET_CURRENT_WALLET } from 'containers/WalletHoc/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';

import { REGISTER } from './constants';
import {
  registerationSuccess,
  registerationFailed,
  register as registerAction,
  checkAddressRegistrationSuccess,
  checkAddressRegistrationFailed,
} from './actions';
import { makeSelectNahmiiAirdriipRegistration } from './selectors';

const MESSAGE = 'I agree to the terms and conditions for signing up for the nahmii airdriip.';
const API_PATH = 'airdriips/registrations';

export function* checkRegistrationStatus({ address }) {
  try {
    const addressStatus = (yield select(makeSelectNahmiiAirdriipRegistration()))
                            .getIn(['addressStatuses', address]);

    if (addressStatus === 'registered' || addressStatus === 'unregistered') return;

    // const network = yield select(makeSelectCurrentNetwork());
    // const response = yield requestWalletAPI(`${API_PATH}/${address}`, network);
    yield put(checkAddressRegistrationSuccess(address, 'unregistered'));
  } catch (e) {
    yield put(checkAddressRegistrationFailed(address, 'Error: asdfads)'));
  }
}

export function* register() {
  try {
    let messageHash;
    let address;
    let sig;
    const network = yield select(makeSelectCurrentNetwork());
    const nahmiiAirdriipState = (yield select(makeSelectNahmiiAirdriipRegistration())).toJS();
    if (nahmiiAirdriipState.stage === 'register-imported') {
      const wallet = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
      if (wallet.encrypted && !wallet.decrypted) {
        yield put(setCurrentWallet(wallet.address));
        yield put(registerationFailed('wallet encrypted'));
        yield put(showDecryptWalletModal(registerAction()));
        return;
      }
      address = wallet.address;
      messageHash = utils.hash(MESSAGE, wallet.address);
      const messageHashArr = ethers.utils.arrayify(messageHash);
      sig = yield call(signPersonalMessage, { message: messageHashArr, wallet });
    } else {
      address = nahmiiAirdriipState.manualRegistrationInfo.address;
      sig = nahmiiAirdriipState.manualRegistrationInfo.signedMessage;
    }
    const payload = {
      document: MESSAGE,
      sender: address,
      seal: {
        hash: messageHash,
        signature: sig,
      },
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    yield call(requestWalletAPI, API_PATH, network, options);

    yield put(notify('success', 'Address registered sucessfully!'));
    yield put(registerationSuccess(address));
  } catch (e) {
    yield put(registerationFailed());
    yield put(notify('error', `Sorry, something went wrong during registration: ${e}`));
  }
}

// Individual exports for testing
export default function* root() {
  yield takeEvery(REGISTER, register);
  yield takeEvery(SET_CURRENT_WALLET, checkRegistrationStatus);
}
