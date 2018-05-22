import React from 'react';
import {
  TransactionHistoryItemCard,
  TransactionHistoryItemDate,
  Wrapper,
  Image
} from './TransactionHistoryItem.style';
import PropTypes from 'prop-types';
import TransactionHistoryDetail from '../TransactionHistoryDetail';
/**
 * This component shows history of a past transaction's detail.
 */
export const TransactionHistoryItem = props => {
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
        <TransactionHistoryDetail
          type={type}
          address={type === 'received' ? props.data.from : props.data.to}
          txnId={props.data.txnId}
          amount={props.data.amount}
          usd={props.price}
          toCoin={props.data.toCoin}
          fromCoin={props.data.fromCoin}
          status={props.data.status}
          time={props.data.time}
        />
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
    /**
     * Do not  pass address if you want to show exchange state of the component.
     * 'address' prop is used to pass the address of the walletHolder where 'to' and 'from' props are used to check  whether the transaction was a receving or a sending one.
     */
    address: PropTypes.string,
    time: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    txnId: PropTypes.string,
    to: PropTypes.string,
    from: PropTypes.string,
    toCoin: PropTypes.string,
    fromCoin: PropTypes.string,
    coin: PropTypes.string,
    status: PropTypes.number
  }).isRequired,
  /**
   * price of 1ETH or any other currency, in dollars.
   */
  price: PropTypes.number.isRequired
};
