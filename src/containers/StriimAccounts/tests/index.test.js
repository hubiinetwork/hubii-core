import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import StriimTabs from 'components/ui/StriimTabs';
import { StriimAccounts, mapDispatchToProps } from '../index';

describe('StriimAccounts', () => {
  const striimAccounts = fromJS([
    {
      id: 100,
      uid: 1,
      name: 'Striim Account 1',
      balances: [
        {
          active: 3500,
          staged: 300,
          asset: 'ETH',
        },
        {
          active: 3000,
          staged: 300,
          asset: 'HBT',
        },
      ],
    },
    {
      id: 101,
      uid: 1,
      name: 'Striim Account 2',
      balances: [
        {
          active: 4000,
          staged: 300,
          asset: 'ETH',
        },
        {
          active: 4000,
          staged: 300,
          asset: 'HBT',
        },
      ],
    },
  ]);

  const exchangeRates = fromJS({
    HBT_USD: { data: { price: 0.6 } },
    ETH_USD: { data: { price: 500 } },
    ICX_USD: { data: { price: 0.1 } },
    OMG_USD: { data: { price: 13 } },
  });

  describe('shallow mount', () => {
    const subMatchUrl = '/striim-accounts';
    const loadStriimAccountsSpy = jest.fn();
    const currentAccount = striimAccounts.get(0);
    const currentCurrency = currentAccount.get('balances').get(0);
    const currentPathname = '/striim-accounts/savings';
    const uid = '2';
    describe('with [loanding=false, error=null]', () => {
      const loadExchangeRateSpy = jest.fn();
      const dom = shallow(
        <StriimAccounts
          loading={false}
          striimAccounts={striimAccounts}
          loadStriimAccounts={loadStriimAccountsSpy}
          currentAccount={currentAccount}
          currentCurrency={currentCurrency}
          history={{ location: { pathname: currentPathname } }}
          match={{ url: subMatchUrl }}
          exchangeRates={exchangeRates}
          loadExchangeRate={loadExchangeRateSpy}
          changeCurrentAccount={() => {}}
          changeCurrentCurrency={() => {}}
        />
      );
      it('should trigger loadStriimAccounts action on mount', () => {
        expect(loadStriimAccountsSpy).toHaveBeenCalledTimes(1);
      });
      describe('componentDidUpdate', () => {
        it('should trigger loadExchangeRate action', () => {
          const newAccounts = fromJS(striimAccounts.toJS());
          dom.instance().componentDidUpdate({ striimAccounts: newAccounts });
          expect(loadExchangeRateSpy).toHaveBeenCalledTimes(striimAccounts.get(0).get('balances').count() + striimAccounts.get(1).get('balances').count());
        });
      });
      describe('render', () => {
        it('should have current pathname as the activeKey for Tabs component', () => {
          expect(dom.find(StriimTabs).props().activeKey).toEqual(currentPathname);
        });
        it('TabPane should have the key prop start with the match url', () => {
          dom.find('TabPane').forEach((elm) => {
            expect(elm.key().startsWith(subMatchUrl)).toBe(true);
          });
        });
        it('AccountInfo should have calculated options', () => {
          const options = dom.find('AccountInfo').props().options;
          expect(options.length).toEqual(striimAccounts.count());
          expect(options[0].accountName).toEqual(striimAccounts.get(0).get('name'));
          expect(options[0].amount).toEqual(1751800);
          expect(options[1].accountName).toEqual(striimAccounts.get(1).get('name'));
          expect(options[1].amount).toEqual(2002400);
        });
        it('CurrencyList should have data property assigned with the balances from current account', () => {
          const balances = dom.find('CurrencyList').props().data;
          const originalBalances = currentAccount.get('balances');
          expect(balances.length).toEqual(originalBalances.count());
          expect(balances[0].coin).toEqual(originalBalances.get(0).get('asset'));
          expect(balances[1].coin).toEqual(originalBalances.get(1).get('asset'));
          expect(balances[0].coinAmount).toEqual(originalBalances.get(0).get('active'));
          expect(balances[1].coinAmount).toEqual(originalBalances.get(1).get('active'));
          expect(balances[0].exchangeRate.price).toEqual(exchangeRates.get(`${balances[0].coin}_USD`).get('data').get('price'));
          expect(balances[1].exchangeRate.price).toEqual(exchangeRates.get(`${balances[1].coin}_USD`).get('data').get('price'));
        });
        it('CurrencyList should be initialized with current currency as active currency', () => {
          expect(dom.find('CurrencyList').props().activeCurrency).toEqual(currentCurrency.get('asset'));
        });
      });
    });

    describe('loading or error', () => {
      const params = {
        striimAccounts,
        loadStriimAccounts: loadStriimAccountsSpy,
        currentAccount,
        currentCurrency,
        history: { location: { pathname: '/striim-accounts/savings' } },
        match: { url: subMatchUrl },
        exchangeRates,
        changeCurrentAccount: () => {},
        changeCurrentCurrency: () => {},
        loadExchangeRate: () => {},
      };
      it('should render PageLoadingIndicator', () => {
        const loading = true;
        const dom = shallow(
          <StriimAccounts
            {...params}
            loading={loading}
          />
        );
        const props = dom.find('PageLoadingIndicator').props();
        expect(props.pageType).toEqual('Striim Accounts');
        expect(props.id).toEqual(uid);
      });
      it('should render LoadingError', () => {
        const loading = false;
        const error = new Error('error');
        const dom = shallow(
          <StriimAccounts
            loading={loading}
            error={error}
            {...params}
          />
        );
        const props = dom.find('LoadingError').props();
        expect(props.error).toEqual(error);
        expect(props.pageType).toEqual('Striim Accounts');
        expect(props.id).toEqual(uid);
      });
    });

    describe('dispatch actions', () => {
      const params = {
        loading: false,
        striimAccounts,
        loadStriimAccounts: loadStriimAccountsSpy,
        currentAccount,
        currentCurrency,
        match: { url: subMatchUrl },
        history: { location: { pathname: '/striim-accounts/savings' } },
        exchangeRates,
        changeCurrentAccount: () => {},
        changeCurrentCurrency: () => {},
        loadExchangeRate: () => {},
      };
      it('#onTabChange should push a new location history', () => {
        const historySpy = jest.fn();
        const dom = shallow(
          <StriimAccounts
            {...params}
            history={{ location: { pathname: '/striim-accounts/savings' }, push: historySpy }}
          />
        );
        const instance = dom.instance();
        const newPath = '/striim/topup';
        instance.onTabChange(newPath);
        expect(historySpy).toBeCalledWith(newPath);
      });

      it('#onAccountChange should trigger changeCurrentAccount action with payload', () => {
        const changeCurrentAccountSpy = jest.fn();
        const dom = shallow(
          <StriimAccounts
            {...params}
            changeCurrentAccount={changeCurrentAccountSpy}
          />
        );
        const index = 1;
        dom.find('AccountInfo').props().onSelectChange(index);
        expect(changeCurrentAccountSpy).toBeCalledWith(striimAccounts.get(index).toJS());
      });

      it('#onCurrencyChange should trigger changeCurrentCurrency action with payload', () => {
        const changeCurrentCurrencySpy = jest.fn();
        const dom = shallow(
          <StriimAccounts
            {...params}
            changeCurrentCurrency={changeCurrentCurrencySpy}
          />
        );
        const balance = currentAccount.get('balances').get(1);
        const currency = balance.get('asset');
        dom.find('CurrencyList').props().onCurrencySelect(currency);
        expect(changeCurrentCurrencySpy).toBeCalledWith(balance.toJS());
      });
    });
  });
  describe('mapDispatchProps', () => {
    it('should wrap loadStriimAccounts under dispatch', () => {
      const spy = jest.fn();
      mapDispatchToProps(spy).loadStriimAccounts();
      expect(spy).toBeCalled();
    });
    it('should wrap changeCurrentAccount under dispatch', () => {
      const spy = jest.fn();
      mapDispatchToProps(spy).changeCurrentAccount();
      expect(spy).toBeCalled();
    });
    it('should wrap changeCurrentCurrency under dispatch', () => {
      const spy = jest.fn();
      mapDispatchToProps(spy).changeCurrentCurrency();
      expect(spy).toBeCalled();
    });
    it('should wrap loadExchangeRate under dispatch', () => {
      const spy = jest.fn();
      mapDispatchToProps(spy).loadExchangeRate({ ticker: 'test', convert: 'test' });
      expect(spy).toBeCalled();
    });
  });
});
