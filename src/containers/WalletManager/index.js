import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from 'containers/WalletsOverview';
import Tab from 'components/ui/Tab';
import AddRestoreWalletModal from 'components/AddRestoreWalletModal';
import AddNewContactModal from 'components/AddNewContactModal';
import ContactBook from 'containers/ContactBook';
import { Modal } from 'components/ui/Modal';

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
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }
  onTabsChange(key) {
    this.props.history.push(key);
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
          goBack={this.state.visible}
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
};

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(WalletManager);
