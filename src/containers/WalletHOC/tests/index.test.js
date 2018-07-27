import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import WalletHOC, { getComponentHOC, mapDispatchToProps } from '../index';
import { walletsWithInfoMock, currentWalletMock } from './mocks';

describe('WalletHOC', () => {
  const initWalletsBalancesSpy = jest.fn();
  const initLedgerSpy = jest.fn();
  const props = {
    currentWallet: currentWalletMock,
    currentWalletWithInfo: walletsWithInfoMock.get(0),
    initLedger: initLedgerSpy,
    initWalletsBalances: initWalletsBalancesSpy,
    decryptWallet: () => {},
    hideDecryptWalletModal: () => {},
    loading: fromJS({
      decryptingWallet: false,
    }),
  };
  let dom;
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('shallow mount', () => {
    describe('#WalletHOC', () => {
      it('should return composed component', () => {
        const hoc = WalletHOC('div');
        expect(hoc.WrappedComponent).toBeDefined();
      });
    });
    describe('#Hoc rendering', () => {
      it('renders correctly when loading is false', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        expect(dom).toMatchSnapshot();
      });
      it('renders correctly when loading is true', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
            loading={fromJS({ decryptingWallet: true })}
          />
        );
        expect(dom).toMatchSnapshot();
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
      it('should call initWalletsBalances prop when called', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const instance = dom.instance();
        instance.componentDidMount();
        expect(initWalletsBalancesSpy).toBeCalled();
      });
    });
    describe('#componentDidMount', () => {
      it('should call initLedger', () => {
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
          />
        );
        const instance = dom.instance();
        instance.componentDidMount();
        expect(initLedgerSpy).toBeCalled();
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
        const currentWalletWithInfo = fromJS({
          address: '0x00',
          encrypted: {},
        });
        const password = '123';
        const Hoc = getComponentHOC('div');
        dom = shallow(
          <Hoc
            {...props}
            decryptWallet={decryptWalletSpy}
            currentWalletWithInfo={currentWalletWithInfo}
          />
        );
        const instance = dom.instance();
        instance.setState({ password });
        instance.decryptWallet();
        expect(decryptWalletSpy).toBeCalledWith(currentWalletWithInfo.get('address'), currentWalletWithInfo.get('encrypted'), password);
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
