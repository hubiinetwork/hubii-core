/**
 *
 * NahmiiHoc
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

function withNahmii(WrappedComponent) {
  class NahmiiHoc extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }
  const mapStateToProps = createStructuredSelector({});

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    };
  }

  const withConnect = connect(mapStateToProps, mapDispatchToProps);

  const withReducer = injectReducer({ key: 'nahmiiHoc', reducer });
  const withSaga = injectSaga({ key: 'nahmiiHoc', saga });

  return compose(
    withReducer,
    withSaga,
    withConnect,
  )(NahmiiHoc);
}

export default withNahmii;
