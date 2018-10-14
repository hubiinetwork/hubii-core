import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
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
    className,
    viewOnBlockExplorerClick,
    counterpartyAddress,
    amount,
    fiatEquivilent,
    symbol,
    confirmations,
    type,
    onChange,
    defaultOpen,
    intl,
  } = props;
  const {formatMessage} = intl
  return (
    <Wrapper className={className}>
      <DetailCollapse
        defaultActiveKey={defaultOpen ? '1' : null}
        bordered={false}
        onChange={onChange}
      >
        <DetailPanel
          key="1"
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
                {type === 'received' ? formatMessage({id: 'received'}) : formatMessage({id: 'sent'})}
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
                { counterpartyAddress === '' &&
                  formatMessage({id: 'contract_creation'})
                }
                {
                  counterpartyAddress !== '' &&
                  (type === 'received' ? (formatMessage({id: 'from'}) + ':') : (formatMessage({id: 'to'})) + ':')
                }
              </SubtitleText>
              <GreenTextWrapper>
                {counterpartyAddress}
              </GreenTextWrapper>
            </div>
            <div style={{ display: 'flex' }}>
              <SubtitleText>
                {formatMessage({id: 'confirmations'})}: 
              </SubtitleText>
              <GreenTextWrapper>
                {confirmations}
              </GreenTextWrapper>
            </div>
            <TransactionId
              onClick={viewOnBlockExplorerClick}
            >{formatMessage({id: 'view_etherscan'})}</TransactionId>
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
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
};

export default injectIntl(Transaction);
