import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
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
export class AddNewContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInUse = this.validateInUse.bind(this);
    this.validateInvalid = this.validateInvalid.bind(this);
  }

  validateInUse(rule, value, callback) {
    const { contacts } = this.props;
    const sameAddressList = contacts.filter((person) => person.address === value.trim());
    if (sameAddressList.length) {
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
    const { quickAddAddress } = this.props;
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
            Please ensure that all the information is correct.
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
              initialValue: quickAddAddress || '',
              rules: [
                {
                  message: 'Address is required.',
                  required: true,
                  whitespace: true,
                },
                {
                  message: 'Address is already in use.',
                  required: true,
                  validator: (rule, value, callback) => this.validateInUse(rule, value, callback),
                },
                {
                  message: 'Address is invalid.',
                  required: true,
                  validator: (rule, value, callback) => this.validateInvalid(rule, value, callback),
                },
              ],
            })(
              <ModalFormInput
                type="textarea"
                placeholder="Enter a valid ethereum address"
                disabled={!quickAddAddress}
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
   * Function to handle onSubmit.
   */
  onSubmit: PropTypes.func,
  /**
   * Form
   */
  form: PropTypes.object,
  /**
   * Contacts array
   */
  contacts: PropTypes.arrayOf(PropTypes.object),
  /**
   * quickAddAddress
   */
  quickAddAddress: PropTypes.string,
};

export default Form.create()(AddNewContactModal);
