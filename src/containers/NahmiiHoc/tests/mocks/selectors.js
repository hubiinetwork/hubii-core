import { fromJS } from 'immutable';

import {
  lnsWalletMock,
  trezorWalletMock,
  encryptedSoftwareWallet1Mock,
  decryptedSoftwareWallet1Mock,
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
  .setIn([decryptedSoftwareWallet1Mock.get('address'), 'total'], totalExpected.set('assets', fromJS([])).set('loading', true));

// selectNahmiiHocDomain
export const nahmiiHocMock = fromJS({
  balances: balanceState,
});
