/* eslint-disable */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import {
  Image,
  IconDiv,
  WidthEighty,
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
    const { form, handleNext } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err && handleNext) {
        handleNext(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
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
  handleNext: PropTypes.func,
    /**
   * ant design form
   */
  form: PropTypes.object,
};

export default Form.create()(ImportWalletNameForm);
