import React from 'react';
import PropTypes from 'prop-types';
import {
  AlignCenter,
  AmountWrapper,
  Coin,
  Title,
  DollarAmount,
  Wrapper,
} from './Amount.style';

const Amount = (props) => (
  <Wrapper>
    <Title>Amount</Title>
    <AlignCenter>
      <AmountWrapper>{props.amount}</AmountWrapper>
      <Coin>{props.coin}</Coin>
    </AlignCenter>
    <DollarAmount>${props.dollarAmount}</DollarAmount>
  </Wrapper>
  );

Amount.propTypes = {
  /**
   * Name of the coin to be exchanged.
   */
  amount: PropTypes.number,
  /**
   * Name of the receiving coin.
   */
  coin: PropTypes.string,
  /**
   * Balance of exchange coin.
   */
  dollarAmount: PropTypes.number,
};

export default Amount;
