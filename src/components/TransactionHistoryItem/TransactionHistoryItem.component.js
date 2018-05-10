import React from 'react';
import {
  TransactionHistoryItemCard,
  TransactionHistoryItemCardIcon,
  TransactionHistoryItemDate,
  TransactionHistoryTime,
  TransactionHistoryConversion,
  Wrapper
} from './TransactionHistoryItem.style';
import PropTypes from 'prop-types';
import TransactionHistoryDetail from '../TransactionHistoryDetail';
/**
 * This component shows  history of a past transaction detail.
 */
export const TransactionHistoryItem = props => {
  const type = props.data.address === props.data.to ? 'received' : 'sent';
  return (
    <Wrapper>
      <TransactionHistoryItemDate>{props.data.date}</TransactionHistoryItemDate>
      <TransactionHistoryItemCard>
        <img src="../../../public/asset_images/ETH.svg" />
        <TransactionHistoryItemCardIcon
          type={
            type === 'received' ? 'download' : type === 'sent' ? 'upload' : ' '
          }
        />
        <img
          src="/static/Images/ETH.svg"
          style={{
            display: type === 'received' || type === 'sent' ? 'none' : 'block'
          }}
        />

        <TransactionHistoryDetail
          type={type}
          address={type === 'received' ? props.data.from : props.data.to}
          hashId={props.data.hashId}
          amount={props.data.amount}
          usd={props.price}
        />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <TransactionHistoryTime>{props.data.time}</TransactionHistoryTime>
          <TransactionHistoryConversion>
            {type !== 'received' ? '-' : '+'}
            {props.data.amount}
          </TransactionHistoryConversion>
        </div>
      </TransactionHistoryItemCard>
    </Wrapper>
  );
};
TransactionHistoryItem.propTypes = {
  /**
   * prop  of data of TransactionHistoryItem.
   */
  data: PropTypes.shape({
    date: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    amount: PropTypes.node.isRequired,
    hashId: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired
  }).isRequired,
  /**
   * price of 1ETH in dollars.
   */
  price: PropTypes.node.isRequired
};
