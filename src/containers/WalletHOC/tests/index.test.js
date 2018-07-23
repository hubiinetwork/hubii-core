import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import WalletHOC, { getComponentHOC, mapDispatchToProps } from '../index';

describe('WalletHOC', () => {
  describe('shallow mount', () => {
    const loadWalletsBalancesSpy = jest.fn();
    const startLedgerSyncSpy = jest.fn();
    const props = {
      currentWallet: fromJS({
        showDecryptModal: false,
      }),
      currentWalletDetails: {},
      decryptWallet: () => {},
      hideDecryptWalletModal: () => {},
      loadWalletsBalances: loadWalletsBalancesSpy,
      startLedgerSync: startLedgerSyncSpy,
      loading: fromJS({
        decryptingWallet: false,
      }),
    };
    let dom;
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('#WalletHOC', () => {
      it('should return composed component', () => {
        const hoc = WalletHOC('div');
        expect(hoc.WrappedComponent).toBeDefined();
      });
    });
    describe('#componentWillReceiveProps', () => {
      it('should set the password state to null if prev modal display was false and new is true', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const nextProps = {
          currentWallet: fromJS({
            showDecryptModal: true,
          }),
        };
        const instance = dom.instance();
        instance.setState({ password: 'password' });
        instance.componentWillReceiveProps(nextProps);
        const expectedPassword = null;
        expect(instance.state.password).toEqual(expectedPassword);
      });
      it('should not set the password state to null if prev modal display was false and new is false', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const nextProps = {
          currentWallet: fromJS({
            showDecryptModal: false,
          }),
        };
        const instance = dom.instance();
        instance.setState({ password: 'password' });
        instance.componentWillReceiveProps(nextProps);
        const expectedPassword = 'password';
        expect(instance.state.password).toEqual(expectedPassword);
      });
    });
    describe('#componentDidMount', () => {
      it('should call loadWallets prop when called', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const instance = dom.instance();
        instance.componentDidMount();
        expect(loadWalletsBalancesSpy).toBeCalled();
      });
    });
    describe('#componentDidMount', () => {
      it('should call startLedgerSync prop when called', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const instance = dom.instance();
        instance.componentDidMount();
        expect(startLedgerSyncSpy).toBeCalled();
      });
    });
    describe('#onPasswordChange', () => {
      it('should update password to temporary state', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const instance = dom.instance();
        const password = 'test';
        instance.onPasswordChange({ target: { value: password } });
        expect(instance.state.password).toEqual(password);
      });
    });
    describe('#handleKeyPress', () => {
      it('should run the decryptWallet when "enter" key is pressed', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const event = {
          key: 'Enter',
        };
        const instance = dom.instance();
        const spy = jest.spyOn(instance, 'decryptWallet');
        instance.handleKeyPress(event);
        expect(spy).toHaveBeenCalledTimes(1);
      });
      it('should not run the decryptWallet when "enter" key is pressed', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const event = {
          key: '',
        };
        const instance = dom.instance();
        const spy = jest.spyOn(instance, 'decryptWallet');
        instance.handleKeyPress(event);
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
    describe('#decryptWallet', () => {
      it('should trigger decryptWallet action', () => {
        const decryptWalletSpy = jest.fn();
        const currentWalletDetails = {
          address: '0x00',
          encrypted: {},
        };
        const password = '123';
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
            decryptWallet={decryptWalletSpy}
            currentWalletDetails={currentWalletDetails}
          />
        );
        const instance = dom.instance();
        instance.setState({ password });
        instance.decryptWallet();
        expect(decryptWalletSpy).toBeCalledWith(currentWalletDetails.address, JSON.stringify(currentWalletDetails.encrypted), password);
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
