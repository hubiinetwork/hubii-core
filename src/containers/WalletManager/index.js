import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Icon, Tabs } from 'antd';


import {
  Wrapper,
  TabsLayout,
  StyledButton,
  WalletsTabHeader
} from './wallets.style';
import ImportWalletSteps from '../../components/ImportWalletSteps';
import AddNewContactModal from '../../components/AddNewContactModal';
import Tab from '../../components/ui/Tab';
import { Modal } from '../../components/ui/Modal';


export class WalletManagerContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(key) {
    const { history } = this.props;// eslint-disable-line
    history.push(key);
  }

  render() {
    const { history, match } = this.props;// eslint-disable-line
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
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Contacts Book
              </span>
            }
            key="contacts"
          >
          </TabPane>
        </Tab>
      </Wrapper>
    );
  }
}

WalletManagerContainer.propTypes = {};

const withConnect = connect(null, null);

export default compose(
  withConnect,
)(WalletManagerContainer);
