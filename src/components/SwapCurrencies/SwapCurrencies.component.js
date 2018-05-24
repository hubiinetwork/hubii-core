import React from 'react';
import PropTypes from 'prop-types';
import Balance from '../Balance';
import Amount from '../Amount';
import TermsAndConditions from '../TermsAndConditions';
import {
  Wrapper,
  Heading,
  ConvertionWrapper,
  Conversion,
  Left,
  Right,
  Transfer,
  Arrow,
  RightArrow,
  LeftArrow,
  Submit,
  Exchange
} from './SwapCurrencies.style';

const SwapCurrencies = props => {
  return (
    <div style={{ position: 'relative' }}>
      <Wrapper>
        <Left>
          <Heading>Exchange</Heading>
          <Balance
            coin={props.exchangeCoin}
            balance={props.exchangeBalance.toString()}
            showCoinName={props.exchangeCoin}
            info
          />
          <Amount
            amount={props.exchangeAmount}
            dollarAmount={props.exchangeAmountInDollar}
            coin={props.exchangeCoin}
          />
        </Left>
        <Right>
          <div>
            <Heading>Receive</Heading>
            <Balance
              coin={props.receiveCoin}
              balance={props.receiveBalance.toString()}
              caret
              showCoinName={props.receiveCoin}
              info
            />
            <Amount
              amount={props.receiveAmount}
              dollarAmount={props.receiveAmountInDollar}
              coin={props.receiveCoin}
            />
          </div>
        </Right>
      </Wrapper>
      <ConvertionWrapper>
        <Conversion>
          1 {props.exchangeCoin} = {props.oneExchangeInReceive}{' '}
          {props.receiveCoin}
        </Conversion>
        <Transfer>
          <RightArrow>
            <Arrow type="arrow-right" info="true" />
          </RightArrow>
          <LeftArrow>
            <Arrow type="arrow-left" />
          </LeftArrow>
        </Transfer>
      </ConvertionWrapper>
      <Submit>
        <Exchange type="primary">Exchange</Exchange>
        <TermsAndConditions />
      </Submit>
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
