import { fromJS } from 'immutable';

import { walletsMock } from 'containers/WalletHoc/tests/mocks/selectors';

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
    { currency: { ct: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', id: '0' }, balance: '1300000000000' },
    { currency: { ct: 'ETH', id: '0' }, balance: '1000000000000' },
  ])
).setIn(
  ['staging', 'assets'],
  fromJS([
    { currency: { ct: 'ETH', id: '0' }, balance: '1000000000000' },
    { currency: { ct: '0x90', id: '0' }, balance: '1000000000000' },
    { currency: { ct: '0x92', id: '0' }, balance: '1500000000000' },
  ])
);

export const totalExpected = fromJS({
  loading: false,
  error: false,
  assets: [
    { currency: { ct: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', id: '0' }, balance: '1300000000000' },
    { currency: { ct: 'ETH', id: '0' }, balance: '2000000000000' },
    { currency: { ct: '0x90', id: '0' }, balance: '1000000000000' },
    { currency: { ct: '0x92', id: '0' }, balance: '1500000000000' },
  ],
});

export const balanceState = fromJS({
  [walletsMock.getIn([0, 'address'])]: loadedBalanceState,
  [walletsMock.getIn([1, 'address'])]: loadedEmptyBalanceState,
  [walletsMock.getIn([2, 'address'])]: loadedErroredBalanceState,
  [walletsMock.getIn([3, 'address'])]: loadingBalanceState,
});
