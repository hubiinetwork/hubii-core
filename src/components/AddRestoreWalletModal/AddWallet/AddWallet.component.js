import * as React from 'react';
import { Row, Col, Form } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import ethers from 'ethers';
import PropTypes from 'prop-types';
import Notification from '../../Notification';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../../ui/Modal';

import {
  WarningPoint,
  SeedText,
  WrapperDiv,
  RoundButton,
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
    if (value && value !== form.getFieldValue('password')) {
      callback('The two passwords don\'t match');
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
    const success = true;
    const message = 'Mnemonic phrase copied to clipboard';
    Notification(success, message);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
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
                <p>Creating a new wallet</p>
              </FinalHeader>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Enter a name for your wallet</ModalFormLabel>}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter a name for your wallet',
                    },
                  ],
                })(<ModalFormInput disabled={loading} />)}
              </ModalFormItem>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Enter a password to secure your wallet</ModalFormLabel>}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
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
                colon={false}
                label={<ModalFormLabel>Repeat password</ModalFormLabel>}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm your password',
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
                  <WarningPoint>Write down the mnemonic phrase below and store it somewhere safe, it is the key to your wallet. If you lose the phrase any funds in your wallet will be lost forever!</WarningPoint>
                  <WarningPoint>Never share the phrase with anybody. Possession of this phrase means possession of all of your funds.</WarningPoint>
                  <WarningPoint>If you wish to store any significant amount of funds, it is strongly recommended to use a hardware wallet. Hardware wallets are a much safer alternative to software wallets.</WarningPoint>
                  <WarningPoint>{"Confused? Google search 'Ethereum wallet security' and do some research. Only you are responsible for your funds."}</WarningPoint>
                </WarningList>
              </ModalFormItem>
              <ModalFormItem colon={false}>
                <CopyToClipboard text={this.state.mnemonic}>
                  <WrapperDiv>
                    <SeedText>{this.state.mnemonic}</SeedText>
                    <RoundButton
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
                    Create wallet
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
};

export default Form.create()(AddWallet);
