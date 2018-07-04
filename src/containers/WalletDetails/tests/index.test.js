import React from 'react';
import { shallow } from 'enzyme';
import { WalletDetails, mapDispatchToProps } from '../index';

describe('WalletDetails', () => {
  describe('shallow mount', () => {
    const params = {

      match: { params: { address: 'abcd' } },
      history: { location: { pathname: '/wallet/abcd' } },
      currentWalletDetails: {
        balances: [
          { balance: '100', decimals: 2, price: { USD: '1' } },
          { balance: '100', decimals: 2, price: { USD: '1' } },
        ],
      },
    };
    let setCurrentWalletSpy;
    let dom;
    beforeEach(() => {
      setCurrentWalletSpy = jest.fn();
      params.setCurrentWallet = setCurrentWalletSpy;
    });
    describe('#componentDidMount', () => {
      it('should loadWallets action', () => {
        dom = shallow(
          <WalletDetails
            {...params}
          />
        );
        const instance = dom.instance();
        instance.componentDidMount();
        expect(setCurrentWalletSpy).toBeCalledWith(null, params.match.params.address);
      });
    });
    describe('#onHomeClick', () => {
      it('should push history path', () => {
        const historySpy = jest.fn();
        const history = { push: historySpy, location: { pathname: '/wallet/abcd' } };
        dom = shallow(
          <WalletDetails
            {...params}
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
            {...params}
            history={history}
          />
        );
        const instance = dom.instance();
        const path = '/path';
        instance.onTabsChange(path);
        expect(historySpy).toBeCalledWith(path);
      });
    });
    describe('#render', () => {
      it('should show total usd value in header', () => {
        dom = shallow(
          <WalletDetails
            {...params}
          />
        );
        expect(dom.find('WalletHeader').props().balance).toEqual(2);
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
});
