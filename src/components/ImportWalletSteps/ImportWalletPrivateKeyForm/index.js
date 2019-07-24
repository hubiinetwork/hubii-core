import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
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
} from '../style';
import Text from '../../ui/Text';

class ImportWalletPrivateKeyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.validatePrivateKey = this.validatePrivateKey.bind(this);
  }

  validatePrivateKey(rule, value, callback) {
    const { formatMessage } = this.props.intl;
    if (value && !isValidPrivateKey(value)) {
      callback(formatMessage({ id: 'invalid_private_key' }));
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
    const { form, handleNext, loading, intl } = this.props;
    const { formatMessage } = intl;
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
              <Heading>{formatMessage({ id: 'import_from' })}</Heading>
              <img src={getAbsolutePath('public/images/private-key.png')} alt="import method icon" />
            </FinalHeader>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  {formatMessage({ id: 'enter_wallet_name' })}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: formatMessage({ id: 'please_enter_wallet_name' }),
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  {formatMessage({ id: 'enter_private_key' })}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('privateKey', {
                rules: [
                  {
                    message: formatMessage({ id: 'please_enter_private_key' }),
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
                <ModalFormLabel>{formatMessage({ id: 'enter_wallet_password' })}</ModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: formatMessage({ id: 'please_enter_wallet_password' }),
                  },
                  {
                    min: 8,
                    message: formatMessage({ id: 'password_8chart_min' }),
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<ModalFormInput type="password" disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>{formatMessage({ id: 'repeat_password' })}</ModalFormLabel>
              }
            >
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: formatMessage({ id: 'confirm_password' }),
                  },
                  {
                    validator: (rule, value, callback) => compareToFirstPassword(form, rule, value, callback),
                  },
                ],
              })(<ModalFormInput disabled={loading} type="password" />)}
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
                    <Text>{formatMessage({ id: 'back' })}</Text>
                  </StyledBackButton>
                  <StyledButton type="primary" htmlType="submit">
                    <Text>{formatMessage({ id: 'import_wallet' })}</Text>
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
  intl: PropTypes.object,
};

export default Form.create()(injectIntl(ImportWalletPrivateKeyForm));
