import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router-dom';
import WalletHeader from 'components/WalletHeader';
import { getTotalUSDValue } from 'utils/wallet';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Modal } from 'components/ui/Modal';
import { FormItem, FormItemLabel } from 'components/ui/Form';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import WalletTransfer from 'containers/WalletTransfer';
import {
  makeSelectCurrentWallet,
  makeSelectWalletList,
  makeSelectCurrentWalletDetails,
} from 'containers/WalletManager/selectors';
import {
  loadWallets,
  setCurrentWallet,
  decryptWallet,
  hideDecryptWalletModal,
} from 'containers/WalletManager/actions';
import reducer from 'containers/WalletManager/reducer';
import saga from 'containers/WalletManager/saga';
import Tab from '../../components/ui/Tab';

import {
  Wrapper,
  TabsLayout,
} from './index.style';

const TabPane = Tabs.TabPane;

export class WalletDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      password: '',
    };
    this.decryptWallet = this.decryptWallet.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }
  
  componentDidMount() {
    this.props.loadWallets();
    this.props.setCurrentWallet(null, this.props.match.params.address);
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  decryptWallet() {
    const currentWallet = this.props.currentWalletDetails;
    this.props.decryptWallet(currentWallet.name, JSON.stringify(currentWallet.encrypted), this.state.password);
  }

  render() {
    const { history, match, currentWalletDetails } = this.props;
    const currentWallet = currentWalletDetails;
    if (!currentWallet) {
      return (null);
    }
    const totalUSDValue = getTotalUSDValue(currentWallet.balances);
    return (
      <Wrapper>
        <TabsLayout>
          <WalletHeader
            iconType="home"
            name={currentWallet.name}
            address={`${match.params.address}`}
            balance={totalUSDValue}
            onIconClick={this.onHomeClick}
          />
          <Modal
            footer={null}
            width={'585px'}
            maskClosable
            maskStyle={{ background: 'rgba(232,237,239,.65)' }}
            style={{ marginTop: '20px' }}
            visible={this.props.currentWallet.toJS().showDecryptModal}
            onCancel={this.props.hideDecryptWalletModal}
            destroyOnClose
          >
            <FormItem
              label={<FormItemLabel>Password</FormItemLabel>}
              colon={false}
            >
              <Input onChange={this.onPasswordChange} />
            </FormItem>
            <Button type="primary" onClick={this.decryptWallet}>
              Confirm
            </Button>
          </Modal>
        </TabsLayout>
        <Tab activeKey={history.location.pathname} onChange={this.onTabsChange} animated={false}>
          <TabPane
            tab={
              <span>
                <Icon type="wallet" />Overview
              </span>
            }
            key={`${match.url}/overview`}
          >
            {/* <Route path={`${match.url}/overview`} component={WalletsOverview} /> */}
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="contacts" />Transfer
              </span>
            }
            key={`${match.url}/transfer`}
          >
            <Route path={`${match.url}/transfer`} component={WalletTransfer} />
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

WalletDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentWallet: PropTypes.object.isRequired,
  currentWalletDetails: PropTypes.object.isRequired,
  loadWallets: PropTypes.func.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  decryptWallet: PropTypes.func.isRequired,
  hideDecryptWalletModal: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWallet: makeSelectCurrentWallet(),
  walletList: makeSelectWalletList(),
  currentWalletDetails: makeSelectCurrentWalletDetails(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadWallets: () => dispatch(loadWallets()),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
    hideDecryptWalletModal: () => dispatch(hideDecryptWalletModal()),
    decryptWallet: (...args) => dispatch(decryptWallet(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'walletManager', reducer });
const withSaga = injectSaga({ key: 'walletManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WalletDetails);
