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
              Add a wallet<br />
              {/* <Description>Would you like to create a new wallet, or import an existing one?</Description> */}
            </TitleDiv>
            <ButtonDiv onClick={() => this.switchModals('add')} type="primary">
              <Icon type="plus" />
              <TextWhite>Create a new wallet</TextWhite>
            </ButtonDiv>
            <ButtonDiv onClick={() => this.switchModals('import')} type="primary">
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
                  name: 'Trezor',
                },
                {
                  name: 'Private key',
                },
                {
                  name: 'Mnemonic',
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
