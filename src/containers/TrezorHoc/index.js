/**
 *
 * TrezorHoc
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
import { initTrezor } from './actions';

function withTrezor(WrappedComponent) {
  class TrezorHoc extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
      super(props);
      this.props.initTrezor();
    }
    render() {
      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  TrezorHoc.propTypes = {
    initTrezor: PropTypes.func.isRequired,
  };

  const mapStateToProps = createStructuredSelector({});

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      initTrezor: () => dispatch(initTrezor()),
    };
  }

  const withConnect = connect(mapStateToProps, mapDispatchToProps);

  const withReducer = injectReducer({ key: 'trezorHoc', reducer });
  const withSaga = injectSaga({ key: 'trezorHoc', saga });

  return compose(
    withReducer,
    withSaga,
    withConnect,
  )(TrezorHoc);
}

export default withTrezor;
