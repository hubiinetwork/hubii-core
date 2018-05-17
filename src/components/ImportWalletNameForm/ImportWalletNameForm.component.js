import * as React from 'react';
import { Form, Icon } from 'antd';
import {
  Flex,
  Between,
  IconDiv,
  LeftArrow,
  CreateButton
} from './ImportWalletNameForm.style';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';
class ImportWalletNameForm extends React.Component {
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
            label={<ModalFormLabel>Give your Wallet a Name</ModalFormLabel>}
          >
            {getFieldDecorator('Name', {
              rules: [
                {
                  message: 'Name is required.',
                  required: true
                }
              ]
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Set a password</ModalFormLabel>}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  message: 'password is required.',
                  required: true
                }
              ]
            })(<ModalFormInput />)}
          </ModalFormItem>
          <ModalFormItem
            label={<ModalFormLabel>Repeat password</ModalFormLabel>}
          >
            {getFieldDecorator('repeatPassword', {
              rules: [
                {
                  message: 'Repeat password is required.',
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
export default Form.create()(ImportWalletNameForm);
