/**
 *
 * NahmiiAirdriipRegistration
 *
 */

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Spin } from 'antd';
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
import { notify } from 'containers/App/actions';

import {
  makeSelectWallets,
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import HWPromptContainer from 'containers/HWPromptContainer';

import SelectWallet from 'components/ui/SelectWallet';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

import { makeSelectNahmiiAirdriipRegistration } from './selectors';
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
  MessageTemplateWrapper,
} from './style';
import {
  changeStage,
  register,
  changeManualAddress,
  changeManualSignedMessage,
} from './actions';

const messageTemplate = '\\x19Ethereum Signed Message:\nI wish the register the address <address> for the nahmii airdriip';

export const Start = (props) => (
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

export const CoreAddressRegistrationForm = (props) => (
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


export const ManualRegistrationForm = (props) => (
  <StartWrapper>
    <PrimaryHeading large>Manual registration</PrimaryHeading>
    <PrimaryHeading>{'Using your address\'s private key, sign the KECCAK-256 hash of the following message:'}</PrimaryHeading>
    <MessageTemplateWrapper>
      <SecondaryHeading style={{ marginRight: '1rem' }}>{messageTemplate}</SecondaryHeading>
      <CopyToClipboard text={messageTemplate}>
        <Button
          type="icon"
          icon="copy"
          size={'small'}
          onClick={() => props.notify('success', 'Message template copied to clipboard')}
        />
      </CopyToClipboard>
    </MessageTemplateWrapper>
    <Input
      style={{ marginBottom: '2rem' }}
      placeholder="Ethereum address"
      onChange={props.changeManualAddress}
    />
    <Input
      style={{ marginBottom: '2rem' }}
      placeholder="Signed KECCAK-256 hash hex"
      onChange={props.changeManualSignedMessage}
    />
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
          <ManualRegistrationForm
            notify={this.props.notify}
            changeManualAddress={this.props.changeManualAddress}
            changeManualSignedMessage={this.props.changeManualSignedMessage}
          />
        }
        {
          loading &&
          <Spin size="large" />
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
  notify: PropTypes.func.isRequired,
  changeManualAddress: PropTypes.func.isRequired,
  changeManualSignedMessage: PropTypes.func.isRequired,
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
  changeManualAddress: PropTypes.func.isRequired,
  changeManualSignedMessage: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
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
    notify: (...args) => dispatch(notify(...args)),
    changeManualAddress: (...args) => dispatch(changeManualAddress(...args)),
    changeManualSignedMessage: (...args) => dispatch(changeManualSignedMessage(...args)),
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
