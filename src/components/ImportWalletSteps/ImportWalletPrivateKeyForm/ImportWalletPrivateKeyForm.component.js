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
} from './ImportWalletPrivateKeyForm.style';
import { ModalFormInput, ModalFormItem } from 'components/ui/Modal';

class ImportWalletPrivateKey extends React.Component {
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
        <Form
          onSubmit={this.handleFinish}
          layout="vertical"
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <WidthEighty>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Name
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: 'Required field',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Private Key
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('privateKey', {
                rules: [
                  {
                    message: 'Required field',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Password</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: 'Required field',
                    required: true,
                  },
                ],
              })(<ModalFormInput type="password" />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Repeat password</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('repeatPassword', {
                rules: [
                  {
                    message: 'Required field',
                    required: true,
                  },
                ],
              })(<ModalFormInput type="password" />)}
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
export default Form.create()(ImportWalletPrivateKey);
