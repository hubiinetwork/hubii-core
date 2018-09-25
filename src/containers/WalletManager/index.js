import { Icon } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from 'containers/WalletsOverview';
import ContactBook from 'containers/ContactBook';
import Tabs, { TabPane } from 'components/ui/Tabs';
import AddRestoreWalletModal from 'components/AddRestoreWalletModal';
import { Modal } from 'components/ui/Modal';
import { makeSelectContacts } from 'containers/ContactBook/selectors';
import EditContactModal from 'components/EditContactModal';

import {
  createWalletFromMnemonic,
  saveTrezorAddress,
  createWalletFromPrivateKey,
  createWalletFromKeystone,
} from 'containers/WalletHoc/actions';

import {
  saveLedgerAddress,
} from 'containers/LedgerHoc/actions';

import { makeSelectLoading, makeSelectWallets } from 'containers/WalletHoc/selectors';

import TopHeader from 'components/ui/TopHeader';
import Heading from 'components/ui/Heading';

import { createContact } from '../ContactBook/actions';


import {
  Wrapper,
  StyledButton,
} from './index.style';


export class WalletManager extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      type: '',
    };

    this.onTabsChange = this.onTabsChange.bind(this);
    this.onCreateContact = this.onCreateContact.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleAddWalletSubmit = this.handleAddWalletSubmit.bind(this);
    this.handleImportWalletSubmit = this.handleImportWalletSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.wallets.count() < this.props.wallets.count()) {
      this.hideModal();
    }
  }

  onTabsChange(key) {
    this.props.history.push(key);
  }

  onCreateContact(contact) {
    if (contact) {
      this.props.createContact(contact.name, contact.address);
    }
    this.hideModal();
  }

  showModal(type) {
    this.setState({
      visible: true,
      type,
    });
  }

  hideModal() {
    this.setState({
      visible: false,
    });
  }

  handleAddWalletSubmit(params) {
    this.props.createWalletFromMnemonic(params.name, params.mnemonic, params.derivationPath, params.password);
  }

  handleImportWalletSubmit(data) {
    if (data[0].walletType === 'Private key') {
      const { privateKey, name, password } = data[1];
      this.props.createWalletFromPrivateKey(privateKey, name, password);
    }
    if (data[0].walletType === 'ledger') {
      const { derivationPath, deviceId, address } = data[1];
      const { name } = data[2];
      this.props.saveLedgerAddress(name, derivationPath, deviceId, address);
      this.hideModal();
    }
    if (data[0].walletType === 'Trezor') {
      const { derivationPath, deviceId, address } = data[1];
      const { name } = data[2];
      this.props.saveTrezorAddress(name, derivationPath, deviceId, address);
      this.hideModal();
    }
    if (data[0].walletType === 'Mnemonic') {
      const { mnemonic, derivationPath, password, name } = data[1];
      this.props.createWalletFromMnemonic(name, mnemonic, derivationPath, password);
    }
    if (data[0].walletType === 'Keystone') {
      const { name, keystone } = data[1];
      this.props.createWalletFromKeystone(name, keystone);
    }
  }

  render() {
    const { history, match, contacts, loading } = this.props;
    let modal;
    switch (this.state.type) {
      case 'addContact':
        modal = (<EditContactModal
          onEdit={(contact) => this.onCreateContact(contact)}
          contacts={contacts.toJS()}
          confirmText="Create contact"
        />);
        break;
      default:
        modal = (<AddRestoreWalletModal
          goBack={this.state.visible}
          handleAddWalletSubmit={this.handleAddWalletSubmit}
          handleImportWalletSubmit={this.handleImportWalletSubmit}
          loading={loading}
        />);
    }

    return (
      <Wrapper>
        <TopHeader>
          <Heading>My wallets</Heading>
          <StyledButton
            type="primary"
            onClick={() => this.showModal(history.location.pathname === `${match.url}/overview` ? 'addWallet' : 'addContact')}
          >
            <Icon type="plus" />
            {history.location.pathname === `${match.url}/overview`
                ? 'Add a wallet'
                : 'Add a contact'}
          </StyledButton>
          <Modal
            footer={null}
            width={'41.79rem'}
            maskClosable
            maskStyle={{ background: 'rgba(232,237,239,.65)' }}
            style={{ marginTop: '1.43rem' }}
            visible={this.state.visible}
            onCancel={this.hideModal}
            destroyOnClose
          >
            {modal}
          </Modal>
        </TopHeader>
        <Tabs activeKey={history.location.pathname} onChange={this.onTabsChange} animated={false}>
          <TabPane
            tab={
              <span>
                <Icon type="wallet" />Overview
              </span>
            }
            key={`${match.url}/overview`}
          >
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Contacts
              </span>
            }
            key={`${match.url}/contacts`}
          >
          </TabPane>
        </Tabs>
        <Route path={`${match.url}/overview`} component={WalletsOverview} />
        <Route path={`${match.url}/contacts`} component={ContactBook} />
        {
          history.location.pathname === match.url &&
          <Redirect from={match.url} to={`${match.url}/overview`} push />
        }

      </Wrapper>
    );
  }
}

WalletManager.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  createWalletFromMnemonic: PropTypes.func.isRequired,
  saveLedgerAddress: PropTypes.func,
  saveTrezorAddress: PropTypes.func,
  createWalletFromPrivateKey: PropTypes.func.isRequired,
  createWalletFromKeystone: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  createContact: PropTypes.func,
  contacts: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.object), PropTypes.object]
  ),
  wallets: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  contacts: makeSelectContacts(),
  wallets: makeSelectWallets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    saveLedgerAddress: (...args) => dispatch(saveLedgerAddress(...args)),
    saveTrezorAddress: (...args) => dispatch(saveTrezorAddress(...args)),
    createWalletFromMnemonic: (...args) => dispatch(createWalletFromMnemonic(...args)),
    createWalletFromPrivateKey: (...args) => dispatch(createWalletFromPrivateKey(...args)),
    createWalletFromKeystone: (...args) => dispatch(createWalletFromKeystone(...args)),
    createContact: (...args) => dispatch(createContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletManager);
