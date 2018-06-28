import React from 'react';
import { shallow } from 'enzyme';
import { WalletTransfer, mapDispatchToProps } from '../index';

describe('WalletTransfer', () => {
  describe('shallow mount', () => {
    const params = {

      currentWalletDetails: {
        balances: [
          { balance: '100', decimals: 2, price: { USD: '1' } },
          { balance: '100', decimals: 2, price: { USD: '1' } },
        ],
      },
    };
    let dom;
    describe('#onSend', () => {
      it('should trigger transfer action', () => {
        const transferSpy = jest.fn();
        dom = shallow(
          <WalletTransfer
            {...params}
            transfer={transferSpy}
          />
        );
        const instance = dom.instance();
        const token = 'token';
        const toAddress = 'abcd';
        const amount = 1;
        const gasPrice = 1;
        const gasLimit = 1;
        instance.onSend(token, toAddress, amount, gasPrice, gasLimit);
        const args = {
          wallet: params.currentWalletDetails,
          token,
          toAddress,
          amount,
          gasPrice,
          gasLimit,
        };
        expect(transferSpy).toBeCalledWith(args);
      });
    });
    describe('#mapDispatchToProps', () => {
      it('should dispatch', () => {
        const dispatchSpy = jest.fn();
        const actions = mapDispatchToProps(dispatchSpy);
        Object.keys(actions).forEach((action, index) => {
          actions[action]({});
          expect(dispatchSpy).toHaveBeenCalledTimes(index + 1);
        });
      });
    });
  });
});
