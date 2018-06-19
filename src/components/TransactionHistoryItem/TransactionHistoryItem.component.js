import React from 'react';
import PropTypes from 'prop-types';
import {
  TransactionHistoryItemCard,
  TransactionHistoryItemDate,
  Wrapper,
  Image,
} from './TransactionHistoryItem.style';
import TransactionHistoryDetail from '../TransactionHistoryDetail';
/**
 * This component shows history of a past transaction's detail.
 */
export const TransactionHistoryItem = (props) => {
  const { data, rate } = props;
  const type = !data.address
    ? 'exchange'
    : data.address === data.to
      ? 'received'
      : 'sent';
  const getMonth = data.time.getMonth();
  const month =
    getMonth === 0
      ? 'jan'
      : getMonth === 1
        ? 'feb'
        : getMonth === 2
          ? 'mar'
          : getMonth === 3
            ? 'apr'
            : getMonth === 4
              ? 'may'
              : getMonth === 5
                ? 'jun'
                : getMonth === 6
                  ? 'jul'
                  : getMonth === 7
                    ? 'aug'
                    : getMonth === 8
                      ? 'sep'
                      : getMonth === 9
                        ? 'oct'
                        : getMonth === 10
                          ? 'nov'
                          : 'dec';
  return (
    <Wrapper>
      <TransactionHistoryItemDate>
        {month} {data.time.getDate()}
      </TransactionHistoryItemDate>
      <TransactionHistoryItemCard>
        <Image
          src={`../../../public/asset_images/${
            type === 'exchange' ? data.fromCoin : data.coin
          }.svg`}
        />
        <TransactionHistoryDetail
          type={type}
          address={type === 'received' ? data.from : data.to}
          txnId={data.txnId}
          amount={data.amount}
          rate={rate}
          toCoin={data.toCoin}
          fromCoin={data.fromCoin}
          status={data.status}
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
    amount: PropTypes.number.isRequired,
    txnId: PropTypes.string,
    to: PropTypes.string,
    from: PropTypes.string,
    toCoin: PropTypes.string,
    fromCoin: PropTypes.string,
    coin: PropTypes.string,
    status: PropTypes.number,
  }).isRequired,
  /**
   * rate of 1ETH or any other currency, in dollars.
   */
  rate: PropTypes.number.isRequired,
};
