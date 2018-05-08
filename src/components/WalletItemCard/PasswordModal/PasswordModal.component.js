import * as React from 'react';
import { Form, Icon } from 'antd';
import {
  Text,
  Result,
  Wrapper,
  InfoText,
  ErrorTitle,
  TextWrapper,
  WrapperIcon,
  StyledButton,
  JustifyCenter,
  ErrorDescription
} from './PasswordModal.style';
import { ModalFormItem, ModalFormLabel, ModalFormInput } from '../../ui/Modal';
import PropTypes from 'prop-types';

/**
 * PasswordModal component is used  when an item is clicked from WalletItemCard's setting cog
 */

class PasswordModal extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const description = this.props.description;
    const { loading, error } = this.props;
    return (
      <div>
        {!loading &&
          !error && (
            <Wrapper>
              <JustifyCenter>
                <WrapperIcon>
                  <Icon type="info-circle-o" />
                  <Text>{description}</Text>
                </WrapperIcon>
              </JustifyCenter>
              <JustifyCenter>
                <Form
                  onSubmit={this.handleSubmit}
                  layout="vertical"
                  style={{ flex: 1, maxWidth: '65%' }}
                >
                  <ModalFormItem
                    label={<ModalFormLabel>Wallet password</ModalFormLabel>}
                  >
                    {getFieldDecorator('WalletPassword', {
                      rules: [
                        {
                          message: 'WalletPassword is required.',
                          required: true
                        }
                      ]
                    })(<ModalFormInput type="password" />)}
                  </ModalFormItem>
                  <JustifyCenter>
                    <button type="primary" htmlType="submit">
                      {this.props.option === 'delete' ? 'Delete' : 'Export'}
                    </button>
                  </JustifyCenter>
                </Form>
              </JustifyCenter>
            </Wrapper>
          )}
        {loading && (
          <Wrapper>
            <JustifyCenter>
              <Result>
                <InfoText>{'Loading...'}</InfoText>
              </Result>
            </JustifyCenter>
          </Wrapper>
        )}
        {error && (
          <TextWrapper>
            <ErrorTitle>Oh, snap!</ErrorTitle>
            <ErrorDescription>Invalid password.</ErrorDescription>
          </TextWrapper>
        )}
      </div>
    );
  }
}
PasswordModal.propTypes = {
  /**
   * title to show on which modal is triggered.
   */
  title: PropTypes.string.isRequired,
  /**
   * description of the passwordModal.
   */
  description: PropTypes.string.isRequired,
  /**
   * option to decide label of the button.
   */
  option: PropTypes.oneOf(['seed', 'private', 'delete']).isRequired
};

export default Form.create()(PasswordModal);
