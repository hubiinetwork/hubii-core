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

export class DecryptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filePath: null, password: null };
    this.handleDecrypt = this.handleDecrypt.bind(this);
    this.handleSetFilePath = this.handleSetFilePath.bind(this);
  }

  handleSetFilePath() {
    const { dialog } = remote;
    dialog.showOpenDialog((filenames) => {
      if (!filenames || filenames.length === 0) {
        this.setState({ filePath: null });
        return;
      }
      this.setState({ filePath: filenames[0] });
    });
  }

  handleDecrypt(e) {
    const { onDecrypt } = this.props;
    const { filePath } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        onDecrypt({ password: value.password, filePath });
      }
    });
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
            {formatMessage({ id: 'import_decrypt_info' })}
          </Text>
        </WrapperIcon>
        <Form layout="vertical" onSubmit={this.handleDecrypt}>
          <ModalFormItem label={<ModalFormLabel>{formatMessage({ id: 'decrypt_password' })}</ModalFormLabel>}>
            {getFieldDecorator('password', {
              rules: [
                {
                  message: formatMessage({ id: 'enter_backup_decrypt_password' }),
                  required: true,
                },
              ],
            })(<ModalFormInput />)}
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
              {formatMessage({ id: 'decrypt' })}
            </StyledButton>
          </ParentDiv>
        </Form>
      </Wrapper>
    );
  }
}

DecryptForm.propTypes = {
  onDecrypt: PropTypes.func,
  form: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default Form.create()(injectIntl(DecryptForm));

