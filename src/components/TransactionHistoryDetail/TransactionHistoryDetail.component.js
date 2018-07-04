import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  TransactionHistoryType,
  TransactionHistoryAddress,
  Wrapper,
  DetailCollapse,
  DetailPanel,
  TransactionHistoryAddressLink,
  TransactionHistoryItemCardIcon,
  Amount,
  Left,
  TransactionStatus,
} from './TransactionHistoryDetail.style';
import {
  SpaceAround,
  TransactionHistoryTime,
  TransactionHistoryConversion,
  Sent,
  Received,
  Image,
} from '../TransactionHistoryItem/TransactionHistoryItem.style';

/**
 * This component  shows  the collapsed  area of TransactionHistoryItem.
 */
const TransactionHistoryDetail = (props) => (
  <DetailCollapse bordered={false}>
    <DetailPanel
      style={{ border: 0 }}
      showArrow={false}
      header={
        <Wrapper>
          <Left>
            {!(props.type === 'received' || props.type === 'sent') && (
            <Image
              src={`../../../public/asset_images/${props.toCoin}.svg`}
            />
              )}
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
            <TransactionHistoryTime>
              {moment(props.time).format('h:mm a')}
            </TransactionHistoryTime>
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
          href={`https://etherscan.io/tx/${props.txnId}`}
          target="_blank"
        >
          {props.txnId}
        </TransactionHistoryAddressLink>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
        >
          <TransactionHistoryAddress>
            {props.amount}
          </TransactionHistoryAddress>
          <TransactionStatus>{props.status ? 'Confirmed' : 'Pending'}</TransactionStatus>
          <Amount>${props.rate * props.amount}</Amount>
        </div>
      </div>
    </DetailPanel>
  </DetailCollapse>
  );
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
  type: PropTypes.oneOf(['received', 'sent', 'exchange']).isRequired,
  /**
   * USD price of ETH coin.
   */
  rate: PropTypes.number.isRequired,
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
  time: PropTypes.object,
  status: PropTypes.bool,
};

export default TransactionHistoryDetail;
