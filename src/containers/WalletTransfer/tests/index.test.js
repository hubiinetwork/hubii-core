import React from 'react';
import { shallow } from 'enzyme';
import nahmii from 'nahmii-sdk';
import { fromJS } from 'immutable';
import {
  walletsWithInfoMock,
  walletsMock,
} from 'containers/WalletHoc/tests/mocks/selectors';

import {
  currentNetworkMock,
} from 'containers/App/tests/mocks/selectors';

import {
  pricesLoadedMock,
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
  pricesLoadingMock,
  pricesErrorMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import {
  ledgerHocConnectedMock,
  ledgerHocConfOnDeviceMock,
} from 'containers/LedgerHoc/tests/mocks/selectors';

import {
  trezorHocConnectedMock,
  trezorHocConfOnDeviceMock,
} from 'containers/TrezorHoc/tests/mocks/selectors';

import { contactsMock } from 'containers/WalletHoc/tests/mocks';

import { WalletTransfer, mapDispatchToProps } from '../index';

describe('WalletTransfer', () => {
  const props = {
    prices: pricesLoadedMock,
    currentNetwork: currentNetworkMock,
    currentWallet: walletsMock.get(0),
    supportedAssets: supportedAssetsLoadedMock,
    currentWalletWithInfo: walletsWithInfoMock.get(0),
    contacts: contactsMock,
    nahmiiTransfer: () => {},
    baseLayerTransfer: () => {},
    history: {},
    errors: {},
    ledgerNanoSInfo: ledgerHocConnectedMock,
    trezorInfo: trezorHocConnectedMock,
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

  it('should render correctly when supported assets are loading', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        supportedAssets={supportedAssetsLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supported assets are in error state', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        supportedAssets={supportedAssetsErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when prices are loading', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        prices={pricesLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when prices are in error state', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        prices={pricesErrorMock}
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

  it('should render correctly when ledgerNanoSInfo is in confTxOnDevice state', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        ledgerNanoSInfo={ledgerHocConfOnDeviceMock}
      />
        );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when trezorInfo is in confTxOnDevice state', () => {
    const wrapper = shallow(
      <WalletTransfer
        {...props}
        trezorInfo={trezorHocConfOnDeviceMock}
      />
        );
    expect(wrapper).toMatchSnapshot();
  });

  describe('#onSend', () => {
    it('should trigger baseLayerTransfer action when layer is set to baseLayer', () => {
      const baseLayerTransferSpy = jest.fn();
      const historySpy = jest.fn();
      const wrapper = shallow(
        <WalletTransfer
          {...props}
          baseLayerTransfer={baseLayerTransferSpy}
          history={{ push: historySpy }}
        />
        );
      const instance = wrapper.instance();
      const symbol = 'BOKKY';
      const toAddress = 'abcd';
      const amount = 1;
      const gasPrice = 1;
      const gasLimit = 1;
      instance.onSend(symbol, toAddress, amount, 'baseLayer', gasPrice, gasLimit);
      const args = {
        wallet: props.currentWalletWithInfo.toJS(),
        token: symbol,
        toAddress,
        amount,
        gasPrice,
        gasLimit,
        contractAddress: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
      };
      expect(baseLayerTransferSpy).toBeCalledWith(args);
    });

    it('should trigger nahmiiTransfer action when layer is set to nahmii', () => {
      const nahmiiTransferSpy = jest.fn();
      const historySpy = jest.fn();
      const wrapper = shallow(
        <WalletTransfer
          {...props}
          nahmiiTransfer={nahmiiTransferSpy}
          history={{ push: historySpy }}
        />
        );
      const instance = wrapper.instance();
      const symbol = 'BOKKY';
      const toAddress = 'abcd';
      const amount = 1;
      const gasPrice = 1;
      const gasLimit = 1;
      const monetaryAmount = new nahmii.MonetaryAmount(amount, '0x583cbbb8a8443b38abcc0c956bece47340ea1367');
      instance.onSend(symbol, toAddress, amount, 'nahmii', gasPrice, gasLimit);
      expect(nahmiiTransferSpy).toBeCalledWith(monetaryAmount, toAddress);
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
