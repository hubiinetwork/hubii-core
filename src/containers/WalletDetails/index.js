import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router-dom';
import WalletHeader from 'components/WalletHeader';
import { convertWalletsList, getTotalUSDValue } from 'utils/wallet';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import WalletTransfer from 'containers/WalletTransfer';
import { makeSelectWallets, makeSelectCurrentWallet } from 'containers/WalletManager/selectors';
import {
  loadWalletBalances,
  loadWallets,
  setCurrentWalletAddress,
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
    };
  }
  componentDidMount() {
    const { match } = this.props;
    this.props.loadWallets();
    this.props.setCurrentWalletAddress(match.params.address);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.currentWallet !== this.props.currentWallet) {
      const currentWallet = this.getCurrentWallet();
      if (currentWallet && !currentWallet.balances && !currentWallet.loadingBalancesError && !currentWallet.loadingBalances) {
        this.props.loadWalletBalances(currentWallet.name, `0x${currentWallet.encrypted.address}`);
      }
    }
  }

  getCurrentWallet() {
    const { wallets } = this.props;
    if (!wallets) {
      return null;
    }
    const walletsList = convertWalletsList(wallets);
    const matchedWallet = walletsList.find((wallet) => `0x${wallet.encrypted.address}` === this.props.currentWallet.toJS().address);
    return matchedWallet;
  }

  render() {
    const { history, match } = this.props;
    const currentWallet = this.getCurrentWallet();
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
  wallets: PropTypes.object.isRequired,
  loadWallets: PropTypes.func.isRequired,
  loadWalletBalances: PropTypes.func.isRequired,
  setCurrentWalletAddress: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wallets: makeSelectWallets(),
  currentWallet: makeSelectCurrentWallet(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
    loadWallets: () => dispatch(loadWallets()),
    setCurrentWalletAddress: (...args) => dispatch(setCurrentWalletAddress(...args)),
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
