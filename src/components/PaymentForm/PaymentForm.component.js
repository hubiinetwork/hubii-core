import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import Balance from '../Balance';
import Select, { Option } from '../ui/Select';
import {
  Wrapper,
  TermDiv,
  ItemDiv,
  StyledA,
  StyledSpan,
  HeadingDiv,
  BalanceDiv,
  StyledLabel,
  StyledInput,
  StyledButton,
  ButtonWrapper,
  Conversion,
  ConversionWrapper
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
            balance="1,234.09"
            coin="HBT"
            showCoinName="HBT"
          />
        </BalanceDiv>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <ItemDiv>
            <Item label={<StyledLabel>Amount</StyledLabel>}>
              {getFieldDecorator('Amount', {
                initialValue: `${450}`,
                rules: [
                  {
                    message: 'Amount is required.',
                    required: true
                  }
                ]
              })(<StyledInput />)}
              <StyledSpan>{'$300.59'}</StyledSpan>
            </Item>
          </ItemDiv>
          <ItemDiv>
            <Item label={<StyledLabel>Recipient</StyledLabel>}>
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
            <StyledButton type="primary" htmlType="submit">
              Topup
            </StyledButton>
          </ButtonWrapper>
        </Form>
        <TermDiv>
          By depositing, withdrawing and making payments you agree to Hubii
        </TermDiv>
        <TermDiv>
          Core´s <StyledA href="/"> terms and conditions </StyledA>
        </TermDiv>
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
