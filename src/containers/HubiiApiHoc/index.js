/**
 *
 * HubiiApiHoc
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { initNetworkActivity } from 'containers/App/actions';
import reducer from './reducer';
import saga from './saga';

function withHubiiApi(WrappedComponent) {
  class HubiiApiHoc extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
      super(props);
      this.props.initNetworkActivity();
    }
    render() {
      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  HubiiApiHoc.propTypes = {
    initNetworkActivity: PropTypes.func.isRequired,
  };

  const mapStateToProps = createStructuredSelector({});

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      initNetworkActivity: () => dispatch(initNetworkActivity()),
    };
  }

  const withConnect = connect(mapStateToProps, mapDispatchToProps);

  const withReducer = injectReducer({ key: 'hubiiApiHoc', reducer });
  const withSaga = injectSaga({ key: 'hubiiApiHoc', saga });

  return compose(
    withReducer,
    withSaga,
    withConnect,
  )(HubiiApiHoc);
}

export default withHubiiApi;
