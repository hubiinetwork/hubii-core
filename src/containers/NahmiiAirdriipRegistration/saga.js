import { utils as ethersUtils } from 'ethers';
import { fromRpcSig, bufferToHex } from 'ethereumjs-util';
import utils from 'nahmii-sdk/lib/utils';
import { take, takeEvery, put, select, call } from 'redux-saga/effects';
import { requestWalletAPI } from 'utils/request';
import { getIntl } from 'utils/localisation';

import { notify } from 'containers/App/actions';
import { signPersonalMessage } from 'containers/WalletHoc/saga';
import { showDecryptWalletModal, setCurrentWallet } from 'containers/WalletHoc/actions';
import { makeSelectCurrentWalletWithInfo } from 'containers/NahmiiHoc/combined-selectors';
import { SET_CURRENT_WALLET } from 'containers/WalletHoc/constants';
import { LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS } from 'containers/HubiiApiHoc/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';

import { REGISTER } from './constants';
import {
  registerationSuccess,
  registerationFailed,
  register as registerAction,
  checkAddressRegistrationSuccess,
} from './actions';
import { makeSelectNahmiiAirdriipRegistration } from './selectors';

const MESSAGE = 'I agree to the terms and conditions for signing up for the nahmii airdriip.';
const MESSAGE_HASH = utils.hash(MESSAGE);
const API_PATH = 'airdriips/registrations';

export function* checkRegistrationStatus({ address }) {
  try {
    // this saga is special, as it may be called before the JWT token for the hubii
    // API has been loaded. do a quick check here and ensure the JWT is loaded
    let network = yield select(makeSelectCurrentNetwork());
    if (!network.identityServiceToken) {
      yield take(LOAD_IDENTITY_SERVICE_TOKEN_SUCCESS);
      network = yield select(makeSelectCurrentNetwork());
    }

    const addressStatus = (yield select(makeSelectNahmiiAirdriipRegistration()))
      .getIn(['addressStatuses', address]);

    if (addressStatus === 'registered') return;

    yield requestWalletAPI(`${API_PATH}/${address}`, network);
    yield put(checkAddressRegistrationSuccess(address, 'registered'));
  } catch (e) {
    yield put(checkAddressRegistrationSuccess(address, 'unregistered'));
  }
}

export function* register() {
  try {
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
      const messageHashArr = ethersUtils.arrayify(MESSAGE_HASH);
      sig = yield call(signPersonalMessage, { message: messageHashArr, wallet });
    } else {
      address = nahmiiAirdriipState.manualRegistrationInfo.address;
      sig = fromRpcSig(nahmiiAirdriipState.manualRegistrationInfo.signedMessage);
      sig.s = bufferToHex(sig.s);
      sig.r = bufferToHex(sig.r);
    }

    // check to ensure the address isn't already registered
    try {
      // try to get address registration status
      // if already registered, network call will suceeeded and we terminate the saga early
      // else, network call will fail and execution will continue as usual
      yield requestWalletAPI(`${API_PATH}/${address}`, network);
      yield put(notify('info', getIntl().formatMessage({ id: 'airdriip_address_is_already_registered' })));
      yield put(registerationFailed());
      return;
    } catch (e) {
      // continue with execution
    }

    const payload = {
      document: MESSAGE,
      sender: address,
      seal: {
        hash: MESSAGE_HASH,
        signature: sig,
      },
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    yield call(requestWalletAPI, API_PATH, network, options);

    yield put(notify('success', getIntl().formatMessage({ id: 'address_registered_successfully' })));
    yield put(registerationSuccess(address));
  } catch (e) {
    yield put(registerationFailed());
    yield put(notify('error', getIntl().formatMessage({ id: 'airdriip_registration_problem' }, { message: e })));
  }
}

// Individual exports for testing
export default function* root() {
  yield takeEvery(REGISTER, register);
  yield takeEvery(SET_CURRENT_WALLET, checkRegistrationStatus);
}
