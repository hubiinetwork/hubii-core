/**
 *
 * NahmiiAirdriipRegistration
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectNahmiiAirdriipRegistration from './selectors';
import reducer from './reducer';
import saga from './saga';

export class NahmiiAirdriipRegistration extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
      </div>
    );
  }
}

NahmiiAirdriipRegistration.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  nahmiiAirdriipRegistration: makeSelectNahmiiAirdriipRegistration(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'nahmiiAirdriipRegistration', reducer });
const withSaga = injectSaga({ key: 'nahmiiAirdriipRegistration', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(NahmiiAirdriipRegistration);