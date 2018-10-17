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
import WalletHeader from 'components/WalletHeader';
import WalletTransactions from 'containers/WalletTransactions';
import WalletTransfer from 'containers/WalletTransfer';
import { makeSelectCurrentWalletWithInfo } from 'containers/WalletHoc/selectors';
import { setCurrentWallet } from 'containers/WalletHoc/actions';

import SimplexPage from 'components/SimplexPage';
import Tabs, { TabPane } from 'components/ui/Tabs';

import { Wrapper, HeaderWrapper } from './index.style';


export class WalletDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onHomeClick = this.onHomeClick.bind(this);
    this.onTabsChange = this.onTabsChange.bind(this);
  }

  componentDidMount() {
    this.props.setCurrentWallet(this.props.match.params.address);
  }

  onHomeClick() {
    const { history } = this.props;
    history.push('/wallets');
  }

  onTabsChange(key) {
    const { history } = this.props;
    history.push(key);
  }

  render() {
    const { history, match, currentWalletDetails, intl } = this.props;
    const { formatMessage } = intl;
    const currentWallet = currentWalletDetails;
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
            balance={currentWallet
              .getIn(['balances', 'total', 'usd'])
              .toNumber()}
            onIconClick={this.onHomeClick}
          />
        </HeaderWrapper>
        <Tabs
          activeKey={history.location.pathname}
          onChange={this.onTabsChange}
          animated={false}
        >
          <TabPane
            tab={
              <span>
                <Icon type="wallet" />{formatMessage({ id: 'details' })}
              </span>
            }
            key={`${match.url}/overview`}
          >
            <Route
              path={`${match.url}/overview`}
              component={WalletTransactions}
            />
          </TabPane>
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
            <Route path={`${match.url}/transfer`} component={WalletTransfer} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="shopping-cart" />{formatMessage({ id: 'buy_eth' })}
              </span>
            }
            key={`${match.url}/buyeth`}
          >
            <Route path={`${match.url}/buyeth`} component={SimplexPage} />
          </TabPane>
        </Tabs>
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
  setCurrentWallet: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletDetails: makeSelectCurrentWalletWithInfo(),
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
