import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isValidAddress } from 'ethereumjs-util';
import { ModalFormInput, ModalFormItem, ModalFormLabel } from 'components/ui/Modal';
import Heading from 'components/ui/Heading';
import { handleFinish } from 'utils/forms';
import { getAbsolutePath } from 'utils/electron';
import {
  WidthEighty,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  StyledSpin,
  FinalHeader,
} from '../style';
import Text from '../../ui/Text';

class ImportWalletAddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.validateAddress = this.validateAddress.bind(this);
  }

  validateAddress(rule, value, callback) {
    const { formatMessage } = this.props.intl;
    if (!isValidAddress(value)) {
      callback(formatMessage({ id: 'invalid_address' }));
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form, handleNext, loading, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <div>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext)}
          layout="vertical"
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <WidthEighty>
            <FinalHeader>
              <Heading>{formatMessage({ id: 'import_from' })}</Heading>
              <img src={getAbsolutePath('public/images/private-key.png')} alt="import method icon" />
            </FinalHeader>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  {formatMessage({ id: 'enter_wallet_name' })}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: formatMessage({ id: 'please_enter_wallet_name' }),
                    required: true,
                    whitespace: true,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  {formatMessage({ id: 'enter_wallet_address' })}
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('address', {
                rules: [
                  {
                    message: formatMessage({ id: 'please_enter_wallet_address' }),
                    required: true,
                    whitespace: true,
                  },
                  {
                    validator: this.validateAddress,
                  },
                ],
              })(<ModalFormInput disabled={loading} />)}
            </ModalFormItem>
            {loading ?
              (
                <ButtonDiv loading={loading}>
                  <StyledSpin
                    delay={0}
                    size="large"
                  />
                </ButtonDiv>
              )
              :
              (
                <ButtonDiv>
                  <StyledBackButton type="default" onClick={this.props.handleBack}>
                    <Text>{formatMessage({ id: 'back' })}</Text>
                  </StyledBackButton>
                  <StyledButton type="primary" htmlType="submit">
                    <Text>{formatMessage({ id: 'import_wallet' })}</Text>
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

ImportWalletAddressForm.propTypes = {
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
  intl: PropTypes.object,
};

export default Form.create()(injectIntl(ImportWalletAddressForm));
