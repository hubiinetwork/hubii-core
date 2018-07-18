/* eslint-disable */
import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
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
import { handleFinish, compareToFirstPassword} from 'utils/forms';

class ImportWalletPrivateKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {form, handleNext} = this.props;
    return (
      <div>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext)}
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
                    whitespace: true,
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
                    whitespace: true,
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
                    whitespace: true,
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
                    required: true, 
                    whitespace: true,
                    message: 'Please confirm your password!',
                  }, 
                  {
                    validator: (rule, value, callback) => compareToFirstPassword(form, rule, value, callback),
                  }
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

ImportWalletPrivateKey.propTypes = {
  /**
   * Function to be executed when back button is pressed
   */
  handleBack: PropTypes.func.isRequired,
  /**
   * Function to be executed when next is clicked.
   */
  handleNext: PropTypes.func.isRequired,
    /**
   * ant design form
   */
  form: PropTypes.object,
};

export default Form.create()(ImportWalletPrivateKey);
