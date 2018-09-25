import * as React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';

import { ModalFormInput, ModalFormItem } from 'components/ui/Modal';
import { handleFinish } from 'utils/forms';
import fs from 'fs';
import { remote } from 'electron';

import {
  WidthEighty,
  StyledModalFormLabel,
  ButtonDiv,
  StyledBackButton,
  StyledButton,
  StyledSpan,
  FinalHeader,
} from '../ImportWalletForm.style';

class ImportWalletKeystoneForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keystone: null,
      filepath: null,
    };
    this.loadKeystoneFile = this.loadKeystoneFile.bind(this);
  }

  loadKeystoneFile() {
    const { dialog } = remote;
    dialog.showOpenDialog((filenames) => {
      if (!filenames || !filenames.length) {
        this.setState({ keystone: null, filepath: null });
        return;
      }
      const encryptedWallet = fs.readFileSync(filenames[0], 'utf8');
      this.setState({ keystone: encryptedWallet, filepath: filenames[0] });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form, handleNext, loading } = this.props;
    const { keystone, filepath } = this.state;
    return (
      <div>
        <Form
          onSubmit={(e) => handleFinish(e, form, handleNext, { keystone })}
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
              <p>Importing from a keystone file</p>
            </FinalHeader>
            <ModalFormItem
              label={
                <StyledModalFormLabel>
                  Enter a name for your wallet
                </StyledModalFormLabel>
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
                <StyledModalFormLabel>
                  {filepath}
                </StyledModalFormLabel>
              }
            >
              <StyledButton onClick={this.loadKeystoneFile}>
                <StyledSpan>Keystone File</StyledSpan>
              </StyledButton>
            </ModalFormItem>
            <ButtonDiv>
              <StyledBackButton type="default" onClick={this.props.handleBack}>
                <StyledSpan>Back</StyledSpan>
              </StyledBackButton>
              <StyledButton type="primary" disabled={!this.state.keystone} htmlType="submit">
                <StyledSpan>Import wallet</StyledSpan>
              </StyledButton>
            </ButtonDiv>
          </WidthEighty>
        </Form>
      </div>
    );
  }
}

ImportWalletKeystoneForm.propTypes = {
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

export default Form.create()(ImportWalletKeystoneForm);
