import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from 'containers/WalletsOverview';
import ContactBook from 'containers/ContactBook';
import Tab from 'components/ui/Tab';
import AddRestoreWalletModal from 'components/AddRestoreWalletModal';
import AddNewContactModal from 'components/AddNewContactModal';
import { Modal } from 'components/ui/Modal';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { createNewWallet } from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectLoading, makeSelectErrors } from './selectors';
import { createContact } from '../ContactBook/actions';

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
    this.onSubmit = this.onSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleAddWalletSubmit = this.handleAddWalletSubmit.bind(this);
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

  onSubmit(data) {
    if (data) {
      this.props.createContact(data.name, data.address, 'Striim');
    }
    this.hideModal();
    return null;
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
    this.props.createNewWallet(params.name, params.mnemonic, params.derivationPath, params.password);
  }

  render() {
    const { history, match } = this.props;

    let deleteContact;
    if (history.location.pathname !== `${match.url}/overview`) {
      deleteContact =
        (<StyledButton type="primary" onClick={() => this.showModal('deleteContact')} style={{ marginRight: '2rem' }}>
          <Icon type="delete" />
          Delete Contact
        </StyledButton>);
    }
    let modal;
    switch (this.state.type) {
      case 'deleteContact':
        modal = ('hello');
        break;
      case 'addContact':
        modal = (<AddNewContactModal
          onSubmit={(e) => this.onSubmit(e)}
        />);
        break;
      default:
        modal = (<AddRestoreWalletModal
          goBack={this.state.visible}
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
            {deleteContact}
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
            <Route path={`${match.url}/contacts`} component={ContactBook} />
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
  loading: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createContact: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    createNewWallet: (...args) => dispatch(createNewWallet(...args)),
    createContact: (...args) => dispatch(createContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'walletManager', reducer });
const withSaga = injectSaga({ key: 'walletManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WalletManager);
