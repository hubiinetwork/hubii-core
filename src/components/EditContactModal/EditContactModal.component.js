import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton1,
  StyledButton2,
  ParentDiv,
} from './EditContactModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

/**
 * Modal component for editing a contact.
 */

class EditContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleEdit(e) {
    e.preventDefault();
    const { onEdit } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onEdit(values);
      }
    });
  }
  handleDelete(e) {
    e.preventDefault();
    const { onDelete } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onDelete(values);
      }
    });
  }
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
            {getFieldDecorator('name', {
              rules: [
                {
                  message: 'Name is required.',
                  required: true,
                },
              ],
              initialValue: this.props.name,
            })(<ModalFormInput />)}
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
              ],
              initialValue: this.props.address,
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ParentDiv>
            <StyledButton1
              type="primary"
              htmlType="submit"
              onClick={this.handleDelete}
            >
              <Icon type="plus" />
              Delete Contact
            </StyledButton1>
            <StyledButton2
              type="primary"
              htmlType="submit"
              onClick={this.handleEdit}
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
  /** Name of contact. */
  name: PropTypes.string.isRequired,
  /** Address of contact. */
  address: PropTypes.string.isRequired,
  /** Function to be executed when edit button is pressed */
  onEdit: PropTypes.func,
  /** Function to be executed when delete button is pressed */
  onDelete: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create()(EditContactModal);
