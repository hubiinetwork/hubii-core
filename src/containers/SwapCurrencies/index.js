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
import SwapCurrencies from 'components/SwapCurrencies';
import reducer from './reducer';
import saga from './saga';


import { makeSelectCurrentAccount, makeSelectCurrentCurrency } from 'containers/StriimAccounts/selectors';
import { loadDepositInfo } from './actions';

export class SwapCurrenciesContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { currentCurrency, currentAccount } = this.props;
    return (
      <SwapCurrencies
        exchangeCoin={currentCurrency.toJS().asset}
        receiveCoin="ETH"
        exchangeBalance={currentCurrency.toJS().active}
        receiveBalance={1.5264}
        exchangeAmount={450}
        receiveAmount={0.4564}
        exchangeAmountInDollar={300.59}
        receiveAmountInDollar={298.456}
        oneExchangeInReceive={0.0001987231}
      />
    );
  }
}

SwapCurrenciesContainer.propTypes = {
  // loadDepositInfo: PropTypes.func.isRequired,
  // loading: PropTypes.bool.isRequired,
  // error: PropTypes.object,
  // pathnameId: PropTypes.string,
  // depositInfo: PropTypes.object.isRequired,
  currentAccount: PropTypes.object.isRequired,
  currentCurrency: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
  currentAccount: makeSelectCurrentAccount(),
  currentCurrency: makeSelectCurrentCurrency(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadDepositInfo: () => dispatch(loadDepositInfo()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'depositPage', reducer });
const withSaga = injectSaga({ key: 'depositPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SwapCurrenciesContainer);
