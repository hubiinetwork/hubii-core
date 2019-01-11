import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
// import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Route } from 'react-router';
import { createStructuredSelector } from 'reselect';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { setCurrentWallet } from 'containers/WalletHoc/actions';
import {
  makeSelectWallets,
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';

import TradingTab from 'components/TradingTab';
import Heading from 'components/ui/Heading';
import Tabs, { TabPane } from 'components/ui/Tabs';
import SelectWallet from 'components/ui/SelectWallet';

import {
  Wrapper,
  TopHeader,
} from './index.style';

import * as actions from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectPriceHistory,
  makeSelectLatestPrice,
} from './selectors';

export class DexContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    props.setCurrentWallet(props.wallets.getIn([0, 'address']));
    // props.loadPriceHistory(this.state.currency);
    // props.listenLatestPrice(this.state.currency);
  }
  render() {
    const {
      dispatch,
      match,
      history,
      // priceHistory,
      // latestPrice,
      wallets,
      currentWalletWithInfo,
    } = this.props;
    // if (!this.props.priceHistory || !this.props.priceHistory.getIn([this.state.currency, 'history'])) {
    //   return null;
    // }
    return (
      <Wrapper>
        <TopHeader>
          <Heading>Exchange</Heading>
          <SelectWallet
            style={{ height: '5rem' }}
            wallets={wallets.toJS()}
            onChange={(address) => this.props.setCurrentWallet(address)}
            value={currentWalletWithInfo.get('address')}
          />
        </TopHeader>
        <Tabs
          activeKey={history.location.pathname}
          onChange={(route) => dispatch(push(route))}
          animated={false}
          noPadding
        >
          <TabPane
            tab={
              <span>
                <Icon type="line-chart" />
                  Trading
              </span>
            }
            key={`${match.url}/trading`}
          >
            <Route
              path={`${match.url}/trading`}
              component={TradingTab}
            />
          </TabPane>
        </Tabs>
      </Wrapper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  priceHistory: makeSelectPriceHistory(),
  latestPrice: makeSelectLatestPrice(),
  wallets: makeSelectWallets(),
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadPriceHistory: (...args) => dispatch(actions.loadPriceHistory(...args)),
    listenLatestPrice: (...args) => dispatch(actions.listenLatestPrice(...args)),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'dex', reducer });
const withSaga = injectSaga({ key: 'dex', saga });

DexContainer.propTypes = {
  // loadPriceHistory: PropTypes.func.isRequired,
  // listenLatestPrice: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  // latestPrice: PropTypes.object.isRequired,
  // priceHistory: PropTypes.object.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  wallets: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  // intl: PropTypes.object.isRequired,
};

export default compose(
  // injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(DexContainer);
