import * as React from 'react';
import { Row, Col, Form, Popover, Spin } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import ethers from 'ethers';
import PropTypes from 'prop-types';
import {
  Info,
  Loading,
  SeedInfo,
  SeedText,
  WrapperDiv,
  InfoContent,
  RoundButton,
  FinishButton,
  SeedWrapper,
  CenterWrapper,
  HBT,
  HBTtext,
} from './AddWallet.style';
import Notification from '../../Notification';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../../ui/Modal';
/**
 * This component shows form  to add a  wallet..
 */

class AddWallet extends React.PureComponent {
  constructor(props) {
    super(props);
    const mnemonic = ethers.HDNode.entropyToMnemonic(
      ethers.utils.randomBytes(16)
    );
    this.state = {
      mnemonic: mnemonic.toString(),
      confirmPasswordsMatch: false,
    };
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmPasswordsMatch: this.state.confirmPasswordsMatch || !!value,
    });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('The passwords do not match!');
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmPasswordsMatch) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.mnemonic = this.state.mnemonic;
        this.props.handleSubmit(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <CenterWrapper>
          <HBT src="public/asset_images/HBT.svg" alt="hubii logo" />
          <HBTtext>Hubii</HBTtext>
        </CenterWrapper>
        <Row justify="center" type="flex">
          <Col span={18}>
            <Form onSubmit={this.handleSubmit}>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Give your wallet a Name</ModalFormLabel>}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your wallet name.',
                    },
                  ],
                })(<ModalFormInput />)}
              </ModalFormItem>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Set a Password</ModalFormLabel>}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your password!',
                    },
                    {
                      min: 6,
                      message: 'The required minimum is 6 characters.',
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<ModalFormInput type="password" />)}
              </ModalFormItem>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Repeat Password</ModalFormLabel>}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <ModalFormInput
                    type="password"
                    onBlur={this.handleConfirmBlur}
                  />
                )}
              </ModalFormItem>
              <ModalFormItem colon={false}>
                <SeedWrapper>
                  <SeedInfo>Save these Seed Words somewhere safe</SeedInfo>
                  <Popover
                    overlayStyle={{ width: 270 }}
                    content={
                      <InfoContent>
                        If your computer breaks, you'll be able to use this
                        phrase to restore your wallet.
                      </InfoContent>
                    }
                  >
                    <Info type="info-circle-o" />
                  </Popover>
                </SeedWrapper>
              </ModalFormItem>
              <ModalFormItem colon={false}>
                <SeedWrapper>
                  <CopyToClipboard text={this.state.mnemonic}>
                    <WrapperDiv>
                      <SeedText>{this.state.mnemonic}</SeedText>
                      <RoundButton
                        type="primary"
                        shape="circle"
                        icon="copy"
                        size={'small'}
                        onClick={this.showNotification}
                        key={2}
                      />
                    </WrapperDiv>
                  </CopyToClipboard>
                </SeedWrapper>
              </ModalFormItem>
              <CenterWrapper>
                {this.props.loading ? (
                  <Spin indicator={<Loading type="loading" />} delay={2000} />
                ) : (
                  <FinishButton type="primary" htmlType="submit">
                    Finish
                  </FinishButton>
                )}
              </CenterWrapper>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
  showNotification = () => {
    const success = true;
    const message = 'Seed words copied to clipboard.';
    Notification(success, message);
  };
}
AddWallet.propTypes = {
  /**
   * loading state of the component.
   */
  loading: PropTypes.bool,
  /**
   *  callback  function,  triggered when formissuccessfully submitted.
   */
  handleSubmit: PropTypes.func,

  /**
   * This prop is passed by  Form component to  use  validation.
   */
  form: PropTypes.object,
};

export default Form.create()(AddWallet);
