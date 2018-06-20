import React from 'react';
import { Form, Select } from 'antd';
import PropTypes from 'prop-types';
import {
  TextLight,
  LogoWrapper,
  StyledSelect,
  Image,
  IconSelectWrapper,
  IconSelect,
  TextPrimary,
  FlexWrapper,
  Rate,
  StyledButton,
  ButtonWrapper,
  StyledForm,
} from './CreateStriimModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

const { Option } = Select;

class CreateStriimModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.currencies[0],
    };
    this.handleIcon = this.handleIcon.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleIcon(icon) {
    const currency = this.props.currencies.find(
      (currncy) => currncy.name === icon
    );
    this.setState({ currency });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { currencies, wallets } = this.props;
    const { name, balance, rate } = this.state.currency;
    return (
      <div>
        <TextLight>New Striim Account</TextLight>
        <LogoWrapper>
          <img src="/public/Images/striim-logo.png" alt="Striim  logo" />
        </LogoWrapper>
        <StyledForm onSubmit={this.handleSubmit}>
          <ModalFormItem
            colon={false}
            label={<ModalFormLabel>Account name</ModalFormLabel>}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter your account name.',
                },
              ],
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ModalFormItem
            colon={false}
            label={<ModalFormLabel>Choose Wallet</ModalFormLabel>}
          >
            {getFieldDecorator('wallet', {
              initialValue: wallets[0],
              rules: [
                {
                  required: true,
                  message: 'Please select wallet.',
                },
              ],
            })(
              <StyledSelect>
                {wallets.map((wallet) => (
                  <Option value={wallet} key={wallet}>
                    {wallet}
                  </Option>
                ))}
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
                  <Image src={`/public/asset_images/${name}.svg`} alt="coin" />
                  {getFieldDecorator('coin', {
                    initialValue: currencies[0].name,
                    rules: [
                      {
                        required: true,
                        message: 'Please select wallet.',
                      },
                    ],
                  })(
                    <IconSelect onSelect={this.handleIcon}>
                      {currencies.map((currency) => (
                        <Option value={currency.name} key={currency.name}>
                          {currency.name}
                        </Option>
                      ))}
                    </IconSelect>
                  )}
                </IconSelectWrapper>
                <TextPrimary>
                  {' '}
                  Balance {balance} {name}
                </TextPrimary>
              </div>
              <div>
                <Rate> {rate}</Rate>
                <TextPrimary> ${rate * balance}</TextPrimary>
              </div>
            </FlexWrapper>
          </ModalFormItem>
          <ButtonWrapper>
            <StyledButton type="primary" htmlType="submit">
              Create
            </StyledButton>
          </ButtonWrapper>
        </StyledForm>
      </div>
    );
  }
}
export default Form.create()(CreateStriimModal);
CreateStriimModal.propTypes = {
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      balance: PropTypes.number,
      rate: PropTypes.number,
    })
  ).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  form: PropTypes.object,
  handleSubmit: PropTypes.func,
};
