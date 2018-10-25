import { fromJS } from 'immutable';

export const nahmiiAirdriipRegistrationMock = fromJS({
  stage: 'start',
  manualRegistrationInfo: {
    address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
    signedMessage: '0x8bfb0e2034f6e5e311c100308264551719db9d674dfbd5b20c54e545d310b6c41bfb02f74c5f2b49d6a55e133ee2d290578f90e9f810d6887a5b229282f6b8a600',
  },
  registering: false,
  addressStatuses: {},
});

export const nahmiiAirdriipRegistrationRegisterImportedMock = fromJS({
  stage: 'register-imported',
  manualRegistrationInfo: {
    address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
    signedMessage: '0x8bfb0e2034f6e5e311c100308264551719db9d674dfbd5b20c54e545d310b6c41bfb02f74c5f2b49d6a55e133ee2d290578f90e9f810d6887a5b229282f6b8a600',
  },
  registering: false,
  addressStatuses: {},
});

export const nahmiiAirdriipRegistrationRegisterArbitraryMock = fromJS({
  stage: 'register-arbitrary',
  manualRegistrationInfo: {
    address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
    signedMessage: '0x8bfb0e2034f6e5e311c100308264551719db9d674dfbd5b20c54e545d310b6c41bfb02f74c5f2b49d6a55e133ee2d290578f90e9f810d6887a5b229282f6b8a600',
  },
  registering: false,
  addressStatuses: {},
});

export const nahmiiAirdriipRegistrationRegisteringMock = fromJS({
  stage: 'start',
  manualRegistrationInfo: {
    address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
    signedMessage: '0x8bfb0e2034f6e5e311c100308264551719db9d674dfbd5b20c54e545d310b6c41bfb02f74c5f2b49d6a55e133ee2d290578f90e9f810d6887a5b229282f6b8a600',
  },
  registering: true,
  addressStatuses: {},
});
