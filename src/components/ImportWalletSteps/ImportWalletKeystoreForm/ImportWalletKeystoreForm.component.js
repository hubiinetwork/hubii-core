import * as React from 'react';
import { remote } from 'electron';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { getAbsolutePath } from 'utils/electron';
import { handleFinish } from 'utils/forms';
import fs from 'fs';

import { ModalFormInput, ModalFormItem, ModalFormLabel } from 'components/ui/Modal';
import Heading from 'components/ui/Heading';
import Text from 'components/ui/Text';

import {
  WidthEighty,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  FinalHeader,
} from '../ImportWalletForm.style';

class ImportWalletKeystoreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keystore: null,
      filepath: null,
    };
    this.loadKeystoreFile = this.loadKeystoreFile.bind(this);
  }

  loadKeystoreFile() {
    const { dialog } = remote;
    dialog.showOpenDialog((filenames) => {
      if (!filenames || !filenames.length) {
        this.setState({ keystore: null, filepath: null });
        return;
      }
      const encryptedWallet = fs.readFileSync(filenames[0], 'utf8');
      this.setState({ keystore: encryptedWallet, filepath: filenames[0] });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form, handleNext, loading, intl } = this.props;
    const { keystore, filepath } = this.state;
    const { formatMessage } = intl;
    return (
      <div>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext, { keystore })}
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
              <img
                src={getAbsolutePath('public/images/keystore.png')}
                alt="import method icon"
                style={{ marginTop: '1rem' }}
              />
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
                  {filepath}
                </ModalFormLabel>
              }
            >
              <StyledButton onClick={this.loadKeystoreFile} style={{ width: '100%' }}>
                <Icon type="upload" />
                <Text>{formatMessage({ id: 'select_keystore' })}</Text>
              </StyledButton>
            </ModalFormItem>
            <ButtonDiv>
              <StyledBackButton type="default" onClick={this.props.handleBack}>
                <Text>{formatMessage({ id: 'back' })}</Text>
              </StyledBackButton>
              <StyledButton type="primary" disabled={!this.state.keystore} htmlType="submit">
                <Text>{formatMessage({ id: 'import_wallet' })}</Text>
              </StyledButton>
            </ButtonDiv>
          </WidthEighty>
        </Form>
      </div>
    );
  }
}

ImportWalletKeystoreForm.propTypes = {
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

export default Form.create()(injectIntl(ImportWalletKeystoreForm));
