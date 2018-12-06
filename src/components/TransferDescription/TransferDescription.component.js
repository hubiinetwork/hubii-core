import { Row } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { formatFiat } from 'utils/numberFormats';
import { isValidAddress } from 'ethereumjs-util';
import { isHardwareWallet } from 'utils/wallet';

import HWPromptContainer from 'containers/HWPromptContainer';

import {
  StyledCol,
  Balance,
  StyledButton,
  StyledRecipient,
  StyledSpin,
  HWPromptWrapper,
} from './TransferDescription.style';
import TransferDescriptionItem from '../TransferDescriptionItem';

/**
 * The TransferDescription Component
 */
class TransferDescription extends React.PureComponent {
  render() {
    const {
      currentWalletWithInfo,
      recipient,
      assetToSend,
      amountToSend,
      baseLayerEthBalanceBefore,
      baseLayerEthBalanceAfter,
      assetBalanceAfter,
      assetBalanceBefore,
      walletUsdValueBefore,
      walletUsdValueAfter,
      usdValueToSend,
      transactionFee,
      onSend,
      hwWalletReady,
      layer,
      intl,
    } = this.props;

    const { formatMessage } = intl;

    const disableSendButton =
      amountToSend.isNegative() ||
      (baseLayerEthBalanceAfter.amount.isNegative() && layer === 'baseLayer') ||
      assetBalanceAfter.amount.isNegative() ||
      !isValidAddress(recipient) ||
      !hwWalletReady ||
      (amountToSend.toNumber() === 0 && layer === 'nahmii');
    return (
      <div>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'send' })}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={`${amountToSend.toString()} ${assetToSend.symbol}`}
            subtitle={formatFiat(usdValueToSend.toNumber(), 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'to' })}</StyledCol>
        </Row>
        <Row>
          <StyledRecipient span={12}>{recipient}</StyledRecipient>
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'fee' })}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={`${transactionFee.amount.toString()} ${transactionFee.symbol}`}
            subtitle={formatFiat(transactionFee.usdValue.toNumber(), 'USD')}
          />
        </Row>
        {layer === 'baseLayer' &&
        <div>
          <Row>
            <StyledCol span={12}>ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={`${baseLayerEthBalanceBefore.amount.toString()} ETH`}
              subtitle={formatFiat(baseLayerEthBalanceBefore.usdValue.toNumber(), 'USD')}
            />
          </Row>
          <Row>
            <StyledCol span={12}>
            ETH {formatMessage({ id: 'balance_after' })}
            </StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={`${baseLayerEthBalanceAfter.amount} ETH`}
              subtitle={formatFiat(baseLayerEthBalanceAfter.usdValue.toNumber(), 'USD')}
            />
          </Row>
        </div>
        }
        {(layer === 'nahmii' || assetToSend.symbol !== 'ETH') &&
        <div>
          <Row>
            <StyledCol span={12}>
              {layer === 'nahmii' ? formatMessage({ id: 'available' }) : ''} {assetToSend.symbol} {formatMessage({ id: 'balance_before' })}
            </StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={`${assetBalanceBefore.amount} ${assetToSend.symbol}`}
              subtitle={formatFiat(assetBalanceBefore.usdValue.toNumber(), 'USD')}
            />
          </Row>
          <Row>
            <StyledCol span={12}>
              {layer === 'nahmii' ? formatMessage({ id: 'available' }) : ''} { assetToSend.symbol } {formatMessage({ id: 'balance_after' })}
            </StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={`${assetBalanceAfter.amount} ${assetToSend.symbol}`}
              subtitle={formatFiat(assetBalanceAfter.usdValue.toNumber(), 'USD')}
            />
          </Row>
        </div>
      }
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'total_value_before' })}</StyledCol>
        </Row>
        <Row>
          <Balance large>
            {formatFiat(walletUsdValueBefore, 'USD')}
          </Balance>
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'total_value_after' })}</StyledCol>
        </Row>
        <Row>
          <Balance large>
            {formatFiat(walletUsdValueAfter, 'USD')}
          </Balance>
        </Row>
        <Row>
          {
            isHardwareWallet(currentWalletWithInfo.get('type')) &&
            <HWPromptWrapper>
              <HWPromptContainer />
            </HWPromptWrapper>
          }
          {
            this.props.transfering ?
            (<StyledSpin
              delay={0}
              size="large"
            />) : (
              <StyledButton type="primary" onClick={onSend} disabled={disableSendButton}>
                {formatMessage({ id: 'send' })}
              </StyledButton>
            )
          }
        </Row>
      </div>
    );
  }
}

TransferDescription.propTypes = {
  recipient: PropTypes.string.isRequired,
  layer: PropTypes.oneOf(['baseLayer', 'nahmii']).isRequired,
  amountToSend: PropTypes.object.isRequired,
  transactionFee: PropTypes.object.isRequired,
  assetToSend: PropTypes.object.isRequired,
  assetBalanceAfter: PropTypes.object.isRequired,
  assetBalanceBefore: PropTypes.object.isRequired,
  baseLayerEthBalanceAfter: PropTypes.object.isRequired,
  baseLayerEthBalanceBefore: PropTypes.object.isRequired,
  walletUsdValueAfter: PropTypes.number.isRequired,
  walletUsdValueBefore: PropTypes.number.isRequired,
  usdValueToSend: PropTypes.object.isRequired,
  onSend: PropTypes.func,
  transfering: PropTypes.bool,
  hwWalletReady: PropTypes.bool.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TransferDescription);
