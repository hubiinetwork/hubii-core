import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton,
  ParentDiv,
} from './style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';
/**
 * Modal component for editing a wallet.
 */

export class EditWalletModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
  }


  handleEdit(e) {
    const { onEdit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        onEdit({ name: value.name.trim() });
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    const { formatMessage } = intl;
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
            {formatMessage({ id: 'edit_wallet' })}
          </Text>
        </WrapperIcon>
        <Form layout="vertical" onSubmit={this.handleEdit}>
          <ModalFormItem label={<ModalFormLabel>{formatMessage({ id: 'name' })}</ModalFormLabel>}>
            {getFieldDecorator('name', {
              rules: [
                {
                  message: formatMessage({ id: 'enter_wallet_name' }),
                  required: true,
                },
                {
                  max: 25,
                  message: formatMessage({ id: 'wallet_name_max25_error' }),
                },
              ],
              initialValue: this.props.initialName,
            })(<ModalFormInput placeholder="Wallet name" />)}
          </ModalFormItem>
          <ParentDiv>
            <StyledButton
              type="primary"
              htmlType="submit"
              id="button"
            >
              {formatMessage({ id: 'confirm' })}
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

EditWalletModal.defaultProps = {
  initialName: '',
};

EditWalletModal.propTypes = {
  initialName: PropTypes.string,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default Form.create()(injectIntl(EditWalletModal));

