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
  StyledButtonCancel,
  StyledSpin,
  SendCancelWrapper,
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
      onCancel,
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
            this.props.transfering ?
            (<StyledSpin
              delay={0}
              size="large"
            />) : (
              <div>
                {
                isHardwareWallet(currentWalletWithInfo.get('type')) &&
                <HWPromptWrapper>
                  <HWPrompt
                    deviceType={currentWalletWithInfo.get('type')}
                    error={hardwareError}
                  />
                </HWPromptWrapper>
                }
                <SendCancelWrapper>
                  <StyledButtonCancel type="secondary" onClick={onCancel}>
                    {'Cancel'}
                  </StyledButtonCancel>
                  <StyledButton type="primary" onClick={onSend} disabled={disableSendButton}>
                  Send
                </StyledButton>
                </SendCancelWrapper>
              </div>
            )
          }
        </Row>
      </WrapperDiv>
    );
  }
}

TransferDescription.propTypes = {
  /**
   * receipient of the TransferDescription.
   */
  recipient: PropTypes.string.isRequired,

  /**
   * amount to send in the TransferDescription.
   */
  amountToSend: PropTypes.object.isRequired,

  /**
   * transactionFee
   */
  transactionFee: PropTypes.object.isRequired,

  /**
   * assetToSend
   */
  assetToSend: PropTypes.object.isRequired,

  /**
   * amount of the asset remaining after the txn
   */
  assetBalanceAfter: PropTypes.object.isRequired,

  /**
   * amount of the asset remaining before the txn
   */
  assetBalanceBefore: PropTypes.object.isRequired,

  /**
   * amount of the eth remaining after the txn
   */
  ethBalanceAfter: PropTypes.object.isRequired,

  /**
   * amount of the eth remaining before the txn
   */
  ethBalanceBefore: PropTypes.object.isRequired,

  /**
   * wallet's total USD value after the txn
   */
  walletUsdValueAfter: PropTypes.number.isRequired,

  /**
   * wallet's total USD value before the txn
   */
  walletUsdValueBefore: PropTypes.number.isRequired,

  /**
   * amount sending to recipient
   */
  usdValueToSend: PropTypes.object.isRequired,

  /**
   * onSend function Callback in the TransferDescription.
   */

  onSend: PropTypes.func,
  /**
   * onSend function Callback  in the TransferDescription.
   */
  onCancel: PropTypes.func,
  /**
   * if the wallet is transfering the transaction
   */
  transfering: PropTypes.bool,
  /**
   * Errors
   */
  errors: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
};
