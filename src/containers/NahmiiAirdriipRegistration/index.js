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
import { walletReady, isHardwareWallet } from 'utils/wallet';

import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import { setCurrentWallet } from 'containers/WalletHoc/actions';

import {
  makeSelectWallets,
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import HWPromptContainer from 'containers/HWPromptContainer';

import SelectWallet from 'components/ui/SelectWallet';

import makeSelectNahmiiAirdriipRegistration from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  StartWrapper,
  StyledButton,
  StyledButtonTall,
  OuterWrapper,
  ButtonsWrapper,
  PrimaryHeading,
  SecondaryHeading,
} from './style';
import {
  changeStage,
  register,
} from './actions';

const Start = (props) => (
  <StartWrapper>
    <PrimaryHeading large>Thank you for your interest in the nahmii airdriip!</PrimaryHeading>
    <SecondaryHeading>Has the address you intend to register been imported into hubii core?</SecondaryHeading>
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
    <PrimaryHeading large>Register a hubii core address</PrimaryHeading>
    <SecondaryHeading>Select the address you would like to register</SecondaryHeading>
    <SelectWallet
      wallets={props.wallets.toJS()}
      onChange={(address) => props.setCurrentWallet(address)}
      value={props.currentWalletWithInfo.get('address')}
      style={{ marginBottom: '2rem' }}
    />
    {
      isHardwareWallet(props.currentWalletWithInfo.get('type')) &&
      <HWPromptContainer
        style={{ marginBottom: '2rem' }}
        passedDeviceType={props.currentWalletWithInfo.get('type')}
      />
    }
  </StartWrapper>
);

const ManualRegistrationForm = () => (
  <StartWrapper>
    <PrimaryHeading large>Manual registration</PrimaryHeading>
    <SecondaryHeading>Has the address you intend to register been imported into hubii core?</SecondaryHeading>
  </StartWrapper>
);

export class NahmiiAirdriipRegistration extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    props.setCurrentWallet(props.wallets.getIn([0, 'address']));
  }

  render() {
    const {
      store,
      wallets,
      ledgerInfo,
      trezorInfo,
      currentWalletWithInfo,
    } = this.props;
    if (store.get('stage') === 'start') {
      return (
        <OuterWrapper>
          <Start changeStage={this.props.changeStage} />
        </OuterWrapper>
      );
    }

    const disabledRegisterButton =
      store.get('stage') === 'register-imported'
      && !walletReady(currentWalletWithInfo.get('type'), ledgerInfo, trezorInfo);

    const loading = store.get('registering');

    return (
      <OuterWrapper>
        {
          store.get('stage') === 'register-imported' &&
          <CoreAddressRegistrationForm
            currentWalletWithInfo={currentWalletWithInfo}
            wallets={wallets}
            setCurrentWallet={this.props.setCurrentWallet}
          />
        }
        {
          store.get('stage') === 'register-arbitrary' &&
          <ManualRegistrationForm />
        }
        {
          loading &&
          'loading'
        }
        {
          !loading &&
          <ButtonsWrapper>
            <StyledButton
              onClick={() => this.props.changeStage('start')}
              style={{ width: '7rem' }}
            >
              Go back
          </StyledButton>
            <StyledButton
              type="primary"
              disabled={disabledRegisterButton}
              onClick={() => this.props.register()}
            >
              Register address
          </StyledButton>
          </ButtonsWrapper>
        }
      </OuterWrapper>
    );
  }
}

NahmiiAirdriipRegistration.propTypes = { // eslint-disable-line
  changeStage: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  ledgerInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  wallets: PropTypes.object.isRequired,
};

CoreAddressRegistrationForm.propTypes = { // eslint-disable-line
  setCurrentWallet: PropTypes.func.isRequired,
  wallets: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
};

ManualRegistrationForm.propTypes = { // eslint-disable-line

};

Start.propTypes = { // eslint-disable-line
  changeStage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  store: makeSelectNahmiiAirdriipRegistration(),
  wallets: makeSelectWallets(),
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeStage: (...args) => dispatch(changeStage(...args)),
    register: () => dispatch(register()),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
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
