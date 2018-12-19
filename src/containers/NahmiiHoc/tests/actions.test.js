import nahmii from 'nahmii-sdk';
import * as actions from '../actions';
import * as constants from '../constants';

describe('nahmiiHoc actions', () => {
  describe('makeNahmiiPayment', () => {
    it('should return the correct payload', () => {
      const monetaryAmount = new nahmii.MonetaryAmount('1000', '0x0000000000000000000000000000000000000000');
      const recipient = '0x0000000000000000000000000000000000000001';
      const walletOverride = { address: '0x001' };
      const expected = {
        type: constants.MAKE_NAHMII_PAYMENT,
        monetaryAmount,
        recipient,
        walletOverride,
      };
      expect(actions.makeNahmiiPayment(monetaryAmount, recipient, walletOverride)).toEqual(expected);
    });
  });

  describe('nahmiiPaymentError', () => {
    it('should return the correct payload', () => {
      const error = new Error('some error');
      const expected = {
        type: constants.MAKE_NAHMII_PAYMENT_ERROR,
        error,
      };
      expect(actions.nahmiiPaymentError(error)).toEqual(expected);
    });
  });

  describe('nahmiiPaymentSuccess', () => {
    it('should return the correct payload', () => {
      const expected = {
        type: constants.MAKE_NAHMII_PAYMENT_SUCCESS,
      };
      expect(actions.nahmiiPaymentSuccess()).toEqual(expected);
    });
  });

  describe('loadBalances', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_BALANCES,
        address,
      };
      expect(actions.loadBalances(address)).toEqual(expected);
    });
  });

  describe('loadBalancesSuccess', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_BALANCES_SUCCESS,
        address,
      };
      expect(actions.loadBalancesSuccess(address)).toEqual(expected);
    });
  });

  describe('loadStagedBalances', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_STAGED_BALANCES,
        address,
      };
      expect(actions.loadStagedBalances(address)).toEqual(expected);
    });
  });

  describe('loadStagedBalancesSuccess', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
        address,
      };
      expect(actions.loadStagedBalancesSuccess(address)).toEqual(expected);
    });
  });

  describe('loadStagingBalances', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_STAGING_BALANCES,
        address,
      };
      expect(actions.loadStagingBalances(address)).toEqual(expected);
    });
  });

  describe('loadStagingBalancesSuccess', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
        address,
      };
      expect(actions.loadStagingBalancesSuccess(address)).toEqual(expected);
    });
  });

  describe('loadStagingBalancesSuccess', () => {
    it('should return the correct payload', () => {
      const address = '0x00';
      const expected = {
        type: constants.LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
        address,
      };
      expect(actions.loadStagingBalancesSuccess(address)).toEqual(expected);
    });
  });

  describe('enableNahmiiMainnet', () => {
    it('should return the correct payload', () => {
      const expected = {
        type: constants.ENABLE_NAHMII_MAINNET,
      };
      expect(actions.enableNahmiiMainnet()).toEqual(expected);
    });
  });

  describe('disableNahmiiMainnet', () => {
    it('should return the correct payload', () => {
      const expected = {
        type: constants.DISABLE_NAHMII_MAINNET,
      };
      expect(actions.disableNahmiiMainnet()).toEqual(expected);
    });
  });

  describe('hideDisclaimerBtn', () => {
    it('should return the correct payload', () => {
      const expected = {
        type: constants.HIDE_DISCLAIMER_BTN,
      };
      expect(actions.hideDisclaimerBtn()).toEqual(expected);
    });
  });

  describe('showDisclaimerBtn', () => {
    it('should return the correct payload', () => {
      const expected = {
        type: constants.SHOW_DISCLAIMER_BTN,
      };
      expect(actions.showDisclaimerBtn()).toEqual(expected);
    });
  });
});
