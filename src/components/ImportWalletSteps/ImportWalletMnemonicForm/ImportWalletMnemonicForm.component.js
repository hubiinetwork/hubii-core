/* eslint-disable */
import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ModalFormInput, ModalFormItem } from 'components/ui/Modal';
import { handleFinish, compareToFirstPassword} from 'utils/forms';

import {
  WidthEighty,
  StyledModalFormLabel,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  StyledSpan,
  StyledSpin,
} from '../ImportWalletForm.style';

class ImportWalletMnemonicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      derivationPath: 'm/44\'/60\'/0\'/0/0',
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form, handleNext, loading } = this.props;
    const { derivationPath } = this.state;
    return (
      <div>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext, { derivationPath })}
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
                  Wallet Name
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
              })(<ModalFormInput disabled={loading}/>)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Mnemonic
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('mnemonic', {
                rules: [
                  {
                    message: 'Required field',
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading}/>)}
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
              })(<ModalFormInput type="password" disabled={loading}/>)}
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
                    message: 'Please confirm your password',
                  }, 
                  {
                    validator: (rule, value, callback) => compareToFirstPassword(form, rule, value, callback),
                  }
                ],
              })(<ModalFormInput type="password" disabled={loading}/>)}
            </ModalFormItem>
            {loading ?
              (
                <ButtonDiv loading={loading}>
                  <StyledSpin
                  delay={0}
                  tip="Importing Wallet..."
                  size="large"
                  />
                </ButtonDiv>
              ) 
              :
              (
                <ButtonDiv>
                  <StyledBackButton type={"primary"} onClick={this.props.handleBack}>
                    <StyledSpan>Back</StyledSpan>
                  </StyledBackButton>
                  <StyledButton type={"primary"} htmlType="submit">
                    <StyledSpan>Finish</StyledSpan>
                  </StyledButton>
                </ButtonDiv>
              )
            }
          </WidthEighty>
        </Form>
      </div>
    );
  }
}

ImportWalletMnemonicForm.propTypes = {
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
  /**
   * loading
   */
  loading: PropTypes.bool.isRequired,
};

export default Form.create()(ImportWalletMnemonicForm);
