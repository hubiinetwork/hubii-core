import React from 'react';
import PropTypes from 'prop-types';
import Balance from '../Balance';
import Amount from '../Amount';
import { Heading } from './SwapCurrencies.style';

const SwapCurrencies = props => {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid grey', flex: 1 }}>
      <div style={{ borderRight: '1px solid grey', flex: 1 }}>
        <Heading>Exchange</Heading>
        <Balance title="Available Balance" coin="HBT" balance={12121} />
        <Amount amount={450} dollarAmount={309.45} coin="HBT" />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div>
          <Heading>Receive</Heading>
          <Balance title="Available Balance" coin="HBT" balance={12121} />
          <Amount amount={450} dollarAmount={309.45} coin="ETH" />
        </div>
      </div>
    </div>
  );
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

export default SwapCurrencies;
