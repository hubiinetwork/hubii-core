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
  StyledErrorCol,
} from './TransferDescription.style';
import TransferDescriptionList from '../TransferDescriptionList';
import { formatFiat } from '../../utils/numberFormats';

/**
 * The TransferDescription Component
 */
export default class TransferDescription extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSent: false,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.decrypted && !this.props.decrypted) {
  //     this.props.onSend();
  //   }
  // }

  render() {
    const {
      errors,
      currentWalletDetails,
      title,
      recipient,
      totalAmount,
      buttonLabel,
      amountToSend: amount,
      selectedToken,
      transactionFee,
      ethInformation,
      onSend,
      onCancel,
    } = this.props;
    const amountToSend = isNaN(amount) || amount === '' ? 0 : amount;

    const totalUsd = (parseInt(selectedToken.balance, 10) / (10 ** selectedToken.decimals)) * parseFloat(selectedToken.price.USD);
    const remainingBalance = totalUsd - (amountToSend * parseFloat(selectedToken.price.USD)) - (transactionFee * parseFloat(ethInformation.price.USD));
    const lnsDisconnected = currentWalletDetails.type === 'lns' && currentWalletDetails.ledgerNanoSInfo.status !== 'connected';
    const disableSendButton = Number.isNaN(amountToSend) || amountToSend === 0 || remainingBalance < 0 || lnsDisconnected;
    return (
      <WrapperDiv>
        <Row>
          <StyledTitle span={12}>{title}</StyledTitle>
        </Row>
        <Row>
          <StyledCol span={12}>Total {selectedToken.symbol} Balance</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={totalAmount}
            labelSymbol={selectedToken.symbol}
            value={formatFiat(totalAmount * selectedToken.price.USD, 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Amount to Send</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={amountToSend}
            labelSymbol={selectedToken.symbol}
            value={formatFiat(amountToSend * selectedToken.price.USD, 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Send to</StyledCol>
        </Row>
        <Row>
          <StyledRecipient span={12}>{recipient}</StyledRecipient>
        </Row>
        <Row>
          <StyledCol span={12}>Transaction Fee</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={transactionFee}
            labelSymbol={selectedToken.symbol}
            value={formatFiat(transactionFee * ethInformation.price.USD, 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Total Transaction Amount</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={amountToSend + transactionFee}
            labelSymbol={selectedToken.symbol}
            value={formatFiat((amountToSend * parseFloat(selectedToken.price.USD)) + (transactionFee * parseFloat(ethInformation.price.USD)), 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>
            Remaining {selectedToken.symbol} Balance
          </StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={
              selectedToken.symbol === 'ETH'
                ? totalAmount - amountToSend - transactionFee
                : totalAmount - amountToSend
            }
            labelSymbol={selectedToken.symbol}
            value={formatFiat(
              (totalAmount - amountToSend) *
              +selectedToken.price.USD
            , 'USD')}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Remaining Wallet Balance</StyledCol>
        </Row>
        <Row>
          <BalanceCol>
            {formatFiat(remainingBalance, 'USD')}
          </BalanceCol>
        </Row>
        <Row>
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
                <StyledButton type="primary" onClick={onSend} disabled={disableSendButton}>
                  {buttonLabel}
                </StyledButton>
              </StyledDiv>
            )
          }
        </Row>
        <Row>
          <StyledErrorCol span={24}>{errors.get('ledgerError')}</StyledErrorCol>
        </Row>
      </WrapperDiv>
    );
  }
}

TransferDescription.defaultProps = {
  title: 'Transaction Description',
  buttonLabel: 'Send',
};

TransferDescription.propTypes = {
  /**
   * title of the TransferDescription.
   */
  title: PropTypes.string,
  /**
   * button label of the TransferDescription.
   */
  buttonLabel: PropTypes.string,
  /**
   * receipient of the TransferDescription.
   */
  recipient: PropTypes.string.isRequired,
  /**
   * totalAmount of the TransferDescription.
   */
  totalAmount: PropTypes.number.isRequired,
  /**
   * amount to send in the TransferDescription.
   */
  amountToSend: PropTypes.number.isRequired,
  /**
   * transactionFee in the TransferDescription.
   */
  transactionFee: PropTypes.number.isRequired,
  /**
   * selectedToken in the TransferDescription.
   */
  selectedToken: PropTypes.object.isRequired,
  /**
   * ethInformation in the TransferDescription.
   */

  ethInformation: PropTypes.object.isRequired,
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
  currentWalletDetails: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
// export default TransferDescription;
