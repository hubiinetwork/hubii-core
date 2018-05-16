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
  CollapseRight
} from './PaymentHistoryDetail.style';
import PropTypes from 'prop-types';
import PaymentType from '../PaymentType';

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
          <Wrapper>
            <PaymentHistoryAddress>
              {props.data.coinAmount} {props.data.coin}
            </PaymentHistoryAddress>
            <Amount>${props.data.USDAmount} USD</Amount>
            <PaymentHistoryType>
              To:
              <PaymentHistoryAddress> {props.data.to}</PaymentHistoryAddress>
            </PaymentHistoryType>
            <PaymentType type="Order" />
            <TimePast>{props.data.timePast} ago</TimePast>
          </Wrapper>
        }
        key="1"
      >
        <CollapseParent>
          <CollapseLeft>
            <div>
              <TextGrey>To Wallet ID:</TextGrey>
              <PaymentHistoryType>{props.data.toID}</PaymentHistoryType>
              <br />
            </div>
            <div>
              <TextGrey>TxHash:</TextGrey>
              <PaymentHistoryType>{props.data.hashID}</PaymentHistoryType>
              <br />
            </div>
            <div>
              <TextGrey>Timestamp:</TextGrey>
              <PaymentHistoryType>{props.data.timeStamp}</PaymentHistoryType>
              <br />
            </div>
            <div>
              <TextGrey>Block Height:</TextGrey>
              <PaymentHistoryType>
                {props.data.blockHeight} (2 block confirmations)
              </PaymentHistoryType>
              <br />
            </div>
          </CollapseLeft>

          <CollapseRight>
            <div>
              <TextGrey>Gas Limit:</TextGrey>
              <PaymentHistoryType>{props.data.gasLimit}</PaymentHistoryType>
              <br />
            </div>
            <div>
              <TextGrey>Gas used by Txn:</TextGrey>
              <PaymentHistoryType>{props.data.gasTxn}</PaymentHistoryType>
              <br />
            </div>
            <div>
              <TextGrey>Gas Price:</TextGrey>
              <PaymentHistoryType>
                {props.data.gasPrice} {props.data.coin}
              </PaymentHistoryType>
              <br />
            </div>
            <div>
              <TextGrey>Actuaal Tx Cost/Fee:</TextGrey>
              <PaymentHistoryType>{props.data.cost} ($0.02)</PaymentHistoryType>
              <br />
            </div>
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
