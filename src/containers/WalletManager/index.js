import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from 'containers/WalletsOverview';
import ContactBook from 'containers/ContactBook';
import Tab from 'components/ui/Tab';
import AddRestoreWalletModal from 'components/AddRestoreWalletModal';
import AddNewContactModal from 'components/AddNewContactModal';
import { Modal } from 'components/ui/Modal';
import { makeSelectContacts } from 'containers/ContactBook/selectors';

import { createWalletFromMnemonic, createWalletFromPrivateKey } from 'containers/WalletHOC/actions';
import { makeSelectLoading, makeSelectErrors } from 'containers/WalletHOC/selectors';
import { createContact,
 } from '../ContactBook/actions';

import {
  Wrapper,
  TabsLayout,
  StyledButton,
  WalletsTabHeader,
} from './index.style';

const TabPane = Tabs.TabPane;

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
    const lastLoadingProps = prevProps.loading.toJS();
    const currentLoadingProps = this.props.loading.toJS();
    const currentErrorsProps = this.props.errors.toJS();

    if (lastLoadingProps.creatingWallet &&
        !currentLoadingProps.creatingWallet &&
        !currentErrorsProps.creatingWalletError
    ) {
      this.hideModal();
    }
  }

  onTabsChange(key) {
    this.props.history.push(key);
  }

  onCreateContact(contact) {
    if (contact) {
      const name = contact.name.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
      this.props.createContact(name, contact.address);
    }
    this.hideModal();
  }
  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
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
    if (data[0].walletType === 'metamask') {
      const { privateKey, name, password } = data[1];
      this.props.createWalletFromPrivateKey(privateKey, name, password);
    }
  }

  render() {
    const { history, match, contacts } = this.props;

    let modal;
    switch (this.state.type) {
      case 'addContact':
        modal = (<AddNewContactModal
          onSubmit={(contact) => this.onCreateContact(contact)}
          contacts={contacts.toJS()}
        />);
        break;
      default:
        modal = (<AddRestoreWalletModal
          goBack={this.state.visible}
          handleAddWalletSubmit={this.handleAddWalletSubmit}
          handleImportWalletSubmit={this.handleImportWalletSubmit}
        />);
    }

    return (
      <Wrapper>
        <TabsLayout>
          <WalletsTabHeader>
            <h2 className="heading">All Wallets</h2>
            <StyledButton
              type="primary"
              onClick={() => this.showModal(history.location.pathname === `${match.url}/overview` ? 'addWallet' : 'addContact')}
            >
              <Icon type="plus" />
              {history.location.pathname === `${match.url}/overview`
                ? 'Add / Restore Wallet'
                : 'Add New Contact'}
            </StyledButton>
            <Modal
              footer={null}
              width={'585px'}
              maskClosable
              maskStyle={{ background: 'rgba(232,237,239,.65)' }}
              style={{ marginTop: '20px' }}
              visible={this.state.visible}
              onCancel={this.hideModal}
              destroyOnClose
            >
              {modal}
            </Modal>
          </WalletsTabHeader>
        </TabsLayout>
        <Tab activeKey={history.location.pathname} onChange={this.onTabsChange} animated={false}>
          <TabPane
            tab={
              <span>
                <Icon type="wallet" />Wallets Overview
              </span>
            }
            key={`${match.url}/overview`}
          >
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Contacts Book
              </span>
            }
            key={`${match.url}/contacts`}
          >
          </TabPane>
        </Tab>
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
  createWalletFromPrivateKey: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createContact: PropTypes.func,
  contacts: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.object), PropTypes.object]
  ),
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  contacts: makeSelectContacts(),
});

export function mapDispatchToProps(dispatch) {
  return {
    createWalletFromMnemonic: (...args) => dispatch(createWalletFromMnemonic(...args)),
    createWalletFromPrivateKey: (...args) => dispatch(createWalletFromPrivateKey(...args)),
    createContact: (...args) => dispatch(createContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletManager);
