import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Button } from 'antd';
import {
  Flex,
  Image,
  Between,
  IconDiv,
  LeftArrow,
  StyledTitle,
  WidthEighty,
  CreateButton,
  StyledModalFormLabel,
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
      if (handleNext) {
        handleNext(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { wallet, handleBack, handleNext } = this.props;
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow
              type="arrow-left"
            />
            <StyledTitle>
              Importing {wallet.value} Wallet
            </StyledTitle>
          </Flex>
          <div>
            <CreateButton>
              <Icon type="plus" />Create new wallet
            </CreateButton>
          </div>
        </Between>
        <IconDiv>
          <Image src={wallet.src} />
        </IconDiv>
        <Form
          onSubmit={handleNext}

        >
          <WidthEighty>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Enter your {wallet.value} Wallet Address
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
              <Button type="primary" onClick={handleBack}>
            Back
          </Button>
              <Button type="primary" htmlType="submit">
            Next
          </Button>
            </ModalFormItem>
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
