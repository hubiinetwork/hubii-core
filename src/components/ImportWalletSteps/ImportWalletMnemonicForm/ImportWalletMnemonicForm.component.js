import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';

import { ModalFormInput, ModalFormItem } from 'components/ui/Modal';
import { handleFinish, compareToFirstPassword } from 'utils/forms';
import { getAbsolutePath } from 'utils/electron';

import {
  WidthEighty,
  StyledModalFormLabel,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  StyledSpan,
  StyledSpin,
  FinalHeader,
} from '../ImportWalletForm.style';

class ImportWalletMnemonicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      derivationPath: 'm/44\'/60\'/0\'/0/0',
    };
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
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <WidthEighty>
            <FinalHeader>
              <p>Importing from a</p>
              <img
                src={getAbsolutePath('public/images/mnemonic.png')}
                alt="import method icon"
                style={{ marginTop: '1rem' }}
              />
            </FinalHeader>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Enter a name for your wallet
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: 'Please enter a name for your wallet',
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  {"Enter your wallet's mnemonic"}
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('mnemonic', {
                rules: [
                  {
                    message: 'Please enter your wallet\'s mnemonic',
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Please enter a password to secure your wallet</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: 'Please enter a password for your wallet',
                    required: true,
                    whitespace: true,
                  },
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters',
                  },
                ],
              })(<ModalFormInput type="password" disabled={loading} />)}
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
                  },
                ],
              })(<ModalFormInput type="password" disabled={loading} />)}
            </ModalFormItem>
            {loading ?
              (
                <ButtonDiv loading={loading}>
                  <StyledSpin
                    delay={0}
                    size="large"
                  />
                </ButtonDiv>
              )
              :
              (
                <ButtonDiv>
                  <StyledBackButton type="default" onClick={this.props.handleBack}>
                    <StyledSpan>Back</StyledSpan>
                  </StyledBackButton>
                  <StyledButton type="primary" htmlType="submit">
                    <StyledSpan>Import wallet</StyledSpan>
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
