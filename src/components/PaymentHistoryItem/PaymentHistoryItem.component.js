import React from 'react';
import {
  TransactionHistoryItemCard,
  TransactionHistoryItemDate,
  TransactionHistoryTime,
  TransactionHistoryConversion,
  Wrapper,
  Image,
  SpaceAround,
  Received,
  Sent
} from './PaymentHistoryItem.style';
import PropTypes from 'prop-types';
import PaymentHistoryDetail from '../PaymentHistoryDetail';
/**
 * This component shows history of a past transaction's detail.
 */
export const PaymentHistoryItem = props => {
  const type = !props.data.address
    ? 'exchange'
    : props.data.address === props.data.to
      ? 'received'
      : 'sent';
  return (
    <Wrapper>
      <TransactionHistoryItemDate>{props.data.date}</TransactionHistoryItemDate>
      <TransactionHistoryItemCard>
        <Image
          src={`../../../public/asset_images/${
            type === 'exchange' ? props.data.fromCoin : props.data.coin
          }.svg`}
        />

        <Image
          src={`../../../public/asset_images/${props.data.toCoin}.svg`}
          style={{
            display: type === 'received' || type === 'sent' ? 'none' : 'block'
          }}
        />
        <PaymentHistoryDetail
          type={type}
          address={type === 'received' ? props.data.from : props.data.to}
          hashId={props.data.hashId}
          amount={props.data.amount}
          usd={props.price}
          toCoin={props.data.toCoin}
          fromCoin={props.data.fromCoin}
          status={props.data.status}
        />
        <SpaceAround>
          <TransactionHistoryTime>{props.data.time}</TransactionHistoryTime>
          <TransactionHistoryConversion>
            {type === 'sent' ? (
              <Sent>-{props.data.amount}</Sent>
            ) : (
              <Received>+{props.data.amount}</Received>
            )}
          </TransactionHistoryConversion>
        </SpaceAround>
      </TransactionHistoryItemCard>
    </Wrapper>
  );
};
PaymentHistoryItem.propTypes = {
  /**
   * prop  of data of TransactionHistoryItem.
   */
  data: PropTypes.shape({
    date: PropTypes.string.isRequired,
    /**
     * Do not  pass address if you want to show exchange state of the component.
     */
    address: PropTypes.string,
    time: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    hashId: PropTypes.string,
    to: PropTypes.string,
    from: PropTypes.string,
    toCoin: PropTypes.string,
    fromCoin: PropTypes.string,
    coin: PropTypes.string,
    status: PropTypes.number
  }).isRequired,
  /**
   * price of 1ETH in dollars.
   */
  price: PropTypes.number.isRequired
};
