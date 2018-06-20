import _ from 'lodash';
import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingError from 'components/LoadingError';
import PageLoadingIndicator from 'components/PageLoadingIndicator';
import AccountInfo from 'components/AccountInfo';
import CurrencyList from 'components/CurrencyList';
import StriimTabs, { TabPane } from 'components/ui/StriimTabs';
import SwapCurrenciesContainer from 'containers/SwapCurrencies';
import { AccountInfoWrapper, MainWrapper, Wrapper } from './StriimAccounts.style';
import reducer from './reducer';
import saga from './saga';


import {
  makeSelectLoading,
  makeSelectError,
  makeSelectAccounts,
  makeSelectCurrentAccount,
  makeSelectCurrentCurrency,
} from './selectors';
import { makeSelectExchangeRates } from '../ExchangeRateHOC/selectors';
import { loadStriimAccounts, changeCurrentAccount, changeCurrentCurrency } from './actions';
import { loadExchangeRate } from '../ExchangeRateHOC/actions';

export class StriimAccounts extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.onTabChange = this.onTabChange.bind(this);
    this.onAccountChange = this.onAccountChange.bind(this);
    this.onChangeCurrentCurrency = this.onChangeCurrentCurrency.bind(this);
  }

  componentDidMount() {
    this.props.loadStriimAccounts();
  }

  componentDidUpdate(prevProps) {
    const { striimAccounts } = this.props;

    if (prevProps.striimAccounts !== this.props.striimAccounts) {
      const accounts = striimAccounts.toJS();
      accounts.forEach((account) => {
        account.balances.forEach((balance) => {
          this.props.loadExchangeRate({ ticker: balance.asset, convert: 'USD' });
        });
      });
    }
  }

  onTabChange(key) {
    this.props.history.push(key);
  }

  onAccountChange(index) {
    const { striimAccounts } = this.props;
    this.props.changeCurrentAccount(striimAccounts.get(index).toJS());
  }

  onChangeCurrentCurrency(currency) {
    const { currentAccount } = this.props;
    const balance = currentAccount.toJS().balances.filter((_balance) => _balance.asset === currency)[0];
    this.props.changeCurrentCurrency(balance);
  }

  render() {
    const {
      match,
      history,
      striimAccounts,
      currentAccount,
      currentCurrency,
      exchangeRates,
      loading,
      error,
    } = this.props;

    const rates = exchangeRates.toJS();
    const uid = '2';

    if (error) {
      return <LoadingError pageType="Striim Accounts" error={error} id={uid} />;
    }

    if (loading) {
      return <PageLoadingIndicator pageType="Striim Accounts" id={uid} />;
    }

    const options = striimAccounts.toJS().map((account) => {
      const totalUSDValue = account.balances.reduce((accumulator, current) => accumulator + (current.active * _.get(rates, `${current.asset}_USD.data.price`)) || NaN, 0);
      return {
        accountName: account.name,
        amount: totalUSDValue,
        handleIconClick: () => {},
      };
    });

    const currencies = currentAccount.toJS().balances.map((balance) => {
      const exchangeRate = {
        loading: _.get(rates, `${balance.asset}_USD.loading`),
        error: _.get(rates, `${balance.asset}_USD.error`),
        price: _.get(rates, `${balance.asset}_USD.data.price`),
      };
      return {
        coin: balance.asset,
        coinAmount: balance.active,
        exchangeRate,
      };
    });
    return (
      <Wrapper>
        <AccountInfoWrapper>
          <AccountInfo
            options={options}
            onSelectChange={this.onAccountChange}
          />
          <CurrencyList
            data={currencies}
            activeCurrency={currentCurrency.get('asset')}
            onCurrencySelect={this.onChangeCurrentCurrency}
          />
        </AccountInfoWrapper>
        <MainWrapper>
          <StriimTabs activeKey={history.location.pathname} onChange={this.onTabChange}>
            <TabPane tab="Payments" key={match.url} style={{ color: 'white' }}>
              Content of Tab Pane 1
              {/* <Route path={match.url} component={PageLoadingIndicator} /> */}
            </TabPane>
            <TabPane tab="Topup" key={`${match.url}/topup`} style={{ color: 'white' }}>
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Withdrawal" key={`${match.url}/withdrawal`} style={{ color: 'white' }}>
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="Swap Currencies" key={`${match.url}/swap`} style={{ color: 'white' }}>
              <Route path={`${match.url}/swap`} component={SwapCurrenciesContainer} />
            </TabPane>
            <TabPane tab="Savings Account" key={`${match.url}/savings`} style={{ color: 'white' }}>
              Content of Tab Pane 5
            </TabPane>
            <TabPane tab="Advanced" key={`${match.url}/advanced`} style={{ color: 'white' }}>
              Content of Tab Pane 6
            </TabPane>
          </StriimTabs>
        </MainWrapper>
      </Wrapper>
    );
  }
}

StriimAccounts.propTypes = {
  loadStriimAccounts: PropTypes.func.isRequired,
  loadExchangeRate: PropTypes.func.isRequired,
  changeCurrentAccount: PropTypes.func.isRequired,
  changeCurrentCurrency: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  exchangeRates: PropTypes.object.isRequired,
  striimAccounts: PropTypes.object.isRequired,
  currentAccount: PropTypes.object.isRequired,
  currentCurrency: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  striimAccounts: makeSelectAccounts(),
  currentAccount: makeSelectCurrentAccount(),
  currentCurrency: makeSelectCurrentCurrency(),
  exchangeRates: makeSelectExchangeRates(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadStriimAccounts: () => dispatch(loadStriimAccounts()),
    changeCurrentAccount: (account) => dispatch(changeCurrentAccount(account)),
    changeCurrentCurrency: (currency) => dispatch(changeCurrentCurrency(currency)),
    loadExchangeRate: ({ ticker, convert }) => dispatch(loadExchangeRate({ ticker, convert })),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'striimAccounts', reducer });
const withSaga = injectSaga({ key: 'striimAccounts', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(StriimAccounts);
