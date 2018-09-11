import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { deleteWallet } from 'containers/WalletHOC/actions';
import {
  walletsWithInfoMock,
  walletsWithInfoEmptyMock,
  totalBalancesLoadedMock,
  totalBalancesLoadingMock,
  totalBalancesErrorMock,
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
  pricesLoadedMock,
} from 'containers/WalletHOC/tests/mocks/selectors';

import { WalletsOverview, mapDispatchToProps } from '../index';

describe('WalletsOverview', () => {
  const props = {
    walletsWithInfo: walletsWithInfoMock,
    showDecryptWalletModal: () => {},
    deleteWallet: () => {},
    ledgerNanoSInfo: fromJS({ connected: false }),
    trezorInfo: fromJS({ connected: false }),
    setCurrentWallet: () => {},
    totalBalances: totalBalancesLoadedMock,
    supportedAssets: supportedAssetsLoadedMock,
    history: { push: () => {} },
    priceInfo: pricesLoadedMock,
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
