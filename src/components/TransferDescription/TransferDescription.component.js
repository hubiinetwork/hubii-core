import { Row } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';

import { formatFiat } from 'utils/numberFormats';
import { isHardwareWallet } from 'utils/wallet';

import {
  StyledCol,
  WrapperDiv,
  BalanceCol,
  StyledTitle,
  StyledButton,
  StyledRecipient,
  StyledSpin,
  HWPromptWrapper,
} from './TransferDescription.style';
import TransferDescriptionItem from '../TransferDescriptionItem';
import HWPrompt from '../HWPrompt';

/**
 * The TransferDescription Component
 */
export default class TransferDescription extends React.PureComponent {
  render() {
    const {
      currentWalletWithInfo,
      recipient,
      assetToSend,
      errors,
      amountToSend,
      ethBalanceBefore,
      ethBalanceAfter,
      assetBalanceAfter,
      assetBalanceBefore,
      walletUsdValueBefore,
      walletUsdValueAfter,
      usdValueToSend,
      transactionFee,
      onSend,
    } = this.props;

    let hardwareError;
    if (currentWalletWithInfo.get('type') === 'lns' && errors.get('ledgerError')) {
      hardwareError = errors.get('ledgerError');
    }
    if (currentWalletWithInfo.get('type') === 'trezor' && errors.get('trezorError')) {
      hardwareError = errors.get('trezorError');
    }

    const disableSendButton =
      amountToSend.isNegative() ||
      ethBalanceAfter.amount.isNegative() ||
      assetBalanceAfter.amount.isNegative() ||
      hardwareError;
    return (
      <WrapperDiv>
        <Row>
          <StyledTitle span={12}>Summary</StyledTitle>
        </Row>
        <Row>
          <StyledCol span={12}>Send</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={`${amountToSend.toString()} ${assetToSend.symbol}`}
            subtitle={formatFiat(usdValueToSend.toNumber(), 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>To</StyledCol>
        </Row>
        <Row>
          <StyledRecipient span={12}>{recipient}</StyledRecipient>
        </Row>
        <Row>
          <StyledCol span={12}>Fee</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={`${transactionFee.amount.toString()} ETH`}
            subtitle={formatFiat(transactionFee.usdValue.toNumber(), 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>ETH balance before</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={`${ethBalanceBefore.amount.toString()} ETH`}
            subtitle={formatFiat(ethBalanceBefore.usdValue.toNumber(), 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>
            ETH balance after
          </StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={`${ethBalanceAfter.amount} ETH`}
            subtitle={formatFiat(ethBalanceAfter.usdValue.toNumber(), 'USD')}
          />
        </Row>
        {assetToSend.symbol !== 'ETH' &&
        <div>
          <Row>
            <StyledCol span={12}>{assetToSend.symbol} balance before</StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={`${assetBalanceBefore.amount} ${assetToSend.symbol}`}
              subtitle={formatFiat(assetBalanceBefore.usdValue.toNumber(), 'USD')}
            />
          </Row>
          <Row>
            <StyledCol span={12}>
              { assetToSend.symbol } balance after
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
          <StyledCol span={12}>Total wallet value before</StyledCol>
        </Row>
        <Row>
          <BalanceCol>
            {formatFiat(walletUsdValueBefore, 'USD')}
          </BalanceCol>
        </Row>
        <Row>
          <StyledCol span={12}>Total wallet value after</StyledCol>
        </Row>
        <Row>
          <BalanceCol>
            {formatFiat(walletUsdValueAfter, 'USD')}
          </BalanceCol>
        </Row>
        <Row>
          {
            isHardwareWallet(currentWalletWithInfo.get('type')) &&
            <HWPromptWrapper>
              <HWPrompt
                deviceType={currentWalletWithInfo.get('type')}
                error={hardwareError}
                confTxOnDevice={this.props.confTxOnDevice}
              />
            </HWPromptWrapper>
          }
          {
            this.props.transfering ?
            (<StyledSpin
              delay={0}
              size="large"
            />) : (
              <StyledButton type="primary" onClick={onSend} disabled={disableSendButton}>
                Send
              </StyledButton>
            )
          }
        </Row>
      </WrapperDiv>
    );
  }
}

TransferDescription.propTypes = {
  recipient: PropTypes.string.isRequired,
  amountToSend: PropTypes.object.isRequired,
  transactionFee: PropTypes.object.isRequired,
  assetToSend: PropTypes.object.isRequired,
  assetBalanceAfter: PropTypes.object.isRequired,
  assetBalanceBefore: PropTypes.object.isRequired,
  ethBalanceAfter: PropTypes.object.isRequired,
  ethBalanceBefore: PropTypes.object.isRequired,
  walletUsdValueAfter: PropTypes.number.isRequired,
  walletUsdValueBefore: PropTypes.number.isRequired,
  usdValueToSend: PropTypes.object.isRequired,
  onSend: PropTypes.func,
  transfering: PropTypes.bool,
  confTxOnDevice: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
};
