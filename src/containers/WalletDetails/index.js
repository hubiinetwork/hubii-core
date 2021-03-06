import { Icon } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import theme from 'themes/darkTheme';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router';

import { isConnected, isHardwareWallet } from 'utils/wallet';

import WalletHeader from 'components/WalletHeader';
import NahmiiText from 'components/ui/NahmiiText';
import WalletTransactions from 'containers/WalletTransactions';
import NahmiiDeposit from 'containers/NahmiiDeposit';
import WalletTransfer from 'containers/WalletTransfer';
import NahmiiWithdraw from 'containers/NahmiiWithdraw';
import NahmiiClaimFees from 'containers/NahmiiClaimFees';
import { makeSelectCurrentWalletWithInfo } from 'containers/NahmiiHoc/combined-selectors';
import {
  makeSelectLedgerHoc,
} from 'containers/LedgerHoc/selectors';
import {
  makeSelectTrezorHoc,
} from 'containers/TrezorHoc/selectors';
import { setCurrentWallet } from 'containers/WalletHoc/actions';

import SimplexPage from 'components/SimplexPage';
import Tabs, { TabPane } from 'components/ui/Tabs';

import { Wrapper, HeaderWrapper } from './style';


export class WalletDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onHomeClick = this.onHomeClick.bind(this);
    this.onTabsChange = this.onTabsChange.bind(this);
    this.props.setCurrentWallet(props.match.params.address);
  }

  onHomeClick() {
    const { history } = this.props;
    history.push('/wallets');
  }

  onTabsChange(key) {
    const { history } = this.props;
    history.push(key);
  }

  getMenus(walletType) {
    const { match, intl } = this.props;
    const { formatMessage } = intl;
    const menus = walletType === 'watch' ? ['details', 'buy_eth'] : ['details', 'transfer', 'deposit', 'withdraw', 'revenue', 'buy_eth'];

    return menus.map((feature) => {
      switch (feature) {
        case 'details':
          return (
            <TabPane
              tab={
                <span>
                  <Icon type="wallet" />{formatMessage({ id: 'details' })}
                </span>
              }
              key={`${match.url}/overview`}
            >
            </TabPane>
          );
        case 'buy_eth':
          return (
            <TabPane
              tab={
                <span>
                  <Icon type="shopping-cart" />{formatMessage({ id: 'buy_eth' })}
                </span>
              }
              key={`${match.url}/buyeth`}
            >
            </TabPane>
          );
        case 'transfer':
          return (
            <TabPane
              tab={
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="26"
                    viewBox="0 0 18 16"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      transform="translate(-5 -4)"
                    >
                      <polygon points="0 0 24 0 24 24 0 24" />
                      <polygon
                        fill={location.pathname.includes('/transfer') ? theme.palette.info3 : theme.palette.secondary}
                        points="5.009 19.714 23 12 5.009 4.286 5 10.286 17.857 12 5 13.714"
                      />
                    </g>
                  </svg>
                  {formatMessage({ id: 'transfer' })}
                </span>
              }
              key={`${match.url}/transfer`}
            >
            </TabPane>
          );
        case 'deposit':
          return (
            <TabPane
              tab={
                <span>
                  <Icon type="login" /><NahmiiText /> {formatMessage({ id: 'deposit' }).toLowerCase()}
                </span>
              }
              key={`${match.url}/nahmii-deposit`}
            >
            </TabPane>
          );
        case 'withdraw':
          return (
            <TabPane
              tab={
                <span>
                  <Icon type="logout" /><NahmiiText /> {formatMessage({ id: 'withdraw' }).toLowerCase()}
                </span>
              }
              key={`${match.url}/withdraw`}
            >
            </TabPane>
          );
        case 'revenue':
          return (
            <TabPane
              tab={
                <span>
                  <Icon type="area-chart" /><NahmiiText /> {formatMessage({ id: 'nahmii_fees' }).toLowerCase()}
                </span>
              }
              key={`${match.url}/claim-fees`}
            >
            </TabPane>
          );
        default:
          return null;
      }
    });
  }

  render() {
    const {
      history,
      match,
      currentWalletDetails,
      ledgerInfo,
      trezorInfo,
    } = this.props;
    const currentWallet = currentWalletDetails;
    const connected = isConnected(currentWallet.toJS(), ledgerInfo.toJS(), trezorInfo.toJS());
    if (!currentWallet || currentWallet === fromJS({})) {
      return null;
    }
    return (
      <Wrapper>
        <HeaderWrapper>
          <WalletHeader
            iconType="home"
            name={currentWallet.get('name')}
            address={currentWallet.get('address')}
            balance={
              currentWallet
                .getIn(['balances', 'combined', 'total', 'usd'])
                .toNumber()
            }
            onIconClick={this.onHomeClick}
            connected={connected}
            isDecrypted={!!currentWallet.get('decrypted')}
            type={isHardwareWallet(currentWallet.get('type')) ? 'hardware' : currentWallet.get('type')}
          />
        </HeaderWrapper>
        <Tabs
          activeKey={history.location.pathname}
          onChange={this.onTabsChange}
          animated={false}
        >
          {this.getMenus(currentWallet.get('type'))}
        </Tabs>
        <Route
          path={`${match.url}/overview`}
          component={WalletTransactions}
        />
        <Route path={`${match.url}/transfer`} component={WalletTransfer} />
        <Route path={`${match.url}/buyeth`} component={SimplexPage} />
        <Route path={`${match.url}/nahmii-deposit`} component={NahmiiDeposit} />
        <Route path={`${match.url}/withdraw`} component={NahmiiWithdraw} />
        <Route path={`${match.url}/claim-fees`} component={NahmiiClaimFees} />
        {history.location.pathname === match.url && (
          <Redirect from={match.url} to={`${match.url}/transfer`} push />
        )}
      </Wrapper>
    );
  }
}

WalletDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentWalletDetails: PropTypes.object.isRequired,
  ledgerInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletDetails: makeSelectCurrentWalletWithInfo(),
  ledgerInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
});

export function mapDispatchToProps(dispatch) {
  return {
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect, injectIntl)(WalletDetails);
