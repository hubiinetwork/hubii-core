import { fromJS } from 'immutable';

import {
  lnsWalletMock,
  trezorWalletMock,
  encryptedSoftwareWallet1Mock,
  decryptedSoftwareWallet2Mock,
} from 'containers/WalletHoc/tests/mocks';

export const loadedEmptyBalanceState = fromJS({
  available: {
    loading: false,
    error: null,
    assets: [],
  },
  staged: {
    loading: false,
    error: null,
    assets: [],
  },
  staging: {
    loading: false,
    error: null,
    assets: [],
  },
});

export const loadedErroredBalanceState = loadedEmptyBalanceState
  .setIn(
    ['available', 'error'],
    'someerror'
  );

export const loadingBalanceState = loadedEmptyBalanceState
  .setIn(
    ['staging', 'loading'],
    true
  );

export const loadedBalanceState = loadedEmptyBalanceState.setIn(
  ['available', 'assets'],
  fromJS([
    { currency: '0x0000000000000000000000000000000000000000', balance: '100000000000000000' },
    { currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', balance: '130000000000000000' },
  ])
).setIn(
  ['staging', 'assets'],
  fromJS([
    { currency: '0x0000000000000000000000000000000000000000', balance: '100000000000000000' },
  ])
);

export const totalExpected = fromJS({
  loading: false,
  error: false,
  assets: [
    { currency: '0x0000000000000000000000000000000000000000', balance: '200000000000000000' },
    { currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', balance: '130000000000000000' },
  ],
});

export const balanceState = fromJS({
  [lnsWalletMock.get('address')]: loadedBalanceState,
  [trezorWalletMock.get('address')]: loadedEmptyBalanceState,
  [encryptedSoftwareWallet1Mock.get('address')]: loadedErroredBalanceState,
  [decryptedSoftwareWallet2Mock.get('address')]: loadingBalanceState,
});
