/**
 *
 * LedgerHoc
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { initLedger } from './actions';

function withLedger(WrappedComponent) {
  class LedgerHoc extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
      super(props);
      this.props.initLedger();
    }
    render() {
      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  LedgerHoc.propTypes = {
    initLedger: PropTypes.func.isRequired,
  };

  const mapStateToProps = createStructuredSelector({});

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      initLedger: () => dispatch(initLedger()),
    };
  }

  const withConnect = connect(mapStateToProps, mapDispatchToProps);

  const withReducer = injectReducer({ key: 'ledgerHoc', reducer });
  const withSaga = injectSaga({ key: 'ledgerHoc', saga });

  return compose(
    withReducer,
    withSaga,
    withConnect,
  )(LedgerHoc);
}

export default withLedger;
