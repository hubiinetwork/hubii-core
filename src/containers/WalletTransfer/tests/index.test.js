import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { WalletTransfer, mapDispatchToProps } from '../index';
import { pricesMock, walletsWithInfoMock, walletsMock, contactsMock, supportedAssetsMock } from '../../WalletHOC/tests/mocks';

describe('WalletTransfer', () => {
  const props = {
    prices: pricesMock,
    currentWallet: walletsMock.get(0),
    supportedAssets: supportedAssetsMock,
    currentWalletWithInfo: walletsWithInfoMock.get(0),
    contacts: contactsMock,
    transfer: () => {},
    history: {},
    errors: {},
    createContact: jest.fn(), 
  };

  it('should render correctly', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when balances are loading', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        currentWalletWithInfo={walletsWithInfoMock.get(0).setIn(['balances', 'loading'], true)}
      />
        );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when balances are in an error state', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        currentWalletWithInfo={walletsWithInfoMock.get(0).setIn(['balances', 'error'], { message: 'some error' })}
      />
        );
    expect(wrapper).toMatchSnapshot();
  });

  describe('#onSend', () => {
    it('should trigger transfer action', () => {
      const transferSpy = jest.fn();
      const historySpy = jest.fn();
      const wrapper = shallow(
        <WalletTransfer
          {...props}
          transfer={transferSpy}
          history={{ push: historySpy }}
        />
        );
      const instance = wrapper.instance();
      const token = 'BOKKY';
      const toAddress = 'abcd';
      const amount = 1;
      const gasPrice = 1;
      const gasLimit = 1;
      instance.onSend(token, toAddress, amount, gasPrice, gasLimit);
      const args = {
        wallet: props.currentWalletWithInfo.toJS(),
        token,
        toAddress,
        amount,
        gasPrice,
        gasLimit,
        contractAddress: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
      };
      expect(transferSpy).toBeCalledWith(args);
    });
  });
  describe('#componentDidUpdate', () => {
    it('should trigger #onCancel when tranfer success', () => {
      const cancelSpy = jest.fn();
      const wrapper = shallow(
        <WalletTransfer
          {...props}
          currentWallet={fromJS({ transfering: false, transferError: false })}
        />
        );
      const instance = wrapper.instance();
      instance.onCancel = cancelSpy;
      instance.componentDidUpdate({ currentWallet: fromJS({ transfering: true }) });
      expect(cancelSpy).toBeCalled();
    });

    it('should not trigger #onCancel when tranfered error', () => {
      const cancelSpy = jest.fn();
      const wrapper = shallow(
        <WalletTransfer
          {...props}
          currentWallet={fromJS({ transfering: false, transferError: true })}
        />
        );
      const instance = wrapper.instance();
      instance.onCancel = cancelSpy;
      instance.componentDidUpdate({ currentWallet: fromJS({ transfering: true }) });
      expect(cancelSpy).toHaveBeenCalledTimes(0);
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
