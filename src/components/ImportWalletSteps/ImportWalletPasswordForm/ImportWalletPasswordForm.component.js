/* eslint-disable */
import * as React from 'react';
import { Form, Icon } from 'antd';
import {
  Flex,
  Image,
  Between,
  IconDiv,
  LeftArrow,
  WidthEighty,
  StyledTitle,
  CreateButton,
  StyledModalFormLabel,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  StyledSpan,
} from './ImportWalletPasswordForm.style';
import { ModalFormInput, ModalFormItem } from 'components/ui/Modal';
class ImportWalletNameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleFinish = this.handleFinish.bind(this);
  }

  handleFinish(e) {
    const { form, handleNext } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err && handleNext) {
        handleNext(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <IconDiv>
          <Image src={this.props.wallet.src} />
        </IconDiv>
        <Form
          onSubmit={this.handleFinish}
          layout="vertical"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <WidthEighty>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Give your Wallet a Name
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: 'Name is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Wallet Private Key
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('privateKey', {
                rules: [
                  {
                    message: 'Private Key is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Set a password</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: 'password is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Repeat password</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('repeatPassword', {
                rules: [
                  {
                    message: 'Repeat password is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ButtonDiv>
              <StyledBackButton type={"primary"} onClick={this.props.handleBack}>
                <StyledSpan>Back</StyledSpan>
              </StyledBackButton>
              <StyledButton type={"primary"} htmlType="submit">
                <StyledSpan>Finish</StyledSpan>
              </StyledButton>
            </ButtonDiv>
          </WidthEighty>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ImportWalletNameForm);
