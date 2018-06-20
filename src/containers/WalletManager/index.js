import { Icon, Tabs } from 'antd';
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import WalletsOverview from 'containers/WalletsOverview';
import Tab from '../../components/ui/Tab';
import {
  Wrapper,
  TabsLayout,
  StyledButton,
  WalletsTabHeader,
} from './index.style';
import ImportWalletSteps from '../../components/ImportWalletSteps';
import AddNewContactModal from '../../components/AddNewContactModal';
import AddRestoreWalletModal from '../../components/AddRestoreWalletModal';
import { Modal } from '../../components/ui/Modal';

const TabPane = Tabs.TabPane;

export class WalletManager extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onTabsChange = this.onTabsChange.bind(this);
    this.state = {
      visible: false,
    };
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
              destroyOnClose={true}
            >
              <AddRestoreWalletModal
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
  onTabsChange(key) {
    this.props.history.push(key);
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(WalletManager);
