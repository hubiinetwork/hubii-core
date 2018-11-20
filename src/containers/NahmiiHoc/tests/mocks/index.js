import { fromJS } from 'immutable';

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
    { currency: { ct: '0x90', id: '0' }, balance: '1300000000000' },
    { currency: { ct: '0x91', id: '0' }, balance: '1000000000000' },
    { currency: { ct: '0x92', id: '0' }, balance: '1000000000000' },
  ])
).setIn(
  ['staging', 'assets'],
  fromJS([
    { currency: { ct: '0x90', id: '0' }, balance: '1000000000000' },
    { currency: { ct: '0x92', id: '0' }, balance: '1500000000000' },
  ])
);

export const totalExpected = fromJS({
  loading: false,
  error: false,
  assets: [
    { currency: { ct: '0x90', id: '0' }, balance: '2300000000000' },
    { currency: { ct: '0x91', id: '0' }, balance: '1000000000000' },
    { currency: { ct: '0x92', id: '0' }, balance: '2500000000000' },
  ],
});

export const balanceState = fromJS({
  '0x01': loadedBalanceState,
  '0x02': loadedEmptyBalanceState,
  '0x03': loadedErroredBalanceState,
  '0x04': loadingBalanceState,
});
