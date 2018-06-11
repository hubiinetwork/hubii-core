import React from 'react';
import {
  PaymentHistoryAddress,
  Wrapper,
  DetailCollapse,
  DetailPanel,
  TextGrey,
  Amount,
  TimePast,
  PaymentHistoryType,
  CollapseLeft,
  CollapseParent,
  CollapseRight,
  ItemWrapper,
  LeftFlex,
  RightFlex
} from './PaymentHistoryDetail.style';
import PropTypes from 'prop-types';
import PaymentType from '../PaymentType';

/**
 * This component shows the collapsed area of PaymentHistoryItem.
 */
const PaymentHistoryDetail = props => {
  return (
    <DetailCollapse bordered={false}>
      <DetailPanel
        style={{ border: 0 }}
        showArrow={false}
        header={
          <Wrapper>
            <LeftFlex>
              <PaymentHistoryAddress>
                {props.data.coinAmount} {props.data.coin}
              </PaymentHistoryAddress>
              <Amount>${props.data.USDAmount} USD</Amount>
              <PaymentHistoryType>
                To:
                <PaymentHistoryAddress> {props.data.to}</PaymentHistoryAddress>
              </PaymentHistoryType>
            </LeftFlex>
            <RightFlex>
              <div style={{ marginLeft: '-1rem' }}>
                <PaymentType type="Order" />
              </div>
              <TimePast>{props.data.timePast} ago</TimePast>
            </RightFlex>
          </Wrapper>
        }
        key="1"
      >
        <CollapseParent>
          <CollapseLeft>
            <div>
              <TextGrey>To Wallet ID:</TextGrey>
              <PaymentHistoryType>{props.data.toID}</PaymentHistoryType>
            </div>
            <ItemWrapper>
              <TextGrey>TxHash:</TextGrey>
              <PaymentHistoryType>{props.data.hashID}</PaymentHistoryType>
            </ItemWrapper>
            <ItemWrapper>
              <TextGrey>Timestamp:</TextGrey>
              <PaymentHistoryType>{props.data.timeStamp}</PaymentHistoryType>
            </ItemWrapper>
            <ItemWrapper>
              <TextGrey>Block Height:</TextGrey>
              <PaymentHistoryType>
                {props.data.blockHeight} (2 block confirmations)
              </PaymentHistoryType>
            </ItemWrapper>
          </CollapseLeft>

          <CollapseRight>
            <div>
              <TextGrey>Gas Limit:</TextGrey>
              <PaymentHistoryType>{props.data.gasLimit}</PaymentHistoryType>
            </div>
            <ItemWrapper>
              <TextGrey>Gas used by Txn:</TextGrey>
              <PaymentHistoryType>{props.data.gasTxn}</PaymentHistoryType>
            </ItemWrapper>
            <ItemWrapper>
              <TextGrey>Gas Price:</TextGrey>
              <PaymentHistoryType>
                {props.data.gasPrice} {props.data.coin}
              </PaymentHistoryType>
            </ItemWrapper>
            <ItemWrapper>
              <TextGrey>Actuaal Tx Cost/Fee:</TextGrey>
              <PaymentHistoryType>{props.data.cost} ($0.02)</PaymentHistoryType>
            </ItemWrapper>
          </CollapseRight>
        </CollapseParent>
      </DetailPanel>
    </DetailCollapse>
  );
};
PaymentHistoryDetail.propTypes = {
  data: PropTypes.shape({
    coin: PropTypes.string,
    coinAmount: PropTypes.number,
    USDAmount: PropTypes.number,
    to: PropTypes.string,
    type: PropTypes.oneOf([
      'Order',
      'Payment',
      'Withdrawal',
      'Deposit',
      'Trade'
    ]),
    timePast: PropTypes.string,
    toID: PropTypes.string,
    hashID: PropTypes.string,
    timeStamp: PropTypes.string,
    blockHeight: PropTypes.string,
    gasLimit: PropTypes.number,
    gasTxn: PropTypes.number,
    gasPrice: PropTypes.number,
    cost: PropTypes.number
  }).isRequired
};

export default PaymentHistoryDetail;
