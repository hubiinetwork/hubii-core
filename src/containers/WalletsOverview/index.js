import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from './WalletsOverview.component';
import cardsData from './cardsData';

export class WalletOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <WalletsOverview cards={cardsData} history={this.props.history} />
    );
  }
}

WalletOverview.propTypes = {};

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, null);

export default compose(
  withConnect,
)(WalletOverview);
