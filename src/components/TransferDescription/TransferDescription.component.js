import { Row } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledCol,
  StyledDiv,
  WrapperDiv,
  BalanceCol,
  StyledTitle,
  StyledButton,
  StyledRecipient,
  StyledButtonCancel,
  StyledSpin,
} from './TransferDescription.style';
import TransferDescriptionList from '../TransferDescriptionList';
import { formatFiat } from '../../utils/numberFormats';

/**
 * The TransferDescription Component
 */
export default class TransferDescription extends React.PureComponent {
  render() {
    const {
      recipient,
      assetToSend,
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

    return (
      <WrapperDiv>
        <Row>
          <StyledTitle span={12}>Transaction Summary</StyledTitle>
        </Row>
        <Row>
          <StyledCol span={12}>Send</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={amountToSend}
            labelSymbol={assetToSend.symbol}
            value={formatFiat(usdValueToSend, 'USD')}
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
          <TransferDescriptionList
            label={transactionFee.amount}
            labelSymbol="ETH"
            value={formatFiat(transactionFee.usdValue, 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>ETH Balance before</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={ethBalanceBefore.amount}
            labelSymbol="ETH"
            value={formatFiat(ethBalanceBefore.usdValue, 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>
            ETH Balance after
          </StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={ethBalanceAfter.amount}
            labelSymbol="ETH"
            value={formatFiat(ethBalanceAfter.usdValue, 'USD')}
          />
        </Row>
        {assetToSend.symbol !== 'ETH' &&
        <div>
          <Row>
            <StyledCol span={12}>{assetToSend.symbol} Balance before</StyledCol>
          </Row>
          <Row>
            <TransferDescriptionList
              label={assetBalanceBefore.amount}
              labelSymbol={assetToSend.symbol}
              value={formatFiat(assetBalanceBefore.usdValue, 'USD')}
            />
          </Row>
          <Row>
            <StyledCol span={12}>
              { assetToSend.symbol } Balance after
          </StyledCol>
          </Row>
          <Row>
            <TransferDescriptionList
              label={assetBalanceAfter.amount}
              labelSymbol={assetToSend.symbol}
              value={formatFiat(assetBalanceAfter.usdValue, 'USD')}
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
        {
            this.props.transfering ?
            (<StyledSpin
              delay={0}
              tip="Sending..."
              size="large"
            />) : (
              <StyledDiv>
                <StyledButtonCancel type="secondary" onClick={onCancel}>
                  {'Cancel'}
                </StyledButtonCancel>
                <StyledButton type="primary" onClick={onSend} >
                  Send
                </StyledButton>
              </StyledDiv>
            )
          }
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
  amountToSend: PropTypes.number.isRequired,

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
  usdValueToSend: PropTypes.number.isRequired,

  /**
   * onSend function Callback in the TransferDescription.
   */

  onSend: PropTypes.func,
  /**
   * onSend function Callback  in the TransferDescription.
   */
  onCancel: PropTypes.func,
  transfering: PropTypes.bool,
};
// export default TransferDescription;
