import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton,
  ButtonWrapper,
} from './AddNewContactModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

/**
 * This component is used to add a new contact in ContactBook.
 */

class AddNewContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateAddress = this.validateField.bind(this);
  }

  validateField(rule, value, callback) {
    const { contacts } = this.props;
    // can add more validation for name if required
    if (rule.field === 'address') {
      const sameAddressList = contacts.filter((person) => person.address === value.trim());
      if (sameAddressList.length) {
        callback('You have already saved this address');
      }
    }
    callback();
  }

  handleSubmit(e) {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        onSubmit({ address: value.address.trim(), name: value.name.trim() });
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
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <ModalFormItem label={<ModalFormLabel>Name</ModalFormLabel>}>
            {getFieldDecorator('name', {
              rules: [
                {
                  message: 'Name is required.',
                  required: true,
                  whitespace: true,
                },
              ],
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
                  whitespace: true,
                },
                {
                  message: 'Address is already in use.',
                  required: true,
                  validator: (rule, value, callback) => this.validateField(rule, value, callback),
                },
              ],
            })(
              <ModalFormInput
                type="textarea"
                placeholder="Enter a valid ethereum address"
              />
            )}
          </ModalFormItem>
          <ButtonWrapper>
            <StyledButton type="primary" htmlType="submit">
              <Icon type="plus" />
              Add New Contact
            </StyledButton>
          </ButtonWrapper>
        </Form>
      </Wrapper>
    );
  }
}
AddNewContactModal.propTypes = {
  /**
   * function to handle onSubmit.
   */
  onSubmit: PropTypes.func,
  form: PropTypes.object,
  contacts: PropTypes.arrayOf(PropTypes.object),
};

export default Form.create()(AddNewContactModal);
