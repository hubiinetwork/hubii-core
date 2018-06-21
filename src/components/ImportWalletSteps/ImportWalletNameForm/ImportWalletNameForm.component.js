import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon } from 'antd';
import {
  Flex,
  Image,
  Between,
  IconDiv,
  LeftArrow,
  WidthEighty,
  StyledTitle,
  CreateButton,
  StyledModalFormLabel,
} from './ImportWalletNameForm.style';
import { ModalFormInput, ModalFormItem } from '../../ui/Modal';
class ImportWalletNameForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow
              type="arrow-left"
            />
            <StyledTitle>
              Importing {this.props.wallet.value} Wallet
            </StyledTitle>
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
            alignItems: 'center',
          }}
        >
          <WidthEighty>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Give your Wallet a Name
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('Name', {
                rules: [
                  {
                    message: 'Name is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Set a password</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: 'password is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <StyledModalFormLabel>Repeat password</StyledModalFormLabel>
              }
            >
              {getFieldDecorator('repeatPassword', {
                rules: [
                  {
                    message: 'Repeat password is required.',
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
          </WidthEighty>
        </Form>
      </div>
    );
  }
}

ImportWalletNameForm.propTypes = {
  /**
   * Wallet object to be shown.
   */
  wallet: PropTypes.object,
  // /**
  //  * Function to be executed when back button is pressed
  //  */
  // handleBack: PropTypes.func,
  // /**
  //  * Function to be executed when next is clicked.
  //  */
  // handleNext: PropTypes.func,
    /**
   * ant design form function
   */
  form: PropTypes.func,
};

export default Form.create()(ImportWalletNameForm);
