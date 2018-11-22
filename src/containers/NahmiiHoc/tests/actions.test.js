import {
  loadBalancesSuccess,
} from '../actions';

import {
  LOAD_NAHMII_BALANCES_SUCCESS,
} from '../constants';


describe('NahmiiHoc actions', () => {
  describe('loadBalancesSuccess Action', () => {
    it('returns expected output', () => {
      const address = '0x99';
      const balances = {
        assets: [
          { balance: '1', currency: { ct: '0x00', id: '0' } },
          { balance: '2', currency: { ct: '0x01', id: '0' } },
        ],
      };
      const modifiedBalances = {
        assets: [
          { balance: '1', currency: '0x00' },
          { balance: '2', currency: '0x01' },
        ],
      };
      const expected = {
        type: LOAD_NAHMII_BALANCES_SUCCESS,
        address,
        balances: modifiedBalances,
      };
      expect(loadBalancesSuccess(address, balances)).toEqual(expected);
    });
  });
});
