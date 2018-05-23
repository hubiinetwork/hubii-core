import React from 'react';
import PropTypes from 'prop-types';

const SwapCurrencies = props => {
  return null;
};

SwapCurrencies.propTypes = {
  /**
   * Name of the coin to be exchange.
   */
  exchangeCoin: PropTypes.string,
  /**
   * Name of the receiving coin.
   */
  receiveCoin: PropTypes.string,
  /**
   * Balance of exchange coin.
   */
  exchangeBalance: PropTypes.number,
  /**
   * Balance of receive coin.
   */
  receiveBalance: PropTypes.number,
  /**
   * Amount of exchange coin.
   */
  exchangeAmount: PropTypes.number,
  /**
   * Amount of receive coin.
   */
  receiveAmount: PropTypes.number,
  /**
   * Exchange amount price in dollar.
   */
  exchangeAmountInDollar: PropTypes.number,
  /**
   * Receive amount price in dollar.
   */
  receiveAmountInDollar: PropTypes.number,
  /**
   * Price of one Exchange coin into Receive coin.
   */
  oneExchangeInReceive: PropTypes.number
};
