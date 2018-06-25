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
} from './ImportWalletForm.style';
import { ModalFormInput, ModalFormItem } from '../../ui/Modal';
class ImportWalletForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    const { handleBack } = this.props;
    if (handleBack) {
      handleBack();
    }
  }

  handleNext(e) {
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
    const { wallet, handleBack } = this.props;
    return (
      <div>
        <IconDiv>
          <Image src={wallet.src} />
        </IconDiv>
        <Form
          onSubmit={this.handleNext}

        >
          <WidthEighty>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Enter your {wallet.name} Wallet Address
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('Address', {
                rules: [
                  {
                    message: 'Address is required.',
                    required: true,
                  },
                ],
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
                    required: true,
                  },
                ],
              })(<ModalFormInput />)}
            </ModalFormItem>
            <ButtonDiv>
              <StyledBackButton onClick={handleBack}>
                <StyledSpan>Back</StyledSpan>
              </StyledBackButton>
              <StyledButton htmlType="submit">
                <StyledSpan>Next</StyledSpan>
              </StyledButton>
            </ButtonDiv>
          </WidthEighty>
        </Form>
      </div>
    );
  }
}

ImportWalletForm.propTypes = {
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
   * ant design form function
   */
  form: PropTypes.func,
};

export default Form.create()(ImportWalletForm);
