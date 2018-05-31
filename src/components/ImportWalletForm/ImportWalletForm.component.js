import * as React from 'react';
import { Form, Icon } from 'antd';
import {
  Flex,
  Image,
  Between,
  IconDiv,
  LeftArrow,
  WidthEighty,
  CreateButton,
  StyledModalFormLabel
} from './ImportWalletForm.style';
import { ModalFormInput, ModalFormItem } from '../ui/Modal';
class ImportWalletForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow
              type="arrow-left"
              onClick={() => console.log('onGoBack  func')}
            />
            <span>Importing {this.props.wallet.value} Wallet</span>
          </Flex>
          <div>
            <CreateButton>
              <Icon type="plus" />Create new wallet
            </CreateButton>
          </div>
        </Between>
        <IconDiv>
          <Image src={this.props.wallet.src} />
        </IconDiv>
        <Form
          onSubmit={this.handleSubmit}
          layout="vertical"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <WidthEighty>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Enter your {this.props.wallet.value} Wallet Address
                </StyledModalFormLabel>
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
              label={
                <StyledModalFormLabel>
                  Enter your Wallet Key
                </StyledModalFormLabel>
              }
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
          </WidthEighty>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ImportWalletForm);
