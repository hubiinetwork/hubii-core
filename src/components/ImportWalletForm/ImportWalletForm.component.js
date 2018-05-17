import * as React from 'react';
import { Form, Icon } from 'antd';
import {
  Flex,
  Between,
  IconDiv,
  LeftArrow,
  CreateButton
} from './ImportWalletForm.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';
class ImportWalletForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow type="arrow-left" />
            <span>Importing Ledger Wallet</span>
          </Flex>
          <div>
            <CreateButton>
              <Icon type="plus" />Create new wallet
            </CreateButton>
          </div>
        </Between>
        <IconDiv>
          <img src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </IconDiv>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <ModalFormItem
            label={
              <ModalFormLabel>Enter your Ledger Wallet Address</ModalFormLabel>
            }
          >
            {getFieldDecorator('Address', {
              rules: [
                {
                  message: 'Address is required.',
                  required: true
                }
              ]
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Enter your Wallet Key</ModalFormLabel>}
          >
            {getFieldDecorator('key', {
              rules: [
                {
                  message: 'key is required.',
                  required: true
                }
              ]
            })(<ModalFormInput />)}
          </ModalFormItem>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ImportWalletForm);
