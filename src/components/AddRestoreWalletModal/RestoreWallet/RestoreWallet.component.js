import * as React from 'react';
import { Row, Col, Form, Spin } from 'antd';
import PropTypes from 'prop-types';
import { CenterWrapper, RestoreButton, Loading } from './RestoreWallet.style';
import {
  ModalFormLabel,
  ModalFormInput,
  ModalFormItem,
  ModalFormTextArea
} from '../../ui/Modal';
import ethers from 'ethers';

class RestoreWallet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmPasswordsMatch: false,
      done: false
    };
  }
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({
      confirmPasswordsMatch: this.state.confirmPasswordsMatch || !!value
    });
  };

  validateSeedWords = (rule, value, callback) => {
    if (value && !ethers.HDNode.isValidMnemonic(value)) {
      callback('The seed words are invalid!!');
    } else {
      callback();
    }
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row justify="center" type="flex">
          <Col span={18}>
            <Form onSubmit={this.handleSubmit}>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Wallet Name</ModalFormLabel>}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Wallet name is required.'
                    }
                  ]
                })(<ModalFormInput />)}
              </ModalFormItem>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Password</ModalFormLabel>}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your password.'
                    },
                    {
                      min: 6,
                      message: 'The required minimum is 6 characters.'
                    },
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
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
                      message: 'Please repeat your password.'
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(
                  <ModalFormInput
                    type="password"
                    onBlur={this.handleConfirmBlur}
                  />
                )}
              </ModalFormItem>
              <ModalFormItem
                colon={false}
                label={<ModalFormLabel>Seed Words</ModalFormLabel>}
              >
                {getFieldDecorator('mnemonic', {
                  rules: [
                    {
                      required: true,
                      message: 'Seed words are required.'
                    },
                    {
                      validator: this.validateSeedWords
                    }
                  ]
                })(<ModalFormTextArea rows={4} />)}
              </ModalFormItem>
              <CenterWrapper>
                {this.props.loading ? (
                  <Spin indicator={<Loading type="loading" />} />
                ) : (
                  <RestoreButton type="primary" htmlType="submit">
                    Restore
                  </RestoreButton>
                )}
              </CenterWrapper>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
RestoreWallet.propTypes = {
  loading: PropTypes.bool,
  handleSubmit: PropTypes.func,
  form: PropTypes.object
};

export default Form.create()(RestoreWallet);
