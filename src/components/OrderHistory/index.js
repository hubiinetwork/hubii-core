/**
 *
 * OrderBook
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Tabs, { TabPane } from 'components/ui/Tabs';


export class OrderHistory extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.className}>
        <Tabs noPadding>
          <TabPane tab="Open Orders" key="1">Open order content</TabPane>
          <TabPane tab="Order History" key="2">Order history content</TabPane>
        </Tabs>
      </div>
    );
  }
}

OrderHistory.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(OrderHistory);
