import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { ModalFormInput, ModalFormItem, ModalFormLabel } from 'components/ui/Modal';
import Text from 'components/ui/Text';
import Heading from 'components/ui/Heading';
import { handleFinish, compareToFirstPassword } from 'utils/forms';
import { getAbsolutePath } from 'utils/electron';

import {
  WidthEighty,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
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
    const { form, handleNext, loading, intl } = this.props;
    const {formatMessage} = intl
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
              <Heading>{formatMessage({id: 'import_from'})}</Heading>
              <img
                src={getAbsolutePath('public/images/mnemonic.png')}
                alt="import method icon"
                style={{ marginTop: '1rem' }}
              />
            </FinalHeader>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  {formatMessage({id: 'enter_wallet_name'})}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: formatMessage({id: 'please_enter_wallet_name'}),
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  {formatMessage({id: 'enter_wallet_mnemonic'})}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('mnemonic', {
                rules: [
                  {
                    message: formatMessage({id: 'please_enter_wallet_mnemonic'}),
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>{formatMessage({id: 'enter_wallet_password'})}</ModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: formatMessage({id: 'please_enter_wallet_password'}),
                    required: true,
                    whitespace: true,
                  },
                  {
                    min: 8,
                    message: formatMessage({id: 'password_8chart_min'}),
                  },
                ],
              })(<ModalFormInput type="password" disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>{formatMessage({id: 'repeat_password'})}</ModalFormLabel>
              }
            >
              {getFieldDecorator('repeatPassword', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: formatMessage({id: 'confirm_password'}),
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
                    <Text>{formatMessage({id: 'back'})}</Text>
                  </StyledBackButton>
                  <StyledButton type="primary" htmlType="submit">
                    <Text>{formatMessage({id: 'import_wallet'})}</Text>
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

export default Form.create()(injectIntl(ImportWalletMnemonicForm));
