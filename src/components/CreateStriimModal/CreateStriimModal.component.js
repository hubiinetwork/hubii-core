import React from 'react';
import { Form, Select } from 'antd';
import {
  TextLight,
  LogoWrapper,
  StyledSelect,
  Image,
  IconSelectWrapper,
  IconSelect,
  TextPrimary,
  FlexWrapper,
  Rate
} from './CreateStriimModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

const { Option } = Select;

class CreateStriimModal extends React.Component {
  state = {
    icon: this.props.currencies[0]
  };
  handleIcon = icon => {
    this.setState({ icon });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { currencies } = this.props;
    return (
      <div>
        <TextLight>New Striim Account</TextLight>
        <LogoWrapper>
          <img src="/public/Images/striim-logo.png" alt="Striim  logo" />
        </LogoWrapper>
        <Form>
          <ModalFormItem
            colon={false}
            label={<ModalFormLabel>Account name</ModalFormLabel>}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter your account name.'
                }
              ]
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ModalFormItem
            colon={false}
            label={<ModalFormLabel>Choose Wallet</ModalFormLabel>}
          >
            {getFieldDecorator('wallet', {
              rules: [
                {
                  required: true,
                  message: 'Please select wallet.'
                }
              ]
            })(
              <StyledSelect defaultValue="rmb">
                <Option value="rmb">RMB</Option>
                <Option value="dollar">Dollar</Option>
              </StyledSelect>
            )}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Make First Topup</ModalFormLabel>}
            colon={false}
          >
            <FlexWrapper>
              <div>
                <IconSelectWrapper>
                  <Image
                    src={`/public/asset_images/${this.state.icon}.svg`}
                    alt="coin"
                  />
                  <IconSelect
                    defaultValue={this.state.icon}
                    onSelect={this.handleIcon}
                  >
                    {currencies.map(currency => (
                      <Option value={currency} key={currency}>
                        {currency}
                      </Option>
                    ))}
                  </IconSelect>
                </IconSelectWrapper>
                <TextPrimary> Balance 1.213 ETH</TextPrimary>
              </div>
              <div>
                <Rate> 0.245</Rate>
                <TextPrimary> $300.5905</TextPrimary>
              </div>
            </FlexWrapper>
          </ModalFormItem>
        </Form>
      </div>
    );
  }
}
export default Form.create()(CreateStriimModal);
