import getFriendlyError from 'utils/friendlyErrors';

import {
  CREATE_WALLET_SUCCESS,
} from 'containers/WalletHOC/constants';

import {
  ledgerEthAppConnected,
  ledgerError,
  saveLedgerAddress,
  initLedger,
} from '../actions';

import {
  LEDGER_ETH_CONNECTED,
  LEDGER_ERROR,
  INIT_LEDGER,
} from '../constants';


describe('LedgerHoc actions', () => {
  describe('initLedger Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: INIT_LEDGER,
      };
      expect(initLedger()).toEqual(expected);
    });
  });

  describe('ledgerEthAppConnected Action', () => {
    it('returns expected output', () => {
      const id = '048ncjdh39';
      const descriptor = 'desc';
      const expected = {
        type: LEDGER_ETH_CONNECTED,
        id,
        descriptor,
      };
      expect(ledgerEthAppConnected(descriptor, id)).toEqual(expected);
    });
  });

  // should dispatch new add wallet action
  describe('saveLedgerAddress Action', () => {
    it('returns expected output', () => {
      const deviceId = '0x0028342093';
      const address = '0x000';
      const name = 'wallet12';
      const derivationPath = 'm/0/0123';
      const newWallet = {
        deviceId,
        address,
        type: 'lns',
        name,
        derivationPath,
      };
      const expected = {
        type: CREATE_WALLET_SUCCESS,
        newWallet,
      };
      expect(saveLedgerAddress(name, derivationPath, deviceId, address)).toEqual(expected);
    });
  });

  describe('ledgerError Action', () => {
    it('converts error and returns expected output', () => {
      const error = { id: 'ListenTimeout' };
      const friendlyError = getFriendlyError(error);
      const expected = {
        type: LEDGER_ERROR,
        error: friendlyError,
      };
      expect(ledgerError(error)).toEqual(expected);
    });
  });
});
