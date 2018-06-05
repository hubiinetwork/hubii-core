import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import Balance from '../Balance';
import TermsAndConditions from '../TermsAndConditions';
import Select, { Option } from '../ui/Select';
import {
  Wrapper,
  ItemDiv,
  StyledSpan,
  HeadingDiv,
  BalanceDiv,
  StyledLabel,
  StyledInput,
  StyledButton,
  ButtonWrapper,
  Conversion,
  ConversionWrapper,
  Buttons,
  CancelButton
} from './PaymentForm.style';
const Item = Form.Item;

/**
 * This component is used to Topup the balance.
 */

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: this.props.rate
    };
  }
  handleRate(e) {
    this.setState({
      rate:
        this.state.rate === 0
          ? this.props.rate * e.target.value
          : this.state.rate * e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSend(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      onCancel,
      transactionFee,
      recipients,
      balance,
      currency
    } = this.props;
    return (
      <Wrapper>
        <HeadingDiv>Make Payment</HeadingDiv>
        <BalanceDiv>
          <Balance
            title="Balance"
            info
            balance={`${balance}`}
            coin={currency}
            showCoinName={currency}
          />
        </BalanceDiv>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <ItemDiv>
            <Item
              label={<StyledLabel>Amount</StyledLabel>}
              style={{ flex: 1, position: 'relative' }}
            >
              {getFieldDecorator('Amount', {
                initialValue: 1,
                rules: [
                  {
                    message: 'Amount is required.',
                    required: true
                  }
                ]
              })(
                <StyledInput type="number" onChange={e => this.handleRate(e)} />
              )}
              <StyledSpan>${this.state.rate}</StyledSpan>
            </Item>
          </ItemDiv>
          <ItemDiv>
            <Item
              label={<StyledLabel>Recipient</StyledLabel>}
              style={{ flex: 1 }}
            >
              <Select defaultValue={recipients[0]}>
                {recipients.map((address, i) => (
                  <Option key={i} value={address}>
                    {address}
                  </Option>
                ))}
              </Select>
            </Item>
          </ItemDiv>

          <ConversionWrapper>
            <Conversion>Transaction Fee {transactionFee}ETH</Conversion>
          </ConversionWrapper>

          <ButtonWrapper>
            <Buttons>
              <CancelButton onClick={onCancel}>Cancel</CancelButton>
              <StyledButton type="primary" htmlType="submit">
                Send
              </StyledButton>
            </Buttons>
            <TermsAndConditions />
          </ButtonWrapper>
        </Form>
      </Wrapper>
    );
  }
}
PaymentForm.propTypes = {
  /**
   * function to handle onSend.
   */
  onSend: PropTypes.func,
  /**
   * function to handle onCancel.
   */
  onCancel: PropTypes.func,
  /**
   * Currency of the coint like HBT.
   */
  currency: PropTypes.string.isRequired,
  /**
   * balance of the component .
   */
  balance: PropTypes.number.isRequired,
  /**
   * Transaction fee required
   */
  transactionFee: PropTypes.number.isRequired,
  /**
   * Array of string of recipients
   */
  recipients: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

export default Form.create()(PaymentForm);
