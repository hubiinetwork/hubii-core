import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from 'containers/WalletsOverview';
import Tab from 'components/ui/Tab';
import AddRestoreWalletModal from 'components/AddRestoreWalletModal';
import { Modal } from 'components/ui/Modal';

import { createNewWallet, createWalletFromPrivateKey } from 'containers/WalletHOC/actions';
import { makeSelectLoading, makeSelectErrors } from 'containers/WalletHOC/selectors';

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
    };

    this.onTabsChange = this.onTabsChange.bind(this);
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
  showModal() {
    this.setState({
      visible: true,
    });
  }
  hideModal() {
    this.setState({
      visible: false,
    });
  }

  handleAddWalletSubmit(params) {
    this.props.createNewWallet(params.name, params.mnemonic, params.derivationPath, params.password);
  }

  handleImportWalletSubmit(data) {
    if (data[0].walletType === 'metamask') {
      const { privateKey, name, password } = data[1];
      this.props.createWalletFromPrivateKey(privateKey, name, password);
    }
    // console.log(data)
  }

  render() {
    const { history, match } = this.props;
    return (
      <Wrapper>
        <TabsLayout>
          <WalletsTabHeader>
            <h2 className="heading">All Wallets</h2>
            <StyledButton type="primary" onClick={this.showModal}>
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
              <AddRestoreWalletModal
                goBack={this.state.visible}
                handleAddWalletSubmit={this.handleAddWalletSubmit}
                handleImportWalletSubmit={this.handleImportWalletSubmit}
              />
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
            <Route path={`${match.url}/overview`} component={WalletsOverview} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Contacts Book
              </span>
            }
            key={`${match.url}/contacts`}
          >
            <Route path={`${match.url}/contacts`} />
          </TabPane>
        </Tab>
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
  createNewWallet: PropTypes.func.isRequired,
  createWalletFromPrivateKey: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    createNewWallet: (...args) => dispatch(createNewWallet(...args)),
    createWalletFromPrivateKey: (...args) => dispatch(createWalletFromPrivateKey(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletManager);
