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
  ButtonDiv,
  StyledSpan,
  StyledButton,
  StyledBackButton,
} from './ImportWalletNameForm.style';
import { ModalFormInput, ModalFormItem } from '../../ui/Modal';
class ImportWalletNameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
  }
  handleBack() {
    const { handleBack } = this.props;
    if (handleBack) {
      handleBack();
    }
  }

  handleFinish(e) {
    // console.log('eeeeeeeeeeeeeee');
    const { form, handleFinish } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      // console.log('here', err, values);
      if (handleFinish) {
        // console.log('eeeeeeeeeeeeeee', err);
        // console.log('ffffffffffffff', values);
        handleFinish(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow
              type="arrow-left"
              onClick={this.handleBack}
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
          onSubmit={this.handleFinish}
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
            <ButtonDiv>
              <StyledBackButton onClick={this.handleBack}>
                <StyledSpan>Back</StyledSpan>
              </StyledBackButton>
              <StyledButton htmlType="submit">
                <StyledSpan>Finish</StyledSpan>
              </StyledButton>
            </ButtonDiv>
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
  /**
   * Function to be executed when back button is pressed
   */
  handleBack: PropTypes.func,
  /**
   * Function to be executed when next is clicked.
   */
  handleFinish: PropTypes.func,
    /**
   * ant design form function
   */
  form: PropTypes.func,
};

export default Form.create()(ImportWalletNameForm);
