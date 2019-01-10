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

import TradingTab from 'components/TradingTab';
import Heading from 'components/ui/Heading';
import Tabs, { TabPane } from 'components/ui/Tabs';

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
    this.state = {
      currency: 'bitcoin',
    };
    props.loadPriceHistory(this.state.currency);
    props.listenLatestPrice(this.state.currency);
  }
  render() {
    const { dispatch, match, history, priceHistory, latestPrice } = this.props;
    if (!this.props.priceHistory || !this.props.priceHistory.getIn([this.state.currency, 'history'])) {
      return null;
    }
    return (
      <Wrapper>
        <TopHeader>
          <Heading>Exchange</Heading>
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
              component={() => (
                <TradingTab
                  priceHistory={priceHistory}
                  latestPrice={latestPrice}
                  currency={this.state.currency}
                />
              )}
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
});

export function mapDispatchToProps(dispatch) {
  return {
    loadPriceHistory: (...args) => dispatch(actions.loadPriceHistory(...args)),
    listenLatestPrice: (...args) => dispatch(actions.listenLatestPrice(...args)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'dex', reducer });
const withSaga = injectSaga({ key: 'dex', saga });

DexContainer.propTypes = {
  loadPriceHistory: PropTypes.func.isRequired,
  listenLatestPrice: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  latestPrice: PropTypes.object.isRequired,
  priceHistory: PropTypes.object.isRequired,
  // intl: PropTypes.object.isRequired,
};

export default compose(
  // injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(DexContainer);
