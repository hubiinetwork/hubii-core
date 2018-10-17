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
import { injectIntl } from 'react-intl';
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
    <PrimaryHeading large>{props.intl.formatMessage({ id: 'thanks_for_interest_airdriip' })}</PrimaryHeading>
    <SecondaryHeading>{props.intl.formatMessage({ id: 'has_address_been_imported_airdriip' })}</SecondaryHeading>
    <ButtonsWrapper>
      <StyledButtonTall
        onClick={() => props.changeStage('register-arbitrary')}
      >
        <div>{props.intl.formatMessage({ id: 'no' })}</div>
        <div>{props.intl.formatMessage({ id: 'airdriip_advanced' })}</div>
      </StyledButtonTall>
      <StyledButtonTall
        type="primary"
        onClick={() => props.changeStage('register-imported')}
      >
        <div>{props.intl.formatMessage({ id: 'yes' })}</div>
        <div>{props.intl.formatMessage({ id: 'one_click_registration' })}</div>
      </StyledButtonTall>
    </ButtonsWrapper>
  </StartWrapper>
);

export const CoreAddressRegistrationForm = (props) => (
  <StartWrapper>
    <PrimaryHeading large>{props.intl.formatMessage({ id: 'register_a_hubii_core_address' })}</PrimaryHeading>
    <SecondaryHeading>{props.intl.formatMessage({ id: 'has_address_been_imported_airdriip' })}</SecondaryHeading>
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
    <PrimaryHeading large>{props.intl.formatMessage({ id: 'manual_registration' })}</PrimaryHeading>
    <PrimaryHeading>{props.intl.formatMessage({ id: 'airdriip_manual_registration_instructions' })}</PrimaryHeading>
    <MessageTemplateWrapper>
      <SecondaryHeading style={{ marginRight: '1rem' }}>{messageTemplate}</SecondaryHeading>
      <CopyToClipboard text={messageTemplate}>
        <Button
          type="icon"
          icon="copy"
          size={'small'}
          onClick={() => props.notify('success', props.intl.formatMessage({ id: 'message_template_copied' }))}
        />
      </CopyToClipboard>
    </MessageTemplateWrapper>
    <Input
      style={{ marginBottom: '2rem' }}
      placeholder={props.intl.formatMessage({ id: 'ethereum_adderss' })}
      onChange={props.changeManualAddress}
    />
    <Input
      style={{ marginBottom: '2rem' }}
      placeholder={props.intl.formatMessage({ id: 'signed_keccak_hash_hex' })}
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
      intl,
    } = this.props;
    const { formatMessage } = intl;
    if (store.get('stage') === 'start') {
      return (
        <OuterWrapper>
          <Start
            changeStage={this.props.changeStage}
            intl={intl}
          />
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
            intl={intl}
          />
        }
        {
          store.get('stage') === 'register-arbitrary' &&
          <ManualRegistrationForm
            notify={this.props.notify}
            changeManualAddress={this.props.changeManualAddress}
            changeManualSignedMessage={this.props.changeManualSignedMessage}
            intl={intl}
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
              {formatMessage({ id: 'back' })}
            </StyledButton>
            <StyledButton
              type="primary"
              disabled={disabledRegisterButton}
              onClick={() => this.props.register()}
            >
              {formatMessage({ id: 'register_address' })}
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
  intl: PropTypes.object.isRequired,
};

CoreAddressRegistrationForm.propTypes = {
  setCurrentWallet: PropTypes.func.isRequired,
  wallets: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

ManualRegistrationForm.propTypes = {
  changeManualAddress: PropTypes.func.isRequired,
  changeManualSignedMessage: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

Start.propTypes = {
  changeStage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
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
  injectIntl
)(NahmiiAirdriipRegistration);
