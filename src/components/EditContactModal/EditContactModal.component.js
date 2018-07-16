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
    this.state = {
      oldName: null,
      oldAddress: null,
    };

    this.validateField = this.validateField.bind(this);
  }

  componentWillMount() {
    const { name, address } = this.props;
    this.setState({
      oldName: name,
      oldAddress: address,
    });
  }

  handleEdit(e) {
    const { onEdit } = this.props;
    const { oldName, oldAddress } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        onEdit({ name: oldName, address: oldAddress });
      }
    });
  }

  validateField(rule, checkType, value, callback) {
    const { contacts } = this.props;
    // can add more validation for name if required
    if (rule.field === 'address') {
      if (checkType === 'inuse') {
        const sameAddressList = contacts.filter((person) => person.address === value.trim());
        if (sameAddressList.length && value.trim() !== this.state.oldAddress) {
          callback('You have already saved this address');
        }
      }
      if (checkType === 'invalid') {
        if (!isValidAddress(value.trim())) {
          callback('invalid Address');
        }
      }
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { onChange } = this.props;
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
            })(<ModalFormInput onChange={(e) => onChange(e.target.value, 'name')} />)}
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
                  validator: (rule, value, callback) => this.validateField(rule, 'invalid', value, callback),
                },
                {
                  message: 'This address is already under use',
                  required: true,
                  validator: (rule, value, callback) => this.validateField(rule, 'inuse', value, callback),
                },
              ],
              initialValue: this.props.address,
            })(<ModalFormInput onChange={(e) => onChange(e.target.value, 'address')} />)}
          </ModalFormItem>
          <ParentDiv>
            <StyledButton1
              type="primary"
              htmlType="submit"
              id="button"
            >
              <Icon type="plus" />
              Edit Contact
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
   * Function to be executed when input is changed
   */
  onChange: PropTypes.func,
  /**
   * Contacts array
   */
  contacts: PropTypes.arrayOf(PropTypes.object),
};

export default Form.create()(EditContactModal);

