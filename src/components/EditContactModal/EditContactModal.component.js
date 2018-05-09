import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton1,
  StyledButton2,
  ParentDiv
} from './EditContactModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

/**
 * Modal component for editing a contact.
 */

class EditContactModal extends React.Component {
  handleEdit = e => {
    const self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.props.onEdit(values);
      }
    });
  };
  handleDelete = e => {
    const self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.props.onDelete(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
            Please be sure that all the information is correct. Once a
            transaction is made, it can not be changed.
          </Text>
        </WrapperIcon>
        <Form layout="vertical">
          <ModalFormItem label={<ModalFormLabel>Name</ModalFormLabel>}>
            {getFieldDecorator('Name', {
              rules: [
                {
                  message: 'Name is required.',
                  required: true
                }
              ],
              initialValue: this.props.name
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Valid Ethereum Address</ModalFormLabel>}
          >
            {getFieldDecorator('Valid Ethereum Address', {
              rules: [
                {
                  message: 'Address is required.',
                  required: true
                }
              ],
              initialValue: this.props.address
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ParentDiv>
            <StyledButton1
              type="primary"
              htmlType="submit"
              onClick={this.handleEdit}
            >
              <Icon type="plus" />
              Delete Contact
            </StyledButton1>
            <StyledButton2
              type="primary"
              htmlType="submit"
              onClick={this.handleDelete}
            >
              <Icon type="plus" />
              Edit Contact
            </StyledButton2>
          </ParentDiv>
        </Form>
      </Wrapper>
    );
  }
}
EditContactModal.propTypes = {
  /**
   * Name of the contact.
   */
  name: PropTypes.string.isRequired,
  /**
   * Address of the contact.
   */
  address: PropTypes.string.isRequired,
  /**
   * Callback function to be called when Button is pressed.
   */
  onSubmit: PropTypes.func
};

export default Form.create()(EditContactModal);
