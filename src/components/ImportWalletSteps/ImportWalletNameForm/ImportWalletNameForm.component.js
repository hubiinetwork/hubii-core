/* eslint-disable */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { handleFinish } from 'utils/forms';
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
  FormItem,
  StyledSpin,
} from '../ImportWalletForm.style';
class ImportWalletNameForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form, handleNext, handleBack, loading } = this.props;
    return (
      <div>
        <IconDiv>
          <Image src={this.props.wallet.src} />
        </IconDiv>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext)}
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
            {loading ?
              (
                <ButtonDiv loading={loading}>
                  <StyledSpin
                  delay={0}
                  tip="Importing Wallet..."
                  size="large"
                  />
                </ButtonDiv>
              ) 
              :
              (
                <ButtonDiv>
                  <StyledBackButton type={"primary"} onClick={this.props.handleBack}>
                    <StyledSpan>Back</StyledSpan>
                  </StyledBackButton>
                  <StyledButton type={"primary"} htmlType="submit">
                    <StyledSpan>Finish</StyledSpan>
                  </StyledButton>
                </ButtonDiv>
              )
            }
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
  /**
   * loading
   */
  loading: PropTypes.bool.isRequired,
};

export default Form.create()(ImportWalletNameForm);
