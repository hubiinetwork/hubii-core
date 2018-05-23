import React from 'react';
import PropTypes from 'prop-types';
import {
  AlignCenter,
  AmountWrapper,
  Coin,
  Amount as AmountHeading,
  Wrapper
} from './Amount.style';

const Amount = props => {
  return (
    <Wrapper>
      <AmountHeading>Amount</AmountHeading>
      <AlignCenter>
        <AmountWrapper>{props.amount}</AmountWrapper>
        <Coin>{props.coin}</Coin>
      </AlignCenter>
      <AmountHeading>${props.dollarAmount}</AmountHeading>
    </Wrapper>
  );
};

Amount.propTypes = {
  /**
   * Name of the coin to be exchange.
   */
  amount: PropTypes.nmber,
  /**
   * Name of the receiving coin.
   */
  coin: PropTypes.string,
  /**
   * Balance of exchange coin.
   */
  dollarAmount: PropTypes.number
};

export default Amount;
