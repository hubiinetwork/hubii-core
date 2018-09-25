import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';

import {
  ButtonDiv,
  TitleDiv,
  Arrow,
  IconWrapper,
  TextWhite,
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
            <TitleDiv>
              Would you like to import an existing wallet or create a new one?<br />
            </TitleDiv>
            <ButtonDiv onClick={() => this.switchModals('add')}>
              <Icon type="plus" />
              <TextWhite>Create a new wallet</TextWhite>
            </ButtonDiv>
            <ButtonDiv onClick={() => this.switchModals('import')}>
              <Icon type="download" />
              <TextWhite>Import an existing wallet</TextWhite>
            </ButtonDiv>

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
                />Create a new wallet
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
                  // src: getAbsolutePath('public/images/mnemonic.png'),
                  name: 'Keystone',
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
