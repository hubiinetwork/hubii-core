import { fromJS } from 'immutable';

export const nahmiiAirdriipRegistrationMock = fromJS({
  stage: 'start',
  manualRegistrationInfo: {
    address: '0x000000000',
    signedMessage: '0x81327429834jksdfhks',
  },
  registering: false,
  addressStatuses: {},
});

export const nahmiiAirdriipRegistrationRegisterImportedMock = fromJS({
  stage: 'register-imported',
  manualRegistrationInfo: {
    address: '0x000000000',
    signedMessage: '0x81327429834jksdfhks',
  },
  registering: false,
  addressStatuses: {},
});

export const nahmiiAirdriipRegistrationRegisterArbitraryMock = fromJS({
  stage: 'register-arbitrary',
  manualRegistrationInfo: {
    address: '0x000000000',
    signedMessage: '0x81327429834jksdfhks',
  },
  registering: false,
  addressStatuses: {},
});

export const nahmiiAirdriipRegistrationRegisteringMock = fromJS({
  stage: 'start',
  manualRegistrationInfo: {
    address: '0x000000000',
    signedMessage: '0x81327429834jksdfhks',
  },
  registering: true,
  addressStatuses: {},
});
