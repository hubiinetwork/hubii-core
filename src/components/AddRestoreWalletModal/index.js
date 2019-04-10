import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { injectIntl } from 'react-intl';

import ImportWalletSteps from 'components/ImportWalletSteps';
import Text from 'components/ui/Text';

import {
  StyledButton,
  StyledHeading,
  Arrow,
  IconWrapper,
  Container,
} from './style';

import AddWallet from './AddWallet';

/**
 * This component shows options for modals to be opened.
 */
class AddRestoreWalletModal extends React.Component {
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
    const { loading, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <div>
        {modalType === 'main' && (
          <Container>
            <StyledHeading large>
              {formatMessage({ id: 'import_wallet_question' })}<br />
            </StyledHeading>
            <StyledButton onClick={() => this.switchModals('add')}>
              <Icon type="plus" />
              <Text>{formatMessage({ id: 'create_new_wallet' })}</Text>
            </StyledButton>
            <StyledButton onClick={() => this.switchModals('import')}>
              <Icon type="download" />
              <span>{formatMessage({ id: 'import_exist_wallet' })}</span>
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
                <Text large>{formatMessage({ id: 'create_wallet' })}</Text>
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
                  src: getAbsolutePath('public/images/keystore.png'),
                  name: 'Keystore',
                },
                {
                  // src: getAbsolutePath('public/images/keystore.png'),
                  name: 'Watch',
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
  intl: PropTypes.object,
};

export default injectIntl(AddRestoreWalletModal);
