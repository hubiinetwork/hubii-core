import { fromJS } from 'immutable';

import {
  lnsWalletMock,
  trezorWalletMock,
  encryptedSoftwareWallet1Mock,
  decryptedSoftwareWallet1Mock,
} from 'containers/WalletHoc/tests/mocks';

export const loadedEmptyBalanceState = fromJS({
  avaliable: {
    loading: false,
    error: false,
    assets: [],
  },
  staged: {
    loading: false,
    error: false,
    assets: [],
  },
  staging: {
    loading: false,
    error: false,
    assets: [],
  },
});

export const loadedErroredBalanceState = loadedEmptyBalanceState
  .setIn(
  ['staged', 'error'],
  'someerror'
  );

export const loadingBalanceState = loadedEmptyBalanceState
  .setIn(
  ['staging', 'loading'],
  true
  );

export const loadedBalanceState = loadedEmptyBalanceState.setIn(
  ['avaliable', 'assets'],
  fromJS([
    { currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', balance: '1300000000000' },
    { currency: 'ETH', balance: '1000000000000' },
  ])
).setIn(
  ['staging', 'assets'],
  fromJS([
    { currency: 'ETH', balance: '1000000000000' },
    { currency: '0x90', balance: '1000000000000' },
    { currency: '0x92', balance: '1500000000000' },
  ])
);

export const totalExpected = fromJS({
  loading: false,
  error: false,
  assets: [
    { currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', balance: '1300000000000' },
    { currency: 'ETH', balance: '2000000000000' },
    { currency: '0x90', balance: '1000000000000' },
    { currency: '0x92', balance: '1500000000000' },
  ],
});

export const balanceState = fromJS({
  [lnsWalletMock.get('address')]: loadedBalanceState,
  [trezorWalletMock.get('address')]: loadedEmptyBalanceState,
  [encryptedSoftwareWallet1Mock.get('address')]: loadedErroredBalanceState,
  [decryptedSoftwareWallet1Mock.get('address')]: loadingBalanceState,
});
