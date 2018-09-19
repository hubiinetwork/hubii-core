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

import Heading from 'components/ui/Heading';
import Select from 'components/ui/Select';

import makeSelectNahmiiAirdriipRegistration from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  StartWrapper,
  StyledButton,
  StyledButtonTall,
  OuterWrapper,
  ButtonsWrapper,
} from './style';
import { changeStage } from './actions';

const Start = (props) => (
  <StartWrapper>
    <h1>Thank you for your interest in the nahmii airdriip!</h1>
    <Heading>Has the address you intend to register been imported into hubii core?</Heading>
    <ButtonsWrapper>
      <StyledButtonTall
        onClick={() => props.changeStage('register-arbitrary')}
      >
        <div>No</div>
        <div>(advanced)</div>
      </StyledButtonTall>
      <StyledButtonTall
        type="primary"
        onClick={() => props.changeStage('register-imported')}
      >
        <div>Yes</div>
        <div>(one-click-registration)</div>
      </StyledButtonTall>
    </ButtonsWrapper>
  </StartWrapper>
);

const RegisterImported = (props) => (
  <StartWrapper>
    <h1>Register a hubii core address</h1>
    <Select>

    </Select>
    <ButtonsWrapper>
      <StyledButton
        onClick={() => props.changeStage('start')}
        style={{ width: '7rem' }}
      >
        Go back
      </StyledButton>
      <StyledButton
        type="primary"
        onClick={() => props.changeStage('register-arbitrary')}
      >
        Register address
      </StyledButton>
    </ButtonsWrapper>
  </StartWrapper>
);

const RegisterArbitrary = (props) => (
  <StartWrapper>
    <h1>Register a hubii core address</h1>
    <Heading>Has the address you intend to register been imported into hubii core?</Heading>
    <ButtonsWrapper>
      <StyledButton
        type="primary"
        onClick={() => props.changeStage('register-imported')}
      >
        <div>Yes</div>
        <div>(one-click-registration)</div>
      </StyledButton>
      <StyledButton
        onClick={() => props.changeStage('register-arbitrary')}
      >
        <div>No</div>
        <div>(advanced)</div>
      </StyledButton>
    </ButtonsWrapper>
  </StartWrapper>
);

export class NahmiiAirdriipRegistration extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { state } = this.props;
    return (
      <OuterWrapper>
        {
          state.get('stage') === 'start' &&
          <Start {...this.props} />
        }
        {
          state.get('stage') === 'register-imported' &&
          <RegisterImported {...this.props} />
        }
        {
          state.get('stage') === 'register-arbitrary' &&
          <RegisterArbitrary {...this.props} />
        }
      </OuterWrapper>
    );
  }
}

NahmiiAirdriipRegistration.propTypes = Start.propTypes = RegisterImported.propTypes = RegisterArbitrary.propTypes = { // eslint-disable-line
  changeStage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  state: makeSelectNahmiiAirdriipRegistration(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeStage: (...args) => dispatch(changeStage(...args)),
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
