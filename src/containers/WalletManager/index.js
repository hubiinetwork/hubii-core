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
    };
    this.onTabsChange = this.onTabsChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  onTabsChange(key) {
    this.props.history.push(key);
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
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
              onCancel={this.handleCancel}
            >
              <AddRestoreWalletModal
                handleClose={this.handleCancel}
                goBack={this.state.visible}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(WalletManager);
