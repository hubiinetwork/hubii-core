import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getAbsolutePath } from 'utils/electron';
import {
  Wrapper,
  Image,
  TypeIcon,
  DetailCollapse,
  DetailPanel,
  HeaderWrapper,
  TypeText,
  Amount,
  FiatValue,
  TransactionHistoryTime,
  GreenTextWrapper,
  CollapsableContent,
  SubtitleText,
  TransactionId,
} from './Transaction.style';

const Transaction = (props) => {
  const {
    time,
    viewOnBlockExplorerClick,
    counterpartyAddress,
    amount,
    fiatEquivilent,
    symbol,
    confirmations,
    type,
  } = props;

  return (
    <Wrapper>
      <DetailCollapse bordered={false}>
        <DetailPanel
          showArrow={false}
          header={
            <HeaderWrapper>
              <Image
                src={getAbsolutePath(`public/images/assets/${symbol}.svg`)}
              />
              <TypeIcon
                type={type === 'received' ? 'download' : 'upload'}
              />
              <TypeText>
                {type === 'received' ? 'Received ' : 'Sent '}
              </TypeText>
              <Amount>
                {amount} {symbol}
              </Amount>
              <FiatValue>{`(${fiatEquivilent})`}</FiatValue>
              <TransactionHistoryTime>
                {moment(time).calendar()}
              </TransactionHistoryTime>
            </HeaderWrapper>
            }
        >
          <CollapsableContent>
            <div style={{ display: 'flex' }}>
              <SubtitleText>
                {type === 'received' ? 'From: ' : 'To: '}
              </SubtitleText>
              <GreenTextWrapper>
                {counterpartyAddress}
              </GreenTextWrapper>
            </div>
            <div style={{ display: 'flex' }}>
              <SubtitleText>
                {'Confirmations: '}
              </SubtitleText>
              <GreenTextWrapper>
                {confirmations}
              </GreenTextWrapper>
            </div>
            <TransactionId
              onClick={viewOnBlockExplorerClick}
            >View on Etherscan</TransactionId>
          </CollapsableContent>
        </DetailPanel>
      </DetailCollapse>
    </Wrapper>
  );
};

Transaction.propTypes = {
  time: PropTypes.object.isRequired,
  counterpartyAddress: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  fiatEquivilent: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  confirmations: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  viewOnBlockExplorerClick: PropTypes.func.isRequired,
};

export default Transaction;
