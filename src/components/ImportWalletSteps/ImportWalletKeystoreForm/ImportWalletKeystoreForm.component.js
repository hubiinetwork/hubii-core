import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ModalFormInput, ModalFormItem, ModalFormLabel } from 'components/ui/Modal';
import Heading from 'components/ui/Heading';
import Text from 'components/ui/Text';
import { handleFinish } from 'utils/forms';
import fs from 'fs';
import { remote } from 'electron';

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
    const { form, handleNext, loading } = this.props;
    const { keystore, filepath } = this.state;
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
              <Heading>Importing from a keystore file</Heading>
            </FinalHeader>
            <ModalFormItem
              label={
                <ModalFormLabel>
                  Enter a name for your wallet
                </ModalFormLabel>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    message: 'Please enter a name for your wallet',
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
                <Text>Select keystore file</Text>
              </StyledButton>
            </ModalFormItem>
            <ButtonDiv>
              <StyledBackButton type="default" onClick={this.props.handleBack}>
                <Text>Back</Text>
              </StyledBackButton>
              <StyledButton type="primary" disabled={!this.state.keystore} htmlType="submit">
                <Text>Import wallet</Text>
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
};

export default Form.create()(ImportWalletKeystoreForm);
