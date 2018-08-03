import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { IsAddressMatch } from 'utils/wallet';
import {
  TransactionHistoryItemCard,
  Wrapper,
  Image,
} from './TransactionHistoryItem.style';
import TransactionHistoryDetail from '../TransactionHistoryDetail';
/**
 * This component shows history of a past transaction's detail.
 */
export const TransactionHistoryItem = (props) => {
  const { data } = props;
  const type = !data.address
    ? 'exchange'
    : IsAddressMatch(data.address, data.to)
      ? 'received'
      : 'sent';
  return (
    <Wrapper>
      <TransactionHistoryItemCard>
        <Image
          src={getAbsolutePath(`public/images/assets/${
            type === 'exchange' ? data.fromCoin : data.coin
          }.svg`)}
        />
        <TransactionHistoryDetail
          type={type}
          address={type === 'received' ? data.from : data.to}
          txnId={data.txnId}
          amount={data.amount}
          fiatValue={data.fiatValue}
          toCoin={data.toCoin}
          fromCoin={data.fromCoin}
          confirmations={data.confirmations}
          time={data.time}
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
    /**
     * Do not  pass address if you want to show exchange state of the component.
     * 'address' prop is used to pass the address of the walletHolder where 'to' and 'from' props are used to check  whether the transaction was a receving or a sending one.
     */
    address: PropTypes.string,
    time: PropTypes.object.isRequired,
    amount: PropTypes.string.isRequired,
    txnId: PropTypes.string,
    to: PropTypes.string,
    from: PropTypes.string,
    toCoin: PropTypes.string,
    fromCoin: PropTypes.string,
    fiatValue: PropTypes.string.isRequired,
    coin: PropTypes.string,
    status: PropTypes.bool,
  }).isRequired,
  /**
   * rate of 1ETH or any other currency, in dollars.
   */
};
