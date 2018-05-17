import { Icon, Tabs } from 'antd';
import * as React from 'react';
import Tab from '../../components/ui/Tab';
import ContactBook from './ContactBook.component';
import WalletsOverview from './WalletsOverview.component';
import cardsData from './cardsData';
import {
  Wrapper,
  TabsLayout,
  StyledButton,
  WalletsTabHeader
} from './wallets.style';
// import AddRestoreWalletModal from '../../components/AddRestoreWalletModal';
import ImportWalletSteps from '../../components/ImportWalletSteps';
import AddNewContactModal from '../../components/AddNewContactModal';
import { Modal } from '../../components/ui/Modal';

const TabPane = Tabs.TabPane;

export default class WalletTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'wallets',
      visible: false
    };
  }
  render() {
    return (
      <Wrapper>
        <TabsLayout>
          <WalletsTabHeader>
            <h2 className="heading">All Wallets</h2>
            <StyledButton type="primary" onClick={this.showModal}>
              <Icon type="plus" />
              {this.state.activeTab === 'wallets'
                ? 'Add / Restore Wallet'
                : 'Add New Contact'}
            </StyledButton>
            <Modal
              footer={null}
              width={'585px'}
              maskClosable={false}
              maskStyle={{ background: 'rgba(232,237,239,.65)' }}
              style={{ marginTop: '20px' }}
              visible={this.state.visible}
              onCancel={this.handleCancel}
            >
              {this.state.activeTab === 'wallets' ? (
                <ImportWalletSteps />
              ) : (
                // <AddRestoreWalletModal
                //   handleClose={this.handleCancel}
                //   goBack={this.state.visible}
                // />
                <AddNewContactModal />
              )}
            </Modal>
          </WalletsTabHeader>
        </TabsLayout>
        <Tab onChange={this.onTabsChange} animated={false}>
          <TabPane
            tab={
              <span>
                <Icon type="wallet" />Wallets Overview
              </span>
            }
            key="wallets"
          >
            <WalletsOverview cards={cardsData} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Contacts Book
              </span>
            }
            key="contacts"
          >
            <ContactBook />
          </TabPane>
        </Tab>
      </Wrapper>
    );
  }
  onTabsChange = activeTab => {
    this.setState({ activeTab });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
}
