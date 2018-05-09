import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton,
  ButtonWrapper
} from './AddNewContactModal.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

/**
 * This component is used to add a new contact in ContactBook.
 */

class AddNewContactModal extends React.Component {
  handleSubmit = e => {
    const self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.props.onSubmit(values);
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
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <ModalFormItem label={<ModalFormLabel>Name</ModalFormLabel>}>
            {getFieldDecorator('Name', {
              rules: [
                {
                  message: 'Name is required.',
                  required: true
                }
              ]
            })(<ModalFormInput placeholder="John Doe" />)}
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
              ]
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
  onSubmit: PropTypes.func
};

export default Form.create()(AddNewContactModal);
