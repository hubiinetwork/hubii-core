import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isAddressMatch } from 'utils/wallet';
import { isValidAddress } from 'ethereumjs-util';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton,
  ParentDiv,
} from './EditContactModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';
/**
 * Modal component for editing a contact.
 */

export class EditContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.validateAddressInUse = this.validateAddressInUse.bind(this);
    this.validateNameInUse = this.validateNameInUse.bind(this);
    this.validateInvalid = this.validateInvalid.bind(this);
  }


  handleEdit(e) {
    const { onEdit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        onEdit({ address: value.address.trim(), name: value.name.trim() });
      }
    });
  }

  validateAddressInUse(rule, value, callback) {
    const { contacts, intl } = this.props;
    const {formatMessage} = intl
    if (!value) { callback(); return; } // no address input
    const sameAddressList = contacts.filter((person) => isAddressMatch(person.address, value.trim()));
    if (sameAddressList.length && !isAddressMatch(value.trim(), this.props.initialAddress)) {
      callback(formatMessage({id: 'contact_address_exist_error'}));
    }
    callback();
  }

  validateNameInUse(rule, value, callback) {
    const { contacts } = this.props;
    if (!value) { callback(); return; } // no name input
    const sameAddressList = contacts.filter((person) => person.name.toLowerCase() === value.trim().toLowerCase());
    if (sameAddressList.length && this.props.initialName.toLowerCase() !== value.trim().toLowerCase()) {
      callback(true);
    }
    callback();
  }

  validateInvalid(rule, value, callback) {
    const {formatMessage} = this.props.intl
    if (!value) { callback(); return; } // no address input
    if (!isValidAddress(value.trim())) {
      callback(formatMessage({id: 'invalid_address'}));
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { confirmText, quickAddAddress, intl } = this.props;
    const {formatMessage} = intl
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
            {formatMessage({id: 'contact_info_warning'})}
          </Text>
        </WrapperIcon>
        <Form layout="vertical" onSubmit={this.handleEdit}>
          <ModalFormItem label={<ModalFormLabel>{formatMessage({id: 'contact_name'})}</ModalFormLabel>}>
            {getFieldDecorator('name', {
              rules: [
                {
                  message: formatMessage({id: 'contact_enter_name'}),
                  required: true,
                },
                {
                  message: formatMessage({id: 'contact_name_exist_error'}),
                  required: true,
                  validator: (rule, value, callback) => this.validateNameInUse(rule, value, callback),
                },
                {
                  max: 25,
                  message: formatMessage({id: 'contact_name_max25_error'}),
                },
              ],
              initialValue: this.props.initialName,
            })(<ModalFormInput placeholder="John Doe" />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>{formatMessage({id: 'contact_address'})}</ModalFormLabel>}
          >
            {getFieldDecorator('address', {
              rules: [
                {
                  message: formatMessage({id: 'contact_enter_name'}),
                  required: true,
                },
                {
                  message: formatMessage({id: 'invalid_address'}),
                  required: true,
                  validator: (rule, value, callback) => this.validateInvalid(rule, value, callback),
                },
                {
                  message: formatMessage({id: 'contact_address_exist_error'}),
                  required: true,
                  validator: (rule, value, callback) => this.validateAddressInUse(rule, value, callback),
                },
              ],
              initialValue: this.props.initialAddress || quickAddAddress,
            })(
              <ModalFormInput
                type="textarea"
                disabled={!!quickAddAddress}
                placeholder="0xee1636e3eu1969b618ca9334b5baf8e3760ab16a"
              />
            )}
          </ModalFormItem>
          <ParentDiv>
            <StyledButton
              type="primary"
              htmlType="submit"
              id="button"
            >
              {confirmText}
            </StyledButton>
          </ParentDiv>
        </Form>
      </Wrapper>
    );
  }
}

EditContactModal.defaultProps = {
  initialName: '',
  initialAddress: '',
};

EditContactModal.propTypes = {
  initialName: PropTypes.string,
  initialAddress: PropTypes.string,
  onEdit: PropTypes.func,
  form: PropTypes.object,
  contacts: PropTypes.arrayOf(PropTypes.object),
  confirmText: PropTypes.string.isRequired,
  quickAddAddress: PropTypes.string,
};

export default Form.create()(injectIntl(EditContactModal));

