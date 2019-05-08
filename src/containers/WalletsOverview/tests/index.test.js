import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { deleteWallet } from 'containers/WalletHoc/actions';
import {
  walletsWithInfoMock,
  walletsWithInfoEmptyMock,
  totalBalancesLoadedMock,
  totalBalancesLoadingMock,
  totalBalancesErrorMock,
  walletsMock,
} from 'containers/WalletHoc/tests/mocks/selectors';

import {
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
  pricesLoadedMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import { intl } from 'jest/__mocks__/react-intl';
import { WalletsOverview, mapDispatchToProps } from '../index';

describe('WalletsOverview', () => {
  const props = {
    walletsWithInfo: walletsWithInfoMock,
    wallets: walletsMock,
    showDecryptWalletModal: () => {},
    deleteWallet: () => {},
    editWallet: () => {},
    lockWallet: () => {},
    dragWallet: () => {},
    toggleFoldWallet: () => {},
    ledgerNanoSInfo: fromJS({ connected: false }),
    trezorInfo: fromJS({ connected: false }),
    setCurrentWallet: () => {},
    notify: () => {},
    totalBalances: totalBalancesLoadedMock,
    supportedAssets: supportedAssetsLoadedMock,
    history: { push: () => {} },
    priceInfo: pricesLoadedMock,
    intl,
  };

  it('should render correctly when there are wallets', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there are no wallets', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
        walletsWithInfo={walletsWithInfoEmptyMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when totalBalances is loading', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
        totalBalances={totalBalancesLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when totalBalances is errored', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
        totalBalances={totalBalancesErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets is loading', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
        supportedAssets={supportedAssetsLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets is errored', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
        supportedAssets={supportedAssetsErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there are no wallets', () => {
    const wrapper = shallow(
      <WalletsOverview
        {...props}
        walletsWithInfo={fromJS([])}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('#handleCardClick', () => {
    it('should push history with a path with wallet address', () => {
      const historySpy = jest.fn();
      const history = { push: historySpy };
      const wrapper = shallow(<WalletsOverview
        {...props}
        history={history}
      />);
      const instance = wrapper.instance();
      const address = '0xabcd';
      instance.handleCardClick({ address });
      expect(historySpy).toBeCalledWith(`/wallet/${address}/overview`);
    });
  });
  describe('mapDispatchToProps', () => {
    describe('deleteWallet', () => {
      it('should call dispatch', () => {
        const walletToRemove = {
          type: 'software',
          name: '12123',
          address: '0x234234',
        };
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.deleteWallet(walletToRemove);
        expect(dispatch).toHaveBeenCalledWith(deleteWallet(walletToRemove));
      });
    });
  });
});
