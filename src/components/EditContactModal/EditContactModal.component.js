import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
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

class EditContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.validateEdit = this.validateEdit.bind(this);
    this.state = {
      oldName: null,
      oldAddress: null,
    };

    this.validateEdit = this.validateEdit.bind(this);
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

  validateEdit(rule, value, callback) {
    const { validateEdit } = this.props;
    const error = validateEdit(value, this.state.oldAddress);
    if (error) {
      callback('You have already saved this address');
    } else {
      callback();
    }
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
            })(<ModalFormInput onChange={(e) => onChange(e, 'name')} />)}
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
                  message: 'This address is already under use',
                  required: true,
                  validator: (rule, value, callback) => this.validateEdit(rule, value, callback),
                },
              ],
              initialValue: this.props.address,
            })(<ModalFormInput onChange={(e) => onChange(e, 'address')} />)}
          </ModalFormItem>
          <ParentDiv>
            <StyledButton1
              type="primary"
              htmlType="submit"
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
  /** Name of contact. */
  name: PropTypes.string.isRequired,
  /** Address of contact. */
  address: PropTypes.string.isRequired,
  /** Function to be executed when edit button is pressed */
  onEdit: PropTypes.func,
  form: PropTypes.object,
  /** Function to be executed when input is changed */
  onChange: PropTypes.func,
  /** Function which  validates Input */
  validateEdit: PropTypes.func,
};

export default Form.create()(EditContactModal);
