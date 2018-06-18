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
} from './TransferDescription.style';
import TransferDescriptionList from '../TransferDescriptionList';

/**
 * The TransferDescription Component
 */
export default class TransferDescription extends React.PureComponent {
  render() {
    const {
      title,
      totalUsd,
      recipient,
      totalAmount,
      buttonLabel,
      amountToSend,
      selectedToken,
      transactionFee,
      ethInformation,
      currencySymbol,
      onSend,
      onCancel,
    } = this.props;
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
            value={(totalAmount * +selectedToken.price.USD).toFixed(2)}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Amount to Send</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={amountToSend}
            labelSymbol={selectedToken.symbol}
            value={(amountToSend * +selectedToken.price.USD).toFixed(2)}
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
            value={(transactionFee * +ethInformation.price.USD).toFixed(2)}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Total Transaction Amount</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionList
            label={amountToSend}
            labelSymbol={selectedToken.symbol}
            value={(amountToSend * +selectedToken.price.USD).toFixed(2)}
          />
          <TransferDescriptionList
            label={transactionFee}
            labelSymbol={selectedToken.symbol}
            value={(transactionFee * +ethInformation.price.USD).toFixed(2)}
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
            value={(
              (totalAmount - amountToSend) *
              +selectedToken.price.USD
            ).toFixed(2)}
          />
        </Row>
        <Row>
          <StyledCol span={12}>Remaining Wallet Balance</StyledCol>
        </Row>
        <Row>
          <BalanceCol>
            {currencySymbol}
            {(
              totalUsd -
              amountToSend * +selectedToken.price.USD -
              transactionFee * +ethInformation.price.USD
            ).toFixed(2)}
          </BalanceCol>
        </Row>
        <StyledDiv>
          <StyledButtonCancel type="secondary" onClick={onCancel}>
            {'Cancel'}
          </StyledButtonCancel>
          <StyledButton type="primary" onClick={onSend}>
            {buttonLabel}
          </StyledButton>
        </StyledDiv>
      </WrapperDiv>
    );
  }
}

TransferDescription.defaultProps = {
  title: 'Transaction Description',
  currencySymbol: '$',
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
   * currency sign of the TransferDescription.
   */
  currencySymbol: PropTypes.string,
  /**
   * total Usd  of the transaction.
   */
  totalUsd: PropTypes.number.isRequired,
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
};
// export default TransferDescription;
