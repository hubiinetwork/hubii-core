import React from 'react';
import {
  TransactionHistoryType,
  TransactionHistoryAddress,
  Wrapper,
  DetailCollapse,
  DetailPanel,
  HashText,
  TransactionHistoryAddressLink,
  TransactionHistoryItemCardIcon,
  Amount,
  Left,
  TransactionStatus
} from './TransactionHistoryDetail.style';
import {
  SpaceAround,
  TransactionHistoryTime,
  TransactionHistoryConversion,
  Sent,
  Received
} from '../TransactionHistoryItem/TransactionHistoryItem.style';
import PropTypes from 'prop-types';

/**
 * This component  shows  the collapsed  area of TransactionHistoryItem.
 */
const TransactionHistoryDetail = props => {
  return (
    <DetailCollapse bordered={false}>
      <DetailPanel
        style={{ border: 0 }}
        showArrow={false}
        header={
          <Wrapper>
            <Left>
              <TransactionHistoryItemCardIcon
                type={
                  props.type === 'received'
                    ? 'download'
                    : props.type === 'sent'
                      ? 'upload'
                      : ' '
                }
              />
              <TransactionHistoryType>
                {props.type === 'received' ? (
                  'Recieved from'
                ) : props.type === 'sent' ? (
                  'Sent to'
                ) : (
                  <div style={{ display: 'flex' }}>
                    Exchanged
                    <TransactionHistoryAddress>
                      {props.fromCoin}
                    </TransactionHistoryAddress>
                    to
                    <TransactionHistoryAddress>
                      {props.toCoin}
                    </TransactionHistoryAddress>
                  </div>
                )}
              </TransactionHistoryType>
              <TransactionHistoryAddress>
                {props.address}
              </TransactionHistoryAddress>
            </Left>
            <SpaceAround>
              <TransactionHistoryTime>{props.time}</TransactionHistoryTime>
              <TransactionHistoryConversion>
                {props.type === 'sent' ? (
                  <Sent>-{props.amount}</Sent>
                ) : (
                  <Received>+{props.amount}</Received>
                )}
              </TransactionHistoryConversion>
            </SpaceAround>
          </Wrapper>
        }
        key="1"
      >
        <div>
          <TransactionHistoryAddressLink
            href={'https://etherscan.io/tx/' + props.txnId}
            target="_blank"
          >
            {props.txnId}
          </TransactionHistoryAddressLink>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TransactionHistoryAddress>
              {props.amount}
            </TransactionHistoryAddress>
            <TransactionStatus>Status Network</TransactionStatus>
            <Amount>${props.usd * props.amount}</Amount>
          </div>
        </div>
      </DetailPanel>
    </DetailCollapse>
  );
};
TransactionHistoryDetail.propTypes = {
  /**
   * address for transactionHistory.
   */
  address: PropTypes.string,
  /**
   * amount for transactionHistory.
   */
  amount: PropTypes.number.isRequired,
  /**
   * txnId to see live transactionHistory.
   */
  txnId: PropTypes.string,
  /**
   * type of transactionHistory.
   */
  type: PropTypes.oneOf(['received', 'sent', 'exchanged']).isRequired,
  /**
   * USD price of ETH coin.
   */
  usd: PropTypes.number.isRequired,
  /**
   * Short capitalized name of coin that was exchanged to.
   */
  toCoin: PropTypes.string,
  /**
   * Short capitalized name of coin that was exchanged from.
   */
  fromCoin: PropTypes.string,
  /**
   * status code of the transaction.
   */
  status: PropTypes.number,
  /**
   * status code of the transaction.
   */
  time: PropTypes.string
};

export default TransactionHistoryDetail;
