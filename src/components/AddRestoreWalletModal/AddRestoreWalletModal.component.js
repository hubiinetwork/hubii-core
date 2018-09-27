import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';

import Text from 'components/ui/Text';

import {
  StyledButton,
  StyledHeading,
  Arrow,
  IconWrapper,
  Container,
} from './AddRestoreWalletModal.style';
import { AddWallet } from './AddWallet';
import ImportWalletSteps from '../ImportWalletSteps';

/**
 * This component shows options for modals to be opened.
 */
export default class AddRestoreWalletModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalType: 'main',
    };
    this.switchModals = this.switchModals.bind(this);
  }
  switchModals(selectedType) {
    this.setState({ modalType: selectedType });
  }
  render() {
    const { modalType } = this.state;
    const { loading } = this.props;
    return (
      <div>
        {modalType === 'main' && (
          <Container>
            <StyledHeading large>
              Would you like to import an existing wallet or create a new one?<br />
            </StyledHeading>
            <StyledButton onClick={() => this.switchModals('add')}>
              <Icon type="plus" />
              <Text>Create a new wallet</Text>
            </StyledButton>
            <StyledButton onClick={() => this.switchModals('import')}>
              <Icon type="download" />
              <span>Import an existing wallet</span>
            </StyledButton>
          </Container>
        )}
        {modalType === 'add' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <IconWrapper>
                <Arrow
                  type="arrow-left"
                  onClick={() => this.switchModals('main')}
                />
                <Text large>Create a new wallet</Text>
              </IconWrapper>
            </div>
            <AddWallet loading={loading.toJS().creatingWallet} handleSubmit={this.props.handleAddWalletSubmit} />
          </div>
        )}
        {modalType === 'import' && (
          <div>
            <ImportWalletSteps
              wallets={[
                {
                  src: getAbsolutePath('public/images/ledger-logo.png'),
                  name: 'ledger',
                },
                {
                  src: getAbsolutePath('public/images/trezor-logo.png'),
                  name: 'Trezor',
                },
                {
                  src: getAbsolutePath('public/images/private-key.png'),
                  name: 'Private key',
                },
                {
                  src: getAbsolutePath('public/images/mnemonic.png'),
                  name: 'Mnemonic',
                },
                {
                  name: 'Keystore',
                },
              ]}
              onBackIcon={() => this.switchModals('main')}
              handleSubmit={this.props.handleImportWalletSubmit}
              loading={loading.toJS().creatingWallet}
            />
          </div>
        )}
      </div>
    );
  }
}
AddRestoreWalletModal.propTypes = {
  /**
   * Callback  function triggered when modal is closed.
   */
  handleAddWalletSubmit: PropTypes.func,
  handleImportWalletSubmit: PropTypes.func,

  /**
   * loading
   */

  loading: PropTypes.object.isRequired,
};
