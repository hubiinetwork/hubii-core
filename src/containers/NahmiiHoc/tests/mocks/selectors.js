import { fromJS } from 'immutable';

import {
  lnsWalletMock,
  trezorWalletMock,
  encryptedSoftwareWallet1Mock,
  decryptedSoftwareWallet2Mock,
} from 'containers/WalletHoc/tests/mocks';

import {
  balanceState,
  totalExpected,
} from './index';

// makeSelectNahmiiBalances
export const balancesEmpty = fromJS({});
export const balances = balanceState
  .setIn([lnsWalletMock.get('address'), 'total'], totalExpected)
  .setIn([trezorWalletMock.get('address'), 'total'], totalExpected.set('assets', fromJS([])))
  .setIn([encryptedSoftwareWallet1Mock.get('address'), 'total'], totalExpected.set('assets', fromJS([])).set('error', 'someerror'))
  .setIn([decryptedSoftwareWallet2Mock.get('address'), 'total'], totalExpected.set('assets', fromJS([])).set('loading', true));

// makeSelectDepositStatus
export const depositStatusNone = fromJS({
  depositingEth: false,
  approvingTokenDeposit: false,
  completingTokenDeposit: false,
  error: null,
});

export const depositStatusEth = depositStatusNone.set('depositingEth', true);
export const depositStatusApproving = depositStatusNone.set('approvingTokenDeposit', true);
export const depositStatusCompleting = depositStatusNone.set('completingTokenDeposit', true);
export const depositStatusError = depositStatusNone.set('error', 'some error message');


// selectNahmiiHocDomain
export const nahmiiHocMock = fromJS({
  balances: balanceState,
});
