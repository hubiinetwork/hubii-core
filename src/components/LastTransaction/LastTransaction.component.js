import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  TextPrimary,
  TextSecondary,
  StyledRow,
  FlexWrapper,
  StyledButton,
  SpaceBetween
} from './LastTransaction.style';

/**
 * This component shows details of last transaction by wallet address
 */
const LastTransaction = props => {
  return (
    <div>
      <StyledRow>
        <TextSecondary>Last Transfer was</TextSecondary>
      </StyledRow>
      <StyledRow>
        <FlexWrapper>
          <Image src={`/public/asset_images/${props.coin}.svg`} alt="icon" />
          <Text>{props.coinAmount}</Text>
          {'  '}
          <TextPrimary>{props.coin}</TextPrimary>
          <TextSecondary>{`$${props.coinAmountUSD}`}</TextSecondary>
        </FlexWrapper>
      </StyledRow>
      <StyledRow>
        <TextPrimary>Transfered to: </TextPrimary>
        <Text>{props.name}</Text>
        <TextSecondary>{props.address}</TextSecondary>
      </StyledRow>
      <StyledRow>
        <TextPrimary>Date:</TextPrimary>
        <Text>{props.date}</Text>
      </StyledRow>
      <StyledRow>
        <TextPrimary>Time:</TextPrimary>
        <FlexWrapper>
          <Text>{props.time}</Text>
          <SpaceBetween>
            <TextSecondary>{`GMT ${props.gmt}`}</TextSecondary>
          </SpaceBetween>
        </FlexWrapper>
      </StyledRow>
      <StyledButton type="primary">Make a new Transfer</StyledButton>
    </div>
  );
};
LastTransaction.propTypes = {
  /**
   * Coin used in last transaction e.g ICX
   */
  coin: PropTypes.string,
  /**
   * Coin amount traded
   */
  coinAmount: PropTypes.number,
  /**
   * Coin amount in USD
   */
  coinAmountUSD: PropTypes.number,
  /**
   * Name of last transfer recipent
   */
  name: PropTypes.string,
  /**
   * Wallet address of last Transaction
   */
  address: PropTypes.string,
  /**
   * Date of transaction
   */
  date: PropTypes.string,
  /**
   * Time of last transaction
   */
  time: PropTypes.string,
  /**
   * gmt of last transaction
   */
  gmt: PropTypes.string
};
export default LastTransaction;
