import React from 'react';
import {
  TransactionHistoryType,
  TransactionHistoryAddress,
  Wrapper,
  DetailCollapse,
  DetailPanel,
  HashText,
  TransactionHistoryAddressLink
} from './TransactionHistoryDetail.style';
import PropTypes from 'prop-types';

/**
 * This component  shows  the collapsed  area of TransactionHistoryItem.
 */
const TransactionHistoryDetail = props => {
  return (
    <Wrapper>
      <TransactionHistoryType>
        {props.type === 'received'
          ? 'Recieved from'
          : props.type === 'sent'
            ? 'Sent to'
            : 'Exchanged'}
      </TransactionHistoryType>
      <DetailCollapse bordered={false}>
        <DetailPanel
          style={{ border: 0 }}
          showArrow={false}
          header={
            <TransactionHistoryAddress>
              {props.address}
            </TransactionHistoryAddress>
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
            <HashText>${props.usd * props.amount}</HashText>
          </div>
        </DetailPanel>
      </DetailCollapse>
    </Wrapper>
  );
};
TransactionHistoryDetail.propTypes = {
  /**
   * address for transactionHistory.
   */
  address: PropTypes.string.isRequired,
  /**
   * amount for transactionHistory.
   */
  amount: PropTypes.node.isRequired,
  /**
   * hashID to see live transactionHistory.
   */
  hashId: PropTypes.string.isRequired,
  /**
   * type of transactionHistory.
   */
  type: PropTypes.oneOf(['received', 'sent', 'exchanged']).isRequired,
  /**
   * USD price of ETH coin.
   */
  usd: PropTypes.node.isRequired
};

export default TransactionHistoryDetail;
