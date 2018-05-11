import React from 'react';
import {
  TransactionHistoryItemCard,
  TransactionHistoryItemCardIcon,
  TransactionHistoryItemDate,
  TransactionHistoryTime,
  TransactionHistoryConversion,
  Wrapper,
  Image,
  SpaceAround
} from './TransactionHistoryItem.style';
import {
  TransactionHistoryType,
  TransactionHistoryAddress,
  Wrapper as Wrapperr,
  DetailCollapse,
  DetailPanel,
  HashText,
  TransactionHistoryAddressLink,
  TextWhiteBold
} from '../TransactionHistoryDetail/TransactionHistoryDetail.style';
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
        <DetailCollapse bordered={false}>
          <DetailPanel
            style={{ border: 0 }}
            showArrow={false}
            header={
              <Wrapperr>
                <TransactionHistoryItemCardIcon
                  type={
                    type === 'received'
                      ? 'download'
                      : type === 'sent'
                        ? 'upload'
                        : ' '
                  }
                />
                <TransactionHistoryType>
                  {type === 'received' ? (
                    'Recieved from'
                  ) : type === 'sent' ? (
                    'Sent to'
                  ) : (
                    <div style={{ display: 'flex' }}>
                      Exchanged
                      <TransactionHistoryAddress>
                        {props.data.fromCoin}
                      </TransactionHistoryAddress>
                      to
                      <TransactionHistoryAddress>
                        {props.data.toCoin}
                      </TransactionHistoryAddress>
                    </div>
                  )}
                </TransactionHistoryType>
                <TransactionHistoryAddress>
                  {props.data.address}
                </TransactionHistoryAddress>
              </Wrapperr>
            }
            key="1"
          >
            <div>
              <div style={{ display: 'flex' }}>
                <HashText>Transaction Hash:</HashText>
                <TransactionHistoryAddressLink
                  href={'https://etherscan.io/tx/' + props.data.hashId}
                  target="_blank"
                >
                  {props.data.hashId}
                </TransactionHistoryAddressLink>
              </div>
              <div style={{ display: 'flex' }}>
                <TransactionHistoryAddress>
                  {props.data.status}
                </TransactionHistoryAddress>
                <TransactionHistoryType>Status Network</TransactionHistoryType>
                <HashText>${props.price * props.data.amount}</HashText>
              </div>
            </div>
          </DetailPanel>
        </DetailCollapse>
        {/* <TransactionHistoryDetail
          type={type}
          address={type === 'received' ? props.data.from : props.data.to}
          hashId={props.data.hashId}
          amount={props.data.amount}
          usd={props.price}
          toCoin={props.data.toCoin}
          fromCoin={props.data.fromCoin}
          status={props.data.status}
        /> */}
        <SpaceAround>
          <TransactionHistoryTime>{props.data.time}</TransactionHistoryTime>
          <TransactionHistoryConversion>
            {type === 'sent' ? '-' : '+'}
            {props.data.amount}
          </TransactionHistoryConversion>
        </SpaceAround>
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
