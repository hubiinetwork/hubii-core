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
  handleSubmit = e => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Wrapper>
        <HeadingDiv>{this.props.heading}</HeadingDiv>
        <BalanceDiv>
          <Balance
            title="Balance"
            info
            balance={this.props.balance}
            coin={this.props.currency}
            showCoinName={this.props.currency}
          />
        </BalanceDiv>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <ItemDiv>
            <Item label={<StyledLabel>Amount</StyledLabel>} style={{ flex: 1 }}>
              {getFieldDecorator('Amount', {
                initialValue: `${450}`,
                rules: [
                  {
                    message: 'Amount is required.',
                    required: true
                  }
                ]
              })(<StyledInput />)}
            </Item>
            <StyledSpan>{'$300.59'}</StyledSpan>
          </ItemDiv>
          <ItemDiv>
            <Item
              label={<StyledLabel>Recipient</StyledLabel>}
              style={{ flex: 1 }}
            >
              <Select defaultValue="address1">
                <Option value="address1">
                  0x86ecabe4d265a11c06d3af979fedbc3a5b48b7c9b96d44af5b504d2bd2480687
                </Option>
                <Option value="address2">
                  0x86ecabe4d265a11c06d3af979fedbc3a5b48b7c9b96d44af5b504d2bd2480687
                </Option>
                <Option value="address3">
                  0x86ecabe4d265a11c06d3af979fedbc3a5b48b7c9b96d44af5b504d2bd2480687
                </Option>
              </Select>
            </Item>
          </ItemDiv>

          <ConversionWrapper>
            <Conversion>Transaction Fee 0.0012ETH</Conversion>
          </ConversionWrapper>

          <ButtonWrapper>
            <Buttons>
              <CancelButton htmlType="submit">Cancel</CancelButton>
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
   * function to handle onSubmit.
   */
  onSubmit: PropTypes.func,
  /**
   * Currency of the coint like HBT.
   */
  currency: PropTypes.string.isRequired,
  /**
   * heading of the component .
   */
  heading: PropTypes.string.isRequired,
  /**
   * balance of the component .
   */
  balance: PropTypes.number.isRequired
};

export default Form.create()(PaymentForm);
