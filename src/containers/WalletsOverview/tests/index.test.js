import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { WalletsOverview, mapDispatchToProps } from '../index';

describe('WalletsOverview', () => {
  describe('shallow mount', () => {
    const wallets = {
      software: {
        test1: {
          encrypted: '{"address": "abcd1"}',
        },
        test2: {
          encrypted: '{"address": "abcd2"}',
        },
      },
      hardware: {},
    };
    const balances = [
      [
        {
          symbol: 'ETH',
          balance: '10000',
          decimals: 4,
          price: { USD: 1 },
          primaryColor: 'c1',
        },
        {
          symbol: 'SII',
          balance: '10000',
          decimals: 4,
          price: { USD: 1 },
          primaryColor: 'c2',
        },
      ],
      [
        {
          symbol: 'ETH',
          balance: '10000',
          decimals: 4,
          price: { USD: 1 },
          primaryColor: 'c1',
        },
        {
          symbol: 'SII',
          balance: '10000',
          decimals: 4,
          price: { USD: 1 },
          primaryColor: 'c2',
        },
      ],
    ];
    const params = {
      wallets: fromJS(wallets),
    };
    let loadWalletsSpy;
    let loadWalletsBalancesSpy;

    let dom;
    beforeEach(() => {
      loadWalletsSpy = jest.fn();
      loadWalletsBalancesSpy = jest.fn();
      params.loadWallets = loadWalletsSpy;
      params.loadWalletBalances = loadWalletsBalancesSpy;

      dom = shallow(
        <WalletsOverview
          {...params}
        />
            );
    });
    describe('render', () => {
      describe('WalletItemCard', () => {
        it('number of WalletItemCard should be same as the number of wallets in state', () => {
          expect(dom.find('WalletItemCard').length).toEqual(Object.keys(wallets.software).length);
        });
      });
      describe('Breakdown', () => {
        it('Breakdown should be no available when balance is no available', () => {
          expect(dom.find('Breakdown').length).toEqual(0);
        });
        it('Breakdown should be available when all balances are available', () => {
          const walletsState = params.wallets
                        .setIn(['software', 'test1', 'balances'], balances[0])
                        .setIn(['software', 'test2', 'balances'], balances[1]);
          const overviewDom = shallow(
            <WalletsOverview
              {...params}
              wallets={walletsState}
            />
                    );
          expect(overviewDom.find('Breakdown').length).toEqual(1);
          const breakdown = overviewDom.find('Breakdown').props().data;
          const totalValue = overviewDom.find('Breakdown').props().value;
          expect(totalValue).toEqual(4);
          expect(breakdown).toEqual([
                        { label: 'ETH', percentage: 50, color: 'c1' },
                        { label: 'SII', percentage: 50, color: 'c2' },
          ]);
        });
        it('Breakdown should be also available when no all balances are available', () => {
          const walletsState = params.wallets
                        .setIn(['software', 'test1', 'balances'], balances[0]);
          const overviewDom = shallow(
            <WalletsOverview
              {...params}
              wallets={walletsState}
            />
                    );
          expect(overviewDom.find('Breakdown').length).toEqual(1);
          const breakdown = overviewDom.find('Breakdown').props().data;
          const totalValue = overviewDom.find('Breakdown').props().value;
          expect(totalValue).toEqual(2);
          expect(breakdown).toEqual([
                        { label: 'ETH', percentage: 50, color: 'c1' },
                        { label: 'SII', percentage: 50, color: 'c2' },
          ]);
        });
      });
    });
    describe('#componentDidUpdate', () => {
      it('should call loadWalletsBalancesSpy if wallets props has been changed', () => {
        const instance = dom.instance();
        instance.componentDidUpdate({});
        expect(loadWalletsBalancesSpy.mock.calls).toEqual([['test1', '0xabcd1'], ['test2', '0xabcd2']]);
      });
      it('should not call loadWalletsBalancesSpy if wallets props has not been changed', () => {
        const instance = dom.instance();
        instance.componentDidUpdate({ wallets: params.wallets });
        expect(loadWalletsBalancesSpy.mock.calls).toEqual([]);
      });
      it('should not call loadWalletsBalancesSpy when balances in state is not null', () => {
        const walletsState = params.wallets.setIn(['software', 'test1', 'balances'], [{ price: { USD: 1 } }]);
        dom = shallow(
          <WalletsOverview
            {...params}
            wallets={walletsState}
            loadWalletBalances={loadWalletsBalancesSpy}
          />
                );
        const instance = dom.instance();
        instance.componentDidUpdate({});
        expect(loadWalletsBalancesSpy.mock.calls).toEqual([['test2', '0xabcd2']]);
      });
      it('should not call loadWalletsBalancesSpy when loadingBalancesError in state is not null', () => {
        const walletsState = params.wallets.setIn(['software', 'test1', 'loadingBalancesError'], new Error());
        dom = shallow(
          <WalletsOverview
            {...params}
            wallets={walletsState}
            loadWalletBalances={loadWalletsBalancesSpy}
          />
                );
        const instance = dom.instance();
        instance.componentDidUpdate({});
        expect(loadWalletsBalancesSpy.mock.calls).toEqual([['test2', '0xabcd2']]);
      });
      it('should not call loadWalletsBalancesSpy when loadingBalancesError in state is not null', () => {
        const walletsState = params.wallets.setIn(['software', 'test1', 'loadingBalances'], true);
        dom = shallow(
          <WalletsOverview
            {...params}
            wallets={walletsState}
            loadWalletBalances={loadWalletsBalancesSpy}
          />
                );
        const instance = dom.instance();
        instance.componentDidUpdate({});
        expect(loadWalletsBalancesSpy.mock.calls).toEqual([['test2', '0xabcd2']]);
      });
    });
    describe('#getWalletCardsData', () => {
      it('should transform wallets array into cards structure', () => {
        const instance = dom.instance();
        const walletsState = params.wallets
                    .setIn(['software', 'test1', 'balances'], balances[0])
                    .setIn(['software', 'test2', 'balances'], balances[1]);

        const cardsData = instance.getWalletCardsData(walletsState);
        expect(cardsData.length).toEqual(walletsState.count());
        cardsData.forEach((card, index) => {
          const type = 'software';
          const softwareWallets = wallets[type];
          const name = Object.keys(softwareWallets)[index];
          expect(card.name).toEqual(name);
          expect(card.type).toEqual(type);
          expect(card.primaryAddress).toEqual(`0x${JSON.parse(softwareWallets[name].encrypted).address}`);
          expect(card.totalBalance).toEqual(balances[index].reduce((accumulator, current) => accumulator + (parseInt(current.balance, 10) / (10 ** current.decimals)), 0));
          card.assets.forEach((asset, i) => {
            expect(asset.name).toEqual(balances[index][i].symbol);
            expect(asset.amount).toEqual(parseInt(balances[index][i].balance, 10) / (10 ** balances[index][i].decimals));
            expect(asset.price).toEqual(balances[index][i].price);
            expect(asset.color).toEqual(balances[index][i].primaryColor);
          });
        });
      });
      it('should handle wallets that do not have balances', () => {
        const instance = dom.instance();
        const walletsState = params.wallets;

        const cardsData = instance.getWalletCardsData(walletsState);
        expect(cardsData.length).toEqual(walletsState.count());
        cardsData.forEach((card, index) => {
          const type = 'software';
          const softwareWallets = wallets[type];
          const name = Object.keys(softwareWallets)[index];
          expect(card.name).toEqual(name);
          expect(card.type).toEqual(type);
          expect(card.primaryAddress).toEqual(`0x${JSON.parse(softwareWallets[name].encrypted).address}`);
          expect(card.totalBalance).toEqual(0);
          expect(card.assets).toEqual([]);
        });
      });
    });
    describe('#handleCardClick', () => {
      it('should push history with a path with wallet address', () => {
        const historySpy = jest.fn();
        const history = { push: historySpy };
        const overviewDom = shallow(<WalletsOverview
          {...params}
          history={history}
        />);
        const instance = overviewDom.instance();
        const address = '0xabcd';
        instance.handleCardClick(address);
        expect(historySpy).toBeCalledWith(`/wallet/${address}`);
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
