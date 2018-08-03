import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getAbsolutePath } from 'utils/electron';
import { EthNetworkProvider } from 'utils/wallet';

import {
  TypeText,
  GreenTextWrapper,
  Wrapper,
  DetailCollapse,
  DetailPanel,
  Amount,
  Left,
  TransactionStatus,
  TypeIcon,
  TransactionId,
  TransactionHistoryTime,
  FiatValue,
  DetailsWrapper,
} from './TransactionHistoryDetail.style';

import {
  Sent,
  Received,
  Image,
} from '../TransactionHistoryItem/TransactionHistoryItem.style';

import { formatFiat } from '../../utils/numberFormats';

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
            {props.type === 'exchange' && (
            <Image
              src={getAbsolutePath(`public/images/assets/${props.toCoin}.svg`)}
            />
              )}
            <TypeIcon
              type={
                  props.type === 'received'
                    ? 'download'
                    : props.type === 'sent'
                      ? 'upload'
                      : ' '
                }
            />
            <TypeText>
              {props.type === 'received' ? (
                  'Recieved from'
                ) : props.type === 'sent' ? (
                  'Sent to'
                ) : (
                  <div style={{ display: 'flex' }}>
                    Exchanged
                    <GreenTextWrapper>
                      {props.fromCoin}
                    </GreenTextWrapper>
                    to
                    <GreenTextWrapper>
                      {props.toCoin}
                    </GreenTextWrapper>
                  </div>
                )}
            </TypeText>
            <GreenTextWrapper>
              {props.address}
            </GreenTextWrapper>
          </Left>
          <DetailsWrapper>
            <Amount>
              {props.type === 'sent' ? (
                <Sent>-{props.amount}</Sent>
                ) : (
                  <Received>+{props.amount}</Received>
                )}
            </Amount>
            <FiatValue>{`(${formatFiat(props.fiatValue, 'USD')})`}</FiatValue>
            <TransactionHistoryTime>
              {moment(props.time).calendar()}
            </TransactionHistoryTime>
          </DetailsWrapper>
        </Wrapper>
        }
      key="1"
    >
      <div>
        <TransactionId
          href={
            EthNetworkProvider.name === 'ropsten' ? `https://ropsten.etherscan.io/tx/${props.txnId}` : `https://etherscan.io/tx/${props.txnId}`
          }
          target="_blank"
        >
          {props.txnId}
        </TransactionId>
        <div
          style={{ marginBottom: 5 }}
        >
          {
            props.confirmations > 0 &&
              <GreenTextWrapper>
                {`${props.confirmations} `}
              </GreenTextWrapper>
          }
          {
            props.confirmations === 0 &&
              <TransactionStatus>Transaction pending...</TransactionStatus>
          }
          {
            props.confirmations === 1 &&
              <TransactionStatus>confirmation</TransactionStatus>
          }
          {
            props.confirmations > 1 &&
              <TransactionStatus> confirmations</TransactionStatus>
          }
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
  amount: PropTypes.string.isRequired,
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
  fiatValue: PropTypes.string.isRequired,
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
  time: PropTypes.object.isRequired,
  confirmations: PropTypes.number.isRequired,
};

export default TransactionHistoryDetail;
