import * as React from 'react';
import { Row, Col, Form } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import ethers from 'ethers';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Notification from 'components/Notification';
import Heading from 'components/ui/Heading';
import Button from 'components/ui/Button';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../../ui/Modal';

import {
  WarningPoint,
  SeedText,
  WrapperDiv,
  FinishButton,
  WarningList,
  CenterWrapper,
  StyledSpin,
} from './AddWallet.style';
import { FinalHeader } from '../../ImportWalletSteps/ImportWalletForm.style';

/**
 * This component shows form  to add a wallet.
 */

class AddWallet extends React.PureComponent {
  constructor(props) {
    super(props);
    const mnemonic = ethers.HDNode.entropyToMnemonic(
      ethers.utils.randomBytes(16)
    );
    this.state = {
      mnemonic: mnemonic.toString(),
      derivationPath: 'm/44\'/60\'/0\'/0/0',
      confirmPasswordsMatch: false,
    };
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({
      confirmPasswordsMatch: this.state.confirmPasswordsMatch || !!value,
    });
  }
  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    const { formatMessage } = this.props.intl;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'password_notmatch' }));
    } else {
      callback();
    }
  }
  validateToNextPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmPasswordsMatch) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const value = values;
        value.mnemonic = this.state.mnemonic;
        value.derivationPath = this.state.derivationPath;
        this.props.handleSubmit(value);
      }
    });
  }
  showNotification() {
    const { formatMessage } = this.props.intl;
    const success = true;
    const message = formatMessage({ id: 'mnemonic_clipboard' });
    Notification(success, message);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <div>
        <Row justify="center" type="flex">
          <Col span={18}>
            <Form
              onSubmit={this.handleSubmit}
              disabled
              style={{
                marginTop: '2rem',
              }}
            >
              <FinalHeader>
                <Heading large>{formatMessage({ id: 'create_new_wallet' })}</Heading>
              </FinalHeader>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>{formatMessage({ id: 'enter_wallet_name' })}</ModalFormLabel>}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'please_enter_wallet_name' }),
                    },
                  ],
                })(<ModalFormInput disabled={loading} />)}
              </ModalFormItem>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>{formatMessage({ id: 'enter_wallet_password' })}</ModalFormLabel>}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
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
                colon={false}
                label={<ModalFormLabel>{formatMessage({ id: 'repeat_password' })}</ModalFormLabel>}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'confirm_password' }),
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <ModalFormInput
                    type="password"
                    onBlur={this.handleConfirmBlur}
                    disabled={loading}
                  />
                )}
              </ModalFormItem>
              <ModalFormItem colon={false}>
                <WarningList>
                  <WarningPoint>{formatMessage({ id: 'wallet_mnemonic_phrase_warning_1' })}</WarningPoint>
                  <WarningPoint>{formatMessage({ id: 'wallet_mnemonic_phrase_warning_2' })}</WarningPoint>
                  <WarningPoint>{formatMessage({ id: 'wallet_mnemonic_phrase_warning_3' })}</WarningPoint>
                  <WarningPoint>{formatMessage({ id: 'wallet_mnemonic_phrase_warning_4' })}</WarningPoint>
                </WarningList>
              </ModalFormItem>
              <ModalFormItem colon={false}>
                <CopyToClipboard text={this.state.mnemonic}>
                  <WrapperDiv>
                    <SeedText large>{this.state.mnemonic}</SeedText>
                    <Button
                      type="icon"
                      icon="copy"
                      size={'small'}
                      onClick={this.showNotification}
                      key={2}
                    />
                  </WrapperDiv>
                </CopyToClipboard>
              </ModalFormItem>
              <CenterWrapper>
                {loading ? (
                  <StyledSpin
                    delay={0}
                    size="large"
                  />
                ) : (
                  <FinishButton type="primary" htmlType="submit">
                    {formatMessage({ id: 'create_wallet' })}
                  </FinishButton>
                )}
              </CenterWrapper>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
AddWallet.propTypes = {
  /**
   *  callback  function,  triggered when formissuccessfully submitted.
   */
  handleSubmit: PropTypes.func,

  /**
   * This prop is passed by  Form component to  use  validation.
   */
  form: PropTypes.object,

  /**
   * loading
   */

  loading: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default Form.create()(injectIntl(AddWallet));
