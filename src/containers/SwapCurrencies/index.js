import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import SwapCurrencies from 'components/SwapCurrencies';

import { makeSelectCurrentCurrency } from 'containers/StriimAccounts/selectors';

export class SwapCurrenciesContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { currentCurrency } = this.props;
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
  currentCurrency: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentCurrency: makeSelectCurrentCurrency(),
});

const withConnect = connect(mapStateToProps, null);

export default compose(
  withConnect,
)(SwapCurrenciesContainer);
