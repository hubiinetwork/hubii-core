import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import Heading from 'components/ui/Heading';
import CandleStickChart from 'components/CandleStickChart';

import {
  Wrapper,
  TopHeader,
  Container,
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
    if (!this.props.priceHistory || !this.props.priceHistory.getIn([this.state.currency, 'history'])) {
      return null;
    }
    return (
      <Wrapper>
        <TopHeader>
          <Heading>Exchange</Heading>
        </TopHeader>
        <Container>
          <CandleStickChart priceHistory={this.props.priceHistory} latestPrice={this.props.latestPrice} currency={this.state.currency} />
        </Container>
      </Wrapper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  priceHistory: makeSelectPriceHistory(),
  latestPrice: makeSelectLatestPrice(),
  // contacts: makeSelectContacts(),
  // wallets: makeSelectWallets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadPriceHistory: (...args) => dispatch(actions.loadPriceHistory(...args)),
    listenLatestPrice: (...args) => dispatch(actions.listenLatestPrice(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'dex', reducer });
const withSaga = injectSaga({ key: 'dex', saga });

export const Dex = compose(
  withReducer,
  withSaga,
  withConnect,
)(DexContainer);

DexContainer.propTypes = {
  loadPriceHistory: PropTypes.func.isRequired,
  listenLatestPrice: PropTypes.func.isRequired,
  latestPrice: PropTypes.number.isRequired,
  priceHistory: PropTypes.object.isRequired,
  // intl: PropTypes.object.isRequired,
};

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(DexContainer);
