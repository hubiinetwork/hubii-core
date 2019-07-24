import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { getAbsolutePath } from 'utils/electron';
import {
  Wrapper,
  Image,
  DetailCollapse,
  DetailPanel,
  HeaderWrapper,
  TypeText,
  TransactionHistoryTime,
  CollapsableContent,
  TransactionId,
} from './SettlementTransaction.style';

const SettlementTransaction = (props) => {
  const {
    time,
    className,
    viewOnBlockExplorerClick,
    symbol,
    type,
    onChange,
    defaultOpen,
    intl,
  } = props;
  const { formatMessage } = intl;

  const typeTexts = {
    start_payment_challenge: formatMessage({ id: 'start_payment_challenge_type' }),
    settle_payment: formatMessage({ id: 'settle_payment_type' }),
    withdraw: formatMessage({ id: 'withdraw' }),
  };

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
              <TypeText>
                {typeTexts[type]}
              </TypeText>
              <TransactionHistoryTime>
                {moment(time).calendar()}
              </TransactionHistoryTime>
            </HeaderWrapper>
          }
        >
          <CollapsableContent>
            <TransactionId
              onClick={viewOnBlockExplorerClick}
            >{formatMessage({ id: 'view_etherscan' })}</TransactionId>
          </CollapsableContent>
        </DetailPanel>
      </DetailCollapse>
    </Wrapper>
  );
};

SettlementTransaction.propTypes = {
  time: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  viewOnBlockExplorerClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
  symbol: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SettlementTransaction);
