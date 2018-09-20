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

import { makeSelectWallets } from 'containers/WalletHoc/selectors';

import Heading from 'components/ui/Heading';
import SelectWallet from 'components/ui/SelectWallet';
// import { Option } from 'components/ui/Select';


import makeSelectNahmiiAirdriipRegistration from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  StartWrapper,
  StyledButton,
  StyledButtonTall,
  OuterWrapper,
  ButtonsWrapper,
  StyledHeading,
} from './style';
import {
  changeStage,
  changeSelectedCoreWallet,
  register,
} from './actions';

const Start = (props) => (
  <StartWrapper>
    <StyledHeading large>Thank you for your interest in the nahmii airdriip!</StyledHeading>
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

const CoreAddressRegistrationForm = (props) => (
  <StartWrapper>
    <StyledHeading large>Register a hubii core address</StyledHeading>
    <StyledHeading>Select the address you would like to register</StyledHeading>
    <SelectWallet
      wallets={props.wallets.toJS()}
      onChange={(wallet) => props.changeSelectedCoreWallet(wallet)}
      value={props.store.getIn(['selectedCoreWallet', 'address'])}
    />
  </StartWrapper>
);

const ManualRegistrationForm = () => (
  <StartWrapper>
    <StyledHeading large>Manual registration</StyledHeading>
    <Heading>Has the address you intend to register been imported into hubii core?</Heading>
  </StartWrapper>
);

export class NahmiiAirdriipRegistration extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    props.changeSelectedCoreWallet(props.wallets.get(0).toJS());
  }

  render() {
    const { store, wallets } = this.props;
    if (store.get('stage') === 'start') {
      return (
        <OuterWrapper>
          <Start changeStage={this.props.changeStage} />
        </OuterWrapper>
      );
    }
    return (
      <OuterWrapper>
        {
          store.get('stage') === 'register-imported' &&
          <CoreAddressRegistrationForm
            wallets={wallets}
            store={store}
            changeSelectedCoreWallet={this.props.changeSelectedCoreWallet}
          />
        }
        {
          store.get('stage') === 'register-arbitrary' &&
          <ManualRegistrationForm />
        }
        <ButtonsWrapper>
          <StyledButton
            onClick={() => this.props.changeStage('start')}
            style={{ width: '7rem' }}
          >
            Go back
          </StyledButton>
          <StyledButton
            type="primary"
            onClick={() => this.props.register()}
          >
            Register address
          </StyledButton>
        </ButtonsWrapper>
      </OuterWrapper>
    );
  }
}

NahmiiAirdriipRegistration.propTypes = { // eslint-disable-line
  changeStage: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  changeSelectedCoreWallet: PropTypes.func.isRequired,
  wallets: PropTypes.object.isRequired,
};

CoreAddressRegistrationForm.propTypes = { // eslint-disable-line
  changeSelectedCoreWallet: PropTypes.func.isRequired,
  wallets: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

ManualRegistrationForm.propTypes = { // eslint-disable-line

};

Start.propTypes = { // eslint-disable-line
  changeStage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  store: makeSelectNahmiiAirdriipRegistration(),
  wallets: makeSelectWallets(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeStage: (...args) => dispatch(changeStage(...args)),
    register: () => dispatch(register()),
    changeSelectedCoreWallet: (...args) => dispatch(changeSelectedCoreWallet(...args)),
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
