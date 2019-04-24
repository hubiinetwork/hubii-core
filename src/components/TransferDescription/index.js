import { shell } from 'electron';
import { Row } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { isValidAddress } from 'ethereumjs-util';
import { isHardwareWallet } from 'utils/wallet';

import HWPromptContainer from 'containers/HWPromptContainer';
import Text from 'components/ui/Text';
import NumericText from 'components/ui/NumericText';
import SelectableText from 'components/ui/SelectableText';
import TooltipText from 'components/ui/TooltipText';

import {
  StyledCol,
  Balance,
  StyledButton,
  StyledRecipient,
  StyledSpin,
  HWPromptWrapper,
} from './style';
import TransferDescriptionItem from '../TransferDescriptionItem';

/**
 * The TransferDescription Component
 */
class TransferDescription extends React.PureComponent {
  getFeeText() {
    const {
      assetToSend,
      layer,
      intl: { formatMessage },
    } = this.props;
    let feeText;

    if (layer === 'baseLayer') {
      if (assetToSend.symbol === 'ETH') {
        feeText = formatMessage({ id: 'base_layer_fee' });
      } else {
        feeText = (
          <TooltipText details={formatMessage({ id: 'max_base_layer_fee_explain' })}>
            {formatMessage({ id: 'max_base_layer_fee' })}
          </TooltipText>
        );
      }
    } else {
      feeText = formatMessage({ id: 'fee' });
    }
    return feeText;
  }

  generateTransferingStatus() {
    const { currentWalletWithInfo, layer, currentNetwork, intl, transfering } = this.props;
    const { formatMessage } = intl;
    if (!transfering || layer === 'nahmii') return null;
    const transferingText = `${formatMessage({ id: 'waiting_for_transfer_to_be_mined' })}`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>
          <Text large>{transferingText}</Text>
        </span>
        <a
          role="link"
          tabIndex={0}
          onClick={
                    currentNetwork.provider._network.name === 'ropsten' ?
                      () => shell.openExternal(`https://ropsten.etherscan.io/address/${currentWalletWithInfo.get('address')}`) :
                      () => shell.openExternal(`https://etherscan.io/address/${currentWalletWithInfo.get('address')}`)
                  }
        >
          {'Track progress on Etherscan'}
        </a>
      </div>
    );
  }

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

    const transferingStatus = this.generateTransferingStatus();

    return (
      <div>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'send' })}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={<SelectableText><NumericText value={amountToSend.toString()} /> {assetToSend.symbol}</SelectableText>}
            subtitle={<NumericText value={usdValueToSend.toString()} type="currency" />}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'to' })}</StyledCol>
        </Row>
        <Row>
          <StyledRecipient span={12}>{recipient}</StyledRecipient>
        </Row>
        <Row>
          <StyledCol span={12}>{this.getFeeText()}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={<SelectableText><NumericText value={transactionFee.amount.toString()} /> {transactionFee.symbol}</SelectableText>}
            subtitle={<NumericText value={transactionFee.usdValue.toString()} type="currency" />}
          />
        </Row>
        {layer === 'baseLayer' &&
        <div>
          <Row>
            <StyledCol span={12}>ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={<SelectableText><NumericText value={baseLayerEthBalanceBefore.amount.toString()} /> {'ETH'}</SelectableText>}
              subtitle={<NumericText value={baseLayerEthBalanceBefore.usdValue.toString()} type="currency" />}
            />
          </Row>
          <Row>
            <StyledCol span={12}>
            ETH {formatMessage({ id: 'balance_after' })}
            </StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={<SelectableText><NumericText value={baseLayerEthBalanceAfter.amount.toString()} /> {'ETH'}</SelectableText>}
              subtitle={<NumericText value={baseLayerEthBalanceAfter.usdValue.toString()} type="currency" />}
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
              main={<SelectableText><NumericText value={assetBalanceBefore.amount.toString()} /> {assetToSend.symbol}</SelectableText>}
              subtitle={<NumericText value={assetBalanceBefore.usdValue.toString()} type="currency" />}
            />
          </Row>
          <Row>
            <StyledCol span={12}>
              {layer === 'nahmii' ? formatMessage({ id: 'available' }) : ''} { assetToSend.symbol } {formatMessage({ id: 'balance_after' })}
            </StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={<SelectableText><NumericText value={assetBalanceAfter.amount.toString()} /> {assetToSend.symbol}</SelectableText>}
              subtitle={<NumericText value={assetBalanceAfter.usdValue.toString()} type="currency" />}
            />
          </Row>
        </div>
      }
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'total_value_before' })}</StyledCol>
        </Row>
        <Row>
          <Balance>
            {<NumericText large value={walletUsdValueBefore.toString()} type="currency" />}
          </Balance>
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'total_value_after' })}</StyledCol>
        </Row>
        <Row>
          <Balance>
            {<NumericText large value={walletUsdValueAfter.toString()} type="currency" />}
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
            !this.props.transfering &&
              <StyledButton type="primary" onClick={onSend} disabled={disableSendButton}>
                {formatMessage({ id: 'send' })}
              </StyledButton>
          }
          {
            this.props.transfering &&
            <div>
              {
                transferingStatus &&
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
                  {transferingStatus}
                </div>
              }
              <StyledSpin
                delay={0}
                size="large"
              />
            </div>
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
  intl: PropTypes.object,
  currentNetwork: PropTypes.object,
};

export default injectIntl(TransferDescription);
