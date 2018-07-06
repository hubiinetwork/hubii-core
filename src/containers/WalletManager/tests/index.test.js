import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import Tab from 'components/ui/Tab';
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
    };
    let createNewWalletSpy;
    let createWalletFromPrivateKeySpy;
    let dom;
    beforeEach(() => {
      createNewWalletSpy = jest.fn();
      params.createNewWallet = createNewWalletSpy;
      createWalletFromPrivateKeySpy = jest.fn();
      params.createWalletFromPrivateKey = createWalletFromPrivateKeySpy;

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
        expect(dom.find(Tab).props().activeKey).toEqual(history.location.pathname);
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
        it('#componentDidUpdate should hide modal when creatingWallet finished', () => {
          dom = shallow(
            <WalletManager
              {...params}
            />
          );
          const instance = dom.instance();
          instance.showModal();
          expect(instance.state.visible).toEqual(true);
          const lastProps = { loading: fromJS({ creatingWallet: true }) };
          instance.componentDidUpdate(lastProps);
          expect(instance.state.visible).toEqual(false);
        });
        it('#componentDidUpdate should not trigger to hide modal when last creatingWallet props is false', () => {
          dom = shallow(
            <WalletManager
              {...params}
            />
          );
          const instance = dom.instance();
          instance.showModal();
          expect(instance.state.visible).toEqual(true);
          const lastProps = { loading: fromJS({ creatingWallet: false }) };
          instance.componentDidUpdate(lastProps);
          expect(instance.state.visible).toEqual(true);
        });
        it('#componentDidUpdate should not hide modal when it is creatingWallet', () => {
          const mockLoading = {
            creatingWallet: true,
          };
          const mockErrors = {
            creatingWalletError: null,
          };
          dom = shallow(
            <WalletManager
              {...params}
              loading={fromJS(mockLoading)}
              errors={fromJS(mockErrors)}
            />
          );
          const instance = dom.instance();
          instance.showModal();
          expect(instance.state.visible).toEqual(true);

          const lastProps = { loading: fromJS({ creatingWallet: true }) };
          instance.componentDidUpdate(lastProps);
          expect(instance.state.visible).toEqual(true);
        });
        it('#componentDidUpdate should not hide modal when it has error', () => {
          const mockLoading = {
            creatingWallet: false,
          };
          const mockErrors = {
            creatingWalletError: new Error(),
          };
          dom = shallow(
            <WalletManager
              {...params}
              loading={fromJS(mockLoading)}
              errors={fromJS(mockErrors)}
            />
          );
          const instance = dom.instance();
          instance.showModal();
          expect(instance.state.visible).toEqual(true);

          const lastProps = { loading: fromJS({ creatingWallet: true }) };
          instance.componentDidUpdate(lastProps);
          expect(instance.state.visible).toEqual(true);
        });
      });
      it('#handleAddWalletSubmit should call createNewWallet action', () => {
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
        expect(createNewWalletSpy).toBeCalledWith(args.name, args.mnemonic, args.derivationPath, args.password);
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
