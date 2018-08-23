import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
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
    this.validateInUse = this.validateInUse.bind(this);
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

  validateInUse(rule, value, callback) {
    const { contacts } = this.props;
    const sameAddressList = contacts.filter((person) => person.address === value.trim());
    if (sameAddressList.length && value.trim() !== this.props.address) {
      callback('You have already saved this address');
    }
    callback();
  }

  validateInvalid(rule, value, callback) {
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
            Please be sure that all the information is correct. Once a
            transaction is made, it can not be changed.
          </Text>
        </WrapperIcon>
        <Form layout="vertical" onSubmit={this.handleEdit}>
          <ModalFormItem label={<ModalFormLabel>Name</ModalFormLabel>}>
            {getFieldDecorator('name', {
              rules: [
                {
                  message: 'Name is required.',
                  required: true,
                },
              ],
              initialValue: this.props.name,
            })(<ModalFormInput placeholder="John Doe" />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Valid Ethereum Address</ModalFormLabel>}
          >
            {getFieldDecorator('address', {
              rules: [
                {
                  message: 'Address is required.',
                  required: true,
                },
                {
                  message: 'Address is invalid.',
                  required: true,
                  validator: (rule, value, callback) => this.validateInvalid(rule, value, callback),
                },
                {
                  message: 'This address is already under use',
                  required: true,
                  validator: (rule, value, callback) => this.validateInUse(rule, value, callback),
                },
              ],
              initialValue: this.props.address || quickAddAddress,
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
              <Icon type="plus" />
              {confirmText}
            </StyledButton1>
          </ParentDiv>
        </Form>
      </Wrapper>
    );
  }
}
EditContactModal.propTypes = {
  /**
   * Name of contact.
   */
  name: PropTypes.string,
  /**
   * Address of contact.
   */
  address: PropTypes.string,
  /**
   * Function to be executed when edit button is pressed
   */
  onEdit: PropTypes.func,

  form: PropTypes.object,
  /**
   * Contacts array
   */
  contacts: PropTypes.arrayOf(PropTypes.object),

  confirmText: PropTypes.string.isRequired,

  quickAddAddress: PropTypes.string,
};

export default Form.create()(EditContactModal);

