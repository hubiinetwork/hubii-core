import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { getAbsolutePath, assetImageFallback } from 'utils/electron';
import NahmiiText from 'components/ui/NahmiiText';
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
} from './style';

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
    layer,
    intl,
  } = props;
  const { formatMessage } = intl;
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
                onError={assetImageFallback}
              />
              <TypeIcon
                type={type === 'received' ? 'download' : 'upload'}
              />
              <TypeText>
                {type === 'received' ? formatMessage({ id: 'received' }) : formatMessage({ id: 'sent' })}
              </TypeText>
              <Amount>
                {amount} {symbol}
              </Amount>
              <FiatValue>{`(${fiatEquivilent})`}</FiatValue>
              <div style={{ marginLeft: 'auto' }}>
                {
                  layer === 'nahmii' &&
                  <NahmiiText style={{ marginRight: '0.5rem' }} />
                }
                <TransactionHistoryTime>
                  {moment(time).calendar()}
                </TransactionHistoryTime>
              </div>
            </HeaderWrapper>
            }
        >
          <CollapsableContent>
            <div style={{ display: 'flex' }}>
              <SubtitleText>
                { counterpartyAddress === '' &&
                  formatMessage({ id: 'contract_creation' })
                }
                {
                  counterpartyAddress !== '' &&
                  (type === 'received' ? (`${formatMessage({ id: 'from' })}:`) : `${formatMessage({ id: 'to' })}:`)
                }
              </SubtitleText>
              <GreenTextWrapper>
                {counterpartyAddress}
              </GreenTextWrapper>
            </div>
            <div style={{ display: 'flex' }}>
              {
                layer === 'baseLayer' &&
                <div>
                  <SubtitleText>
                    {formatMessage({ id: 'confirmations' })}:
                  </SubtitleText>
                  <GreenTextWrapper>
                    {confirmations}
                  </GreenTextWrapper>
                </div>
              }
              {
                layer === 'nahmii' &&
                <GreenTextWrapper>
                  {formatMessage({ id: 'confirmed' })}
                </GreenTextWrapper>
              }
            </div>
            {
              layer === 'baseLayer' &&
              <TransactionId
                onClick={viewOnBlockExplorerClick}
              >{formatMessage({ id: 'view_etherscan' })}</TransactionId>
            }
            {
              layer === 'nahmii' &&
              <TransactionId disabled>{formatMessage({ id: 'view_nahmii_explorer' })}</TransactionId>
            }
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
  confirmations: PropTypes.string,
  type: PropTypes.string.isRequired,
  viewOnBlockExplorerClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  layer: PropTypes.oneOf(['baseLayer', 'nahmii']).isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Transaction);
