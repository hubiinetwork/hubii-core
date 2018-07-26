import { Icon, Tabs } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router';
import WalletHeader from 'components/WalletHeader';
import WalletTransactions from 'containers/WalletTransactions';
import WalletTransfer from 'containers/WalletTransfer';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHOC/selectors';
import {
  setCurrentWallet,
} from 'containers/WalletHOC/actions';
import Tab from '../../components/ui/Tab';

import {
  Wrapper,
  TabsLayout,
} from './index.style';

const TabPane = Tabs.TabPane;

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
    const { history, match, currentWalletDetails } = this.props;
    const currentWallet = currentWalletDetails;
    if (!currentWallet) {
      return (null);
    }
    return (
      <Wrapper>
        <TabsLayout>
          <WalletHeader
            iconType="home"
            name={currentWallet.get('name')}
            address={`${match.params.address}`}
            balance={currentWallet.getIn(['balances', 'total', 'usd'])}
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
            <Route path={`${match.url}/overview`} component={WalletTransactions} />
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
          <Redirect from={match.url} to={`${match.url}/transfer`} push />
        }
      </Wrapper>
    );
  }

}

WalletDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentWalletDetails: PropTypes.object.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletDetails: makeSelectCurrentWalletWithInfo(),
});

export function mapDispatchToProps(dispatch) {
  return {
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletDetails);
