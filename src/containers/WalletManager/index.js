/**
 *
 * WalletManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectWalletManager from './selectors';
import reducer from './reducer';
import saga from './saga';

export class WalletManager extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        wallet
      </div>
    );
  }
}

WalletManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  walletManager: makeSelectWalletManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'walletManager', reducer });
const withSaga = injectSaga({ key: 'walletManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WalletManager);
