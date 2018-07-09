import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import WalletHOC, { getComponentHOC, mapDispatchToProps } from '../index';

describe('WalletHOC', () => {
  describe('shallow mount', () => {
    const params = {
      currentWallet: fromJS({
        showDecryptModal: false,
      }),
      currentWalletDetails: {},
      decryptWallet: () => {},
      hideDecryptWalletModal: () => {},
    };
    let loadWalletsBalancesSpy;
    let dom;
    beforeEach(() => {
      loadWalletsBalancesSpy = jest.fn();
      params.loadWalletsBalances = loadWalletsBalancesSpy;
    });
    describe('#WalletHOC', () => {
      it('should return composed component', () => {
        const hoc = WalletHOC('div');
        expect(hoc.WrappedComponent).toBeDefined();
      });
    });
    describe('#componentDidMount', () => {
      it('should loadWallets action', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...params}
          />
        );
        const instance = dom.instance();
        instance.componentDidMount();
        expect(loadWalletsBalancesSpy).toBeCalled();
      });
    });
    describe('#onPasswordChange', () => {
      it('should update password to temporary state', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...params}
          />
        );
        const instance = dom.instance();
        const password = 'test';
        instance.onPasswordChange({ target: { value: password } });
        expect(instance.state.password).toEqual(password);
      });
    });
    describe('#decryptWallet', () => {
      it('should trigger decryptWallet action', () => {
        const decryptWalletSpy = jest.fn();
        const currentWalletDetails = {
          name: 'wallet',
          encrypted: {},
        };
        const password = '123';
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...params}
            decryptWallet={decryptWalletSpy}
            currentWalletDetails={currentWalletDetails}
          />
        );
        const instance = dom.instance();
        instance.setState({ password });
        instance.decryptWallet();
        expect(decryptWalletSpy).toBeCalledWith(currentWalletDetails.name, JSON.stringify(currentWalletDetails.encrypted), password);
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
