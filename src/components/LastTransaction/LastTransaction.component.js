import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import {
  Image,
  Text,
  TextPrimary,
  TextSecondary,
  StyledRow,
  FlexWrapper,
  StyledButton,
  SpaceBetween,
  TextGrey,
  TransactionInfo,
} from './LastTransaction.style';

/**
 * This component shows details of last transaction by wallet address
 */
const LastTransaction = (props) => (
  <div>
    <StyledRow>
      <TextSecondary>Last Transfer was</TextSecondary>
    </StyledRow>
    <TransactionInfo>
      <StyledRow>
        <FlexWrapper>
          <Image src={getAbsolutePath(`public/asset_images/${props.coin}.svg`)} alt="icon" />
          <Text>{props.coinAmount}</Text>
          {'  '}
          <TextPrimary>{props.coin}</TextPrimary>
          <TextGrey>{`$${props.coinAmountUSD}`}</TextGrey>
        </FlexWrapper>
      </StyledRow>
      <StyledRow>
        <TextPrimary>Transfered to: </TextPrimary>
        <Text>{props.name}</Text>
        <TextGrey>{props.address}</TextGrey>
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
            <TextGrey>{`GMT ${props.gmt}`}</TextGrey>
          </SpaceBetween>
        </FlexWrapper>
      </StyledRow>
    </TransactionInfo>
    <StyledButton type="primary" onClick={props.handleNewTransfer}>
        Make a new Transfer
      </StyledButton>
  </div>
  );
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
  gmt: PropTypes.string,
  /**
   * Function to execute when make new transfer button is clicked
   */
  handleNewTransfer: PropTypes.func,
};
export default LastTransaction;
