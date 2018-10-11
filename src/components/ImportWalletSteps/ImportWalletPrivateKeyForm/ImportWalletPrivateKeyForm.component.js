import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { ModalFormInput, ModalFormItem, ModalFormLabel } from 'components/ui/Modal';
import Heading from 'components/ui/Heading';
import { handleFinish, compareToFirstPassword } from 'utils/forms';
import { isValidPrivateKey } from 'utils/wallet';
import { getAbsolutePath } from 'utils/electron';
import {
  WidthEighty,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  StyledSpin,
  FinalHeader,
} from '../ImportWalletForm.style';
import Text from '../../ui/Text';

class ImportWalletPrivateKeyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
  }

  validatePrivateKey(rule, value, callback) {
    if (value && !isValidPrivateKey(value)) {
      callback('Sorry, that private key doesn\'t seem to be valid');
    } else {
      callback();
    }
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || value,
    });
  }

  validateToNextPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form, handleNext, loading } = this.props;
    return (
      <div>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext)}
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
              <Heading>Importing from a</Heading>
              <img src={getAbsolutePath('public/images/private-key.png')} alt="import method icon" />
            </FinalHeader>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  Enter a name for your wallet
                </ModalFormLabel>
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
                <ModalFormLabel>
                  {"Enter your wallet's private key"}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('privateKey', {
                rules: [
                  {
                    message: 'Please enter your wallet\'s private key',
                    required: true,
                    whitespace: true,
                  },
                  {
                    validator: this.validatePrivateKey,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>Enter a password to secure your wallet</ModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please enter a password for your wallet',
                  },
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<ModalFormInput type="password" disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>Repeat password</ModalFormLabel>
              }
            >
              {getFieldDecorator('confirm', {
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
              })(<ModalFormInput disabled={loading} type="password" onBlur={this.handleConfirmBlur} />)}
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
                    <Text>Back</Text>
                  </StyledBackButton>
                  <StyledButton type="primary" htmlType="submit">
                    <Text>Import wallet</Text>
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

ImportWalletPrivateKeyForm.propTypes = {
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

export default Form.create()(ImportWalletPrivateKeyForm);
