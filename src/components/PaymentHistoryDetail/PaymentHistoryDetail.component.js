import React from 'react';
import {
  TransactionHistoryType,
  TransactionHistoryAddress,
  Wrapper as Wrapperr,
  DetailCollapse,
  DetailPanel,
  HashText,
  TransactionHistoryAddressLink,
  TransactionHistoryItemCardIcon,
  Amount
} from './PaymentHistoryDetail.style';
import PropTypes from 'prop-types';

/**
 * This component  shows  the collapsed  area of TransactionHistoryItem.
 */
const PaymentHistoryDetail = props => {
  return (
    <DetailCollapse bordered={false}>
      <DetailPanel
        style={{ border: 0 }}
        showArrow={false}
        header={
          <Wrapperr>
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
          </Wrapperr>
        }
        key="1"
      >
        <div>
          <div style={{ display: 'flex' }}>
            <HashText>Transaction Hash:</HashText>
            <TransactionHistoryAddressLink
              href={'https://etherscan.io/tx/' + props.hashId}
              target="_blank"
            >
              {props.hashId}
            </TransactionHistoryAddressLink>
          </div>
          <div style={{ display: 'flex' }}>
            <TransactionHistoryAddress>
              {props.status}
            </TransactionHistoryAddress>
            <TransactionHistoryType>Status Network</TransactionHistoryType>
            <Amount>${props.usd * props.amount}</Amount>
          </div>
        </div>
      </DetailPanel>
    </DetailCollapse>
  );
};
PaymentHistoryDetail.propTypes = {
  /**
   * address for transactionHistory.
   */
  address: PropTypes.string,
  /**
   * amount for transactionHistory.
   */
  amount: PropTypes.number.isRequired,
  /**
   * hashID to see live transactionHistory.
   */
  hashId: PropTypes.string,
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
  status: PropTypes.number
};

export default PaymentHistoryDetail;
