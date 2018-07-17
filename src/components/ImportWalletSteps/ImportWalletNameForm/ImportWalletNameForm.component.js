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
  FormInput,
  FormItem
} from './ImportWalletNameForm.style';
class ImportWalletNameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleFinish = this.handleFinish.bind(this);
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
    const { handleBack } = this.props;
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
            <FormItem
              label={
                <StyledModalFormLabel>
                  Enter Wallet Name
                </StyledModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: 'Name is required.',
                    required: true,
                  },
                ],
              })(<FormInput />)}
            </FormItem>
            <ButtonDiv>
              <StyledBackButton type={"primary"} onClick={handleBack}>
                <StyledSpan>Back</StyledSpan>
              </StyledBackButton>
              <StyledButton type={"primary"} htmlType="submit">
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
  wallet: PropTypes.object.isRequired,
  /**
   * Function to be executed when back button is pressed
   */
  handleBack: PropTypes.func.isRequired,
  /**
   * Function to be executed when next is clicked.
   */
  handleNext: PropTypes.func.isRequired,
    /**
   * ant design form
   */
  form: PropTypes.object,
};

export default Form.create()(ImportWalletNameForm);
