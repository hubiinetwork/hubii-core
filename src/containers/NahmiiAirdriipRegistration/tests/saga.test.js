/**
 * Test sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeEvery } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { getIntl } from 'utils/localisation';
import { storeMock } from 'mocks/store';

import { showDecryptWalletModal, setCurrentWallet } from 'containers/WalletHoc/actions';
import { notify } from 'containers/App/actions';
import { SET_CURRENT_WALLET } from 'containers/WalletHoc/constants';
import { currentWalletSoftwareEncrypted } from 'containers/WalletHoc/tests/mocks/selectors';

import {
  registerationSuccess,
  registerationFailed,
  register as registerAction,
} from '../actions';
import root, { register, checkRegistrationStatus } from '../saga';
import { REGISTER } from '../constants';
import { nahmiiAirdriipRegistrationRegisterImportedMock } from './mocks/selectors';

describe('register saga', () => {
  it('should correctly handle a custom registration', () => expectSaga(register)
    .withState(storeMock)
    .provide({
      call(effect, next) {
        if (effect.fn.name === 'requestWalletAPI') {
          return true;
        }
        if (effect.fn.name === 'signPersonalMessage') {
          return { v: '0', s: '0', r: '0' };
        }
        return next();
      },
    })
    .put(notify('success', getIntl().formatMessage({ id: 'address_registered_successfully' })))
    .put(registerationSuccess('0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0'))
    .run()
  );
  it('should correctly handle a hubii wallet registration', () => {
    const testState = storeMock
      .set('nahmiiAirdriipRegistration', nahmiiAirdriipRegistrationRegisterImportedMock);
    const address = testState.getIn(['walletHoc', 'currentWallet', 'address']);
    return expectSaga(register)
      .withState(testState)
      .provide({
        call(effect, next) {
          if (effect.fn.name === 'requestWalletAPI') {
            return true;
          }
          if (effect.fn.name === 'signPersonalMessage') {
            return { v: '0', s: '0', r: '0' };
          }
          return next();
        },
      })
      .put(notify('success', getIntl().formatMessage({ id: 'address_registered_successfully' })))
      .put(registerationSuccess(address))
      .run();
  });
  it('should correctly handle an encrypted wallet', () => {
    const testState = storeMock
      .set('nahmiiAirdriipRegistration', nahmiiAirdriipRegistrationRegisterImportedMock)
      .setIn(['walletHoc', 'currentWallet'], currentWalletSoftwareEncrypted);
    const address = testState.getIn(['walletHoc', 'currentWallet', 'address']);
    return expectSaga(register)
      .withState(testState)
      .put(setCurrentWallet(address))
      .put(registerationFailed('wallet encrypted'))
      .put(showDecryptWalletModal(registerAction()))
      .run();
  });
  it('should correctly handle a failed API response', () => {
    const testState = storeMock
      .set('nahmiiAirdriipRegistration', nahmiiAirdriipRegistrationRegisterImportedMock);
    return expectSaga(register)
      .withState(testState)
      .provide({
        call(effect, next) {
          if (effect.fn.name === 'requestWalletAPI') {
            throw new Error('some error');
          }
          if (effect.fn.name === 'signPersonalMessage') {
            return { v: '0', s: '0', r: '0' };
          }
          return next();
        },
      })
      .put(registerationFailed())
      .put(notify('error', getIntl().formatMessage({ id: 'airdriip_registration_problem' }, { message: 'some error' })))
      .run();
  });
});

describe('root saga', () => {
  const rootSaga = root();
  it('should start task to watch for REGISTER action', () => {
    const takeDescriptor = rootSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(REGISTER, register));
  });

  it('should start task to watch for SET_CURRENT_WALLET action', () => {
    const takeDescriptor = rootSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(SET_CURRENT_WALLET, checkRegistrationStatus));
  });
});
