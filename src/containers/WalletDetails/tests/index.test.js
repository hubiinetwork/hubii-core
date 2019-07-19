import React from 'react';
import { shallow } from 'enzyme';
import { walletsWithInfoMock } from 'containers/WalletHoc/tests/mocks/selectors';
import { ledgerHocConnectedMock } from 'containers/LedgerHoc/tests/mocks/selectors';
import { trezorHocConnectedMock } from 'containers/TrezorHoc/tests/mocks/selectors';

import { intl } from 'jest/__mocks__/react-intl';
import { WalletDetails, mapDispatchToProps } from '../index';

describe('WalletDetails', () => {
  const props = {
    match: { params: { address: 'abcd' } },
    history: { location: { pathname: '/wallet/abcd' } },
    currentWalletDetails: walletsWithInfoMock.get(0),
    setCurrentWallet: () => {},
    loadBlockHeight: () => {},
    intl,
    ledgerInfo: ledgerHocConnectedMock,
    trezorInfo: trezorHocConnectedMock,
  };
  const setCurrentWalletSpy = jest.fn();
  let dom;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <WalletDetails
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('#componentDidMount', () => {
    it('should call the initWalletsDetails action', () => {
      dom = shallow(
        <WalletDetails
          {...props}
          setCurrentWallet={setCurrentWalletSpy}
        />
      );
      const instance = dom.instance();
      instance.componentDidMount();
      expect(setCurrentWalletSpy).toBeCalledWith(props.match.params.address);
    });
  });
  describe('#onHomeClick', () => {
    it('should push history path', () => {
      const historySpy = jest.fn();
      const history = { push: historySpy, location: { pathname: '/wallet/abcd' } };
      dom = shallow(
        <WalletDetails
          {...props}
          history={history}
        />
      );
      const instance = dom.instance();
      instance.onHomeClick();
      expect(historySpy).toBeCalledWith('/wallets');
    });
  });
  describe('#onTabsChange', () => {
    it('should push history path', () => {
      const historySpy = jest.fn();
      const history = { push: historySpy, location: { pathname: '/wallet/abcd' } };
      dom = shallow(
        <WalletDetails
          {...props}
          history={history}
        />
      );
      const instance = dom.instance();
      const path = '/path';
      instance.onTabsChange(path);
      expect(historySpy).toBeCalledWith(path);
    });
  });
  describe('#mapDispatchToProps', () => {
    it('should dispatch', () => {
      const dispatchSpy = jest.fn();
      const actions = mapDispatchToProps(dispatchSpy);
      Object.keys(actions).forEach((action, index) => {
        actions[action]();
        expect(dispatchSpy).toHaveBeenCalledTimes(index + 1);
      });
    });
  });
});
