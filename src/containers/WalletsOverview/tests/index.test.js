import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { deleteWallet } from 'containers/WalletHOC/actions';
import { convertWalletsList } from 'utils/wallet';
import { makeSelectWalletList } from 'containers/WalletHOC/selectors';
import { WalletsOverview, mapDispatchToProps } from '../index';
describe('WalletsOverview', () => {
  describe('shallow mount', () => {
    const wallets = [{ name: 'test1', type: 'software', encrypted: '{"address": "abcd1"}' }, { name: 'test2', type: 'software', encrypted: '{"address": "abcd2"}' }];
    const state = fromJS({ walletHoc: { wallets } });
    const test2Index = state.getIn(['walletHoc', 'wallets']).findIndex((wallet) => wallet.name === 'test2');
    const test1Index = state.getIn(['walletHoc', 'wallets']).findIndex((wallet) => wallet.name === 'test1');
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
      walletList: convertWalletsList(fromJS(wallets)),
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
          expect(dom.find('WalletItemCard').length).toEqual(wallets.length);
        });
      });
      describe('Breakdown', () => {
        xit('Breakdown should be no available when balance is no available', () => {
          expect(dom.find('Breakdown').length).toEqual(0);
        });
        xit('Breakdown should be available when all balances are available', () => {
          const walletsState = state
            .setIn(['walletHoc', 'wallets', test1Index, 'balances'], balances[0])
            .setIn(['walletHoc', 'wallets', test2Index, 'balances'], balances[1]);

          const walletsList = makeSelectWalletList()(walletsState);
          const overviewDom = shallow(
            <WalletsOverview
              {...params}
              walletList={walletsList}
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
          const walletsState = state.setIn(['walletHoc', 'wallets', test1Index, 'balances'], balances[0]);
          const walletsList = makeSelectWalletList()(walletsState);

          const overviewDom = shallow(
            <WalletsOverview
              {...params}
              walletList={walletsList}
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
    describe('#getWalletCardsData', () => {
      it('should transform wallets array into cards structure', () => {
        const instance = dom.instance();
        const walletsState = state
          .setIn(['walletHoc', 'wallets', 0, 'balances'], balances[0])
          .setIn(['walletHoc', 'wallets', 1, 'balances'], balances[1]);
        const walletsList = makeSelectWalletList()(walletsState);
        const cardsData = instance.getWalletCardsData(walletsList);
        expect(cardsData.length).toEqual(walletsList.length);
        cardsData.forEach((card, index) => {
          expect(card.name).toEqual(walletsList[index].name);
          expect(card.type).toEqual(walletsList[index].type);
          expect(card.primaryAddress).toEqual(`0x${walletsList[index].encrypted.address}`);
          expect(card.totalBalance).toEqual(walletsList[index].balances.reduce((accumulator, current) => accumulator + (parseInt(current.balance, 10) / (10 ** current.decimals)), 0));
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
        const walletsList = makeSelectWalletList()(state);
        const cardsData = instance.getWalletCardsData(walletsList);
        expect(cardsData.length).toEqual(walletsList.length);
        cardsData.forEach((card, index) => {
          const name = wallets[index].name;
          expect(card.name).toEqual(name);
          expect(card.type).toEqual(wallets[index].type);
          expect(card.primaryAddress).toEqual(`0x${JSON.parse(wallets[index].encrypted).address}`);
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
});
