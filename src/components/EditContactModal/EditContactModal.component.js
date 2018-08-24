import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { IsAddressMatch } from 'utils/wallet';
import { isValidAddress } from 'ethereumjs-util';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton1,
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
    const { contacts } = this.props;
    if (!value) { callback(); return; } // no address input
    const sameAddressList = contacts.filter((person) => IsAddressMatch(person.address, value.trim()));
    if (sameAddressList.length && !IsAddressMatch(value.trim(), this.props.initialAddress)) {
      callback('You have already saved this address');
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
    if (!value) { callback(); return; } // no address input
    if (!isValidAddress(value.trim())) {
      callback('invalid Address');
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { confirmText, quickAddAddress } = this.props;
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
Please ensure that all information is correct. Funds sent to an incorrect address are lost forever.
          </Text>
        </WrapperIcon>
        <Form layout="vertical" onSubmit={this.handleEdit}>
          <ModalFormItem label={<ModalFormLabel>Contact name</ModalFormLabel>}>
            {getFieldDecorator('name', {
              rules: [
                {
                  message: 'Please enter a name for the contact',
                  required: true,
                },
                {
                  message: 'A contact with that name already exists',
                  required: true,
                  validator: (rule, value, callback) => this.validateNameInUse(rule, value, callback),
                },
              ],
              initialValue: this.props.initialName,
            })(<ModalFormInput placeholder="John Doe" />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Contact address</ModalFormLabel>}
          >
            {getFieldDecorator('address', {
              rules: [
                {
                  message: 'Please enter an address for the contact',
                  required: true,
                },
                {
                  message: "Sorry, that address isn't valid",
                  required: true,
                  validator: (rule, value, callback) => this.validateInvalid(rule, value, callback),
                },
                {
                  message: 'A contact with that address already exists',
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
            <StyledButton1
              type="primary"
              htmlType="submit"
              id="button"
            >
              {confirmText}
            </StyledButton1>
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

export default Form.create()(EditContactModal);

