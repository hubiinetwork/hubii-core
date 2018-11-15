import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import Tabs from 'components/ui/Tabs';
import { intl } from 'jest/__mocks__/react-intl';
import { WalletManager, mapDispatchToProps } from '../index';

describe('WalletManager', () => {
  describe('shallow mount', () => {
    const match = {
      url: '/wallets',
    };
    const history = {
      location: {
        pathname: '/wallets',
      },
    };
    const loading = {};
    const errors = {};
    const params = {
      match,
      history,
      loading: fromJS(loading),
      errors: fromJS(errors),
      wallets: fromJS([{}]),
      intl,
    };
    let createWalletFromMnemonicSpy;
    let createWalletFromPrivateKeySpy;
    let createWalletFromKeystoreSpy;
    let createContactSpy;

    let dom;
    beforeEach(() => {
      createWalletFromMnemonicSpy = jest.fn();
      params.createWalletFromMnemonic = createWalletFromMnemonicSpy;
      createWalletFromPrivateKeySpy = jest.fn();
      params.createWalletFromPrivateKey = createWalletFromPrivateKeySpy;
      createWalletFromKeystoreSpy = jest.fn();
      params.createWalletFromKeystore = createWalletFromKeystoreSpy;

      createContactSpy = jest.fn();
      params.createContact = createContactSpy;
      dom = shallow(
        <WalletManager
          {...params}
        />
      );
    });
    describe('render', () => {
      it('should default route to /wallets/overview', () => {
        expect(dom.find('Redirect').length).toEqual(1);
      });
      it('should not redirect when the route is already in /{match.url}/overview', () => {
        const mockHistory = { location: { pathname: '/wallets/overview' } };
        dom = shallow(
          <WalletManager
            {...params}
            history={mockHistory}
          />
        );
        expect(dom.find('Redirect').length).toEqual(0);
      });
      it('should set activeKey of Tab to the location.pathname', () => {
        expect(dom.find(Tabs).props().activeKey).toEqual(history.location.pathname);
      });
    });
    describe('methods', () => {
      it('#onTabsChange', () => {
        const pushSpy = jest.fn();
        const mockHistory = {
          location: {},
          push: pushSpy,
        };
        dom = shallow(
          <WalletManager
            {...params}
            history={mockHistory}
          />
        );
        const instance = dom.instance();
        const key = 'test';
        instance.onTabsChange(key);
        expect(pushSpy).toBeCalledWith(key);
      });
      describe('componentDidUpdate', () => {
        it('#componentDidUpdate should hide modal when new wallet is added', () => {
          dom = shallow(
            <WalletManager
              {...params}
            />
          );
          const instance = dom.instance();
          instance.showModal();
          expect(instance.state.visible).toEqual(true);
          const lastProps = { wallets: fromJS([]) };
          instance.componentDidUpdate(lastProps);
          expect(instance.state.visible).toEqual(false);
        });
        it('#componentDidUpdate should not trigger to hide modal when wallets count remain the same', () => {
          dom = shallow(
            <WalletManager
              {...params}
            />
          );
          const instance = dom.instance();
          instance.showModal();
          expect(instance.state.visible).toEqual(true);
          const lastProps = { wallets: params.wallets };
          instance.componentDidUpdate(lastProps);
          expect(instance.state.visible).toEqual(true);
        });
      });
      it('#onCreateContact should call createContact action', () => {
        dom = shallow(
          <WalletManager
            {...params}
          />
        );
        const instance = dom.instance();
        const args = {
          name: 'mike',
          address: '0x12312',
        };
        instance.onCreateContact(args);
        expect(createContactSpy).toBeCalledWith(args.name, args.address);
      });
      it('#handleAddWalletSubmit should call createWalletFromMnemonic action', () => {
        dom = shallow(
          <WalletManager
            {...params}
          />
        );
        const instance = dom.instance();
        const args = {
          name: 'name',
          mnemonic: 'mnemonic',
          derivationPath: '//',
          password: 'pwd',
        };
        instance.handleAddWalletSubmit(args);
        expect(createWalletFromMnemonicSpy).toBeCalledWith(args.name, args.mnemonic, args.derivationPath, args.password);
      });
      it('#handleAddWalletSubmit should call createWalletFromMnemonic action', () => {
        dom = shallow(
          <WalletManager
            {...params}
          />
        );
        const instance = dom.instance();
        const args = [{
          walletType: 'Private key',
        }, {
          privateKey: 'privateKey',
          name: 'name',
          password: 'pwd',
        }];
        instance.handleImportWalletSubmit(args);
        expect(createWalletFromPrivateKeySpy).toBeCalledWith(args[1].privateKey, args[1].name, args[1].password);
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
