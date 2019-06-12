import { remote } from 'electron';
import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from 'components/ui/Modal';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton,
  ParentDiv,
} from './style';
/**
 * Modal component for exporting a wallet.
 */

export class ExportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filePath: null, password: null };
    this.handleExport = this.handleExport.bind(this);
    this.handleSetFilePath = this.handleSetFilePath.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
  }

  handleSetFilePath() {
    const { dialog } = remote;
    dialog.showSaveDialog((filePath) => {
      if (!filePath) {
        this.setState({ filePath: null });
        return;
      }
      this.setState({ filePath });
    });
  }

  handleExport(e) {
    const { onExport } = this.props;
    const { filePath } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        onExport({ password: value.password, filePath });
      }
    });
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    const { filePath } = this.state;
    const { formatMessage } = intl;
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
            {formatMessage({ id: 'batch_export' })}
          </Text>
        </WrapperIcon>
        <Form layout="vertical" onSubmit={this.handleExport}>
          <ModalFormItem label={<ModalFormLabel>{formatMessage({ id: 'enter_backup_encrypt_password' })}</ModalFormLabel>}>
            {getFieldDecorator('password', {
              rules: [
                {
                  message: formatMessage({ id: 'enter_backup_encrypt_password' }),
                  required: true,
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(
              <ModalFormInput
                type="password"
              />
            )}
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
              />
            )}
          </ModalFormItem>
          <ModalFormItem
            label={
              <ModalFormLabel>
                {filePath}
              </ModalFormLabel>
            }
          >
            <StyledButton onClick={this.handleSetFilePath} style={{ width: '100%' }}>
              <Text>{formatMessage({ id: 'enter_backup_file_name' })}</Text>
            </StyledButton>
          </ModalFormItem>
          <ParentDiv>
            <StyledButton
              type="primary"
              htmlType="submit"
              id="button"
              disabled={!filePath}
            >
              {formatMessage({ id: 'export' })}
            </StyledButton>
            <StyledButton
              type="default"
              onClick={this.props.onCancel}
              id="cancel"
              style={{ marginLeft: '2rem' }}
            >
              {formatMessage({ id: 'cancel' })}
            </StyledButton>
          </ParentDiv>
        </Form>
      </Wrapper>
    );
  }
}

ExportModal.propTypes = {
  onExport: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default Form.create()(injectIntl(ExportModal));

