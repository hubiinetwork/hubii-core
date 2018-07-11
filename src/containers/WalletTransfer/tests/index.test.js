import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { WalletTransfer, mapDispatchToProps } from '../index';

describe('WalletTransfer', () => {
  describe('shallow mount', () => {
    const params = {
      contacts: fromJS([
        {
          name: 'mike',
          address: '0x123123',
        },
        {
          name: 'john',
          address: '0x1231323',
        },
        {
          name: 'hayley',
          address: '0x112312123',
        },
      ]),
      currentWalletDetails: {
        balances: [
          { balance: '100', decimals: 2, price: { USD: '1' } },
          { balance: '100', decimals: 2, price: { USD: '1' } },
        ],
      },
      currentWallet: fromJS({ address: '1' }),
      transfer: () => {},
      history: {},
    };
    let dom;
    describe('#onSend', () => {
      it('should trigger transfer action', () => {
        const transferSpy = jest.fn();
        const historySpy = jest.fn();
        dom = shallow(
          <WalletTransfer
            {...params}
            transfer={transferSpy}
            history={{ push: historySpy }}
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
    describe('#componentDidUpdate', () => {
      it('should trigger #onCancel when tranfered success', () => {
        const cancelSpy = jest.fn();
        dom = shallow(
          <WalletTransfer
            {...params}
            currentWallet={fromJS({ transfering: false, transferError: false })}
          />
        );
        const instance = dom.instance();
        instance.onCancel = cancelSpy;
        instance.componentDidUpdate({ currentWallet: fromJS({ transfering: true }) });
        expect(cancelSpy).toBeCalled();
      });
      it('should not trigger #onCancel when tranfered error', () => {
        const cancelSpy = jest.fn();
        dom = shallow(
          <WalletTransfer
            {...params}
            currentWallet={fromJS({ transfering: false, transferError: true })}
          />
        );
        const instance = dom.instance();
        instance.onCancel = cancelSpy;
        instance.componentDidUpdate({ currentWallet: fromJS({ transfering: true }) });
        expect(cancelSpy).toHaveBeenCalledTimes(0);
      });
    });
    describe('render', () => {
      it('should render LoadingError component when loadingBalancesError is not null', () => {
        dom = shallow(
          <WalletTransfer
            {...params}
            currentWalletDetails={{ loadingBalancesError: {} }}
          />
        );
        expect(dom.find('LoadingError').length).toBe(1);
      });
      it('should not render LoadingError component when loadingBalancesError is null or false', () => {
        dom = shallow(
          <WalletTransfer
            {...params}
            currentWalletDetails={{ loadingBalancesError: null }}
          />
        );
        expect(dom.find('LoadingError').length).toBe(0);
      });
      it('should render PageLoadingIndicator component when balances is null', () => {
        dom = shallow(
          <WalletTransfer
            {...params}
            currentWalletDetails={{}}
          />
        );
        expect(dom.find('PageLoadingIndicator').length).toBe(1);
      });
      it('should not render LoadingError component when balances is not null', () => {
        dom = shallow(
          <WalletTransfer
            {...params}
            currentWalletDetails={{ balances: [] }}
          />
        );
        expect(dom.find('PageLoadingIndicator').length).toBe(0);
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
