import React from 'react';
import { FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';
import {
  PaymentHistoryAddress,
  Wrapper,
  DetailCollapse,
  DetailPanel,
  TextGrey,
  Amount,
  TimePast,
  TextDullWhite,
  CollapseLeft,
  CollapseParent,
  CollapseRight,
  ItemWrapper,
  LeftFlex,
  RightFlex,
} from './PaymentHistoryDetail.style';
import PaymentType from '../PaymentType';

/**
 * This component shows the collapsed area of PaymentHistoryItem.
 */

const PaymentHistoryDetail = (props) => (
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
            <TextDullWhite>
                To:
                <PaymentHistoryAddress> {props.data.to}</PaymentHistoryAddress>
            </TextDullWhite>
          </LeftFlex>
          <RightFlex>
            <div style={{ marginLeft: '-1rem' }}>
              <PaymentType type={props.data.type} />
            </div>
            <TimePast>
              <FormattedRelative value={new Date(props.data.timeStamp)} />
            </TimePast>
          </RightFlex>
        </Wrapper>
        }
      key="1"
    >
      <CollapseParent>
        <CollapseLeft>
          <div>
            <TextGrey>To Wallet ID:</TextGrey>
            <TextDullWhite>{props.data.toID}</TextDullWhite>
          </div>
          <ItemWrapper>
            <TextGrey>TxHash:</TextGrey>
            <TextDullWhite>{props.data.hashID}</TextDullWhite>
          </ItemWrapper>
          <ItemWrapper>
            <TextGrey>Timestamp:</TextGrey>
            <TextDullWhite>
              {props.data.timeStamp.toLocaleString()}
            </TextDullWhite>
          </ItemWrapper>
          <ItemWrapper>
            <TextGrey>Block Height:</TextGrey>
            <TextDullWhite>
              {props.data.blockHeight} ({props.data.confirmationBlocks} block
                confirmations)
              </TextDullWhite>
          </ItemWrapper>
        </CollapseLeft>

        <CollapseRight>
          <div>
            <TextGrey>Gas Limit:</TextGrey>
            <TextDullWhite>{props.data.gasLimit}</TextDullWhite>
          </div>
          <ItemWrapper>
            <TextGrey>Gas used by Txn:</TextGrey>
            <TextDullWhite>{props.data.gasTxn}</TextDullWhite>
          </ItemWrapper>
          <ItemWrapper>
            <TextGrey>Gas Price:</TextGrey>
            <TextDullWhite>
              {props.data.gasPrice} {props.data.coin}
            </TextDullWhite>
          </ItemWrapper>
          <ItemWrapper>
            <TextGrey>Actuaal Tx Cost/Fee:</TextGrey>
            <TextDullWhite>
              {props.data.cost} {props.data.exchangeRate}
            </TextDullWhite>
          </ItemWrapper>
        </CollapseRight>
      </CollapseParent>
    </DetailPanel>
  </DetailCollapse>
  );
PaymentHistoryDetail.propTypes = {
  data: PropTypes.shape({
    coin: PropTypes.string,
    confirmationBlocks: PropTypes.number,
    coinAmount: PropTypes.number,
    USDAmount: PropTypes.number,
    to: PropTypes.string,
    type: PropTypes.oneOf([
      'Order',
      'Payment',
      'Withdrawal',
      'Deposit',
      'Trade',
    ]),
    toID: PropTypes.string,
    hashID: PropTypes.string,
    timeStamp: PropTypes.object,
    blockHeight: PropTypes.number,
    gasLimit: PropTypes.number,
    gasTxn: PropTypes.number,
    gasPrice: PropTypes.number,
    cost: PropTypes.number,
    exchangeRate: PropTypes.number,
  }).isRequired,
};

export default PaymentHistoryDetail;
