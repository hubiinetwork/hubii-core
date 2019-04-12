/**
 *
 * NahmiiAirdriipRegistration
 *
 */

import React from 'react';
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
  makeSelectCurrentNetwork,
} from 'containers/App/selectors';
import {
  makeSelectExecutableWallets,
} from 'containers/WalletHoc/selectors';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/NahmiiHoc/combined-selectors';
import HWPromptContainer from 'containers/HWPromptContainer';

import AirdriipRegistrationStatusUi from 'components/AirdriipRegistrationStatusUi';
import SelectWallet from 'components/ui/SelectWallet';
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
  NetworkWarning,
} from './style';
import {
  changeStage,
  register,
  changeManualAddress,
  changeManualSignedMessage,
} from './actions';
import ScrollableContentWrapper from '../../components/ui/ScrollableContentWrapper';


export const Start = (props) => (
  <StartWrapper>
    <PrimaryHeading large>
      {props.intl.formatMessage({ id: 'thanks_for_interest_airdriip' })}
    </PrimaryHeading>
    <SecondaryHeading>
      {props.intl.formatMessage({ id: 'has_address_been_imported_airdriip' })}
    </SecondaryHeading>
    <ButtonsWrapper>
      <StyledButtonTall onClick={() => props.changeStage('register-arbitrary')}>
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
    <PrimaryHeading large>
      {props.intl.formatMessage({ id: 'register_a_hubii_core_address' })}
    </PrimaryHeading>
    <SecondaryHeading>
      {props.intl.formatMessage({ id: 'select_address_to_register' })}
    </SecondaryHeading>
    <SelectWallet
      wallets={props.wallets.toJS()}
      onChange={(address) => props.setCurrentWallet(address)}
      value={props.currentWalletWithInfo.get('address')}
      style={{ marginBottom: '2rem' }}
    />
    {
      isHardwareWallet(props.currentWalletWithInfo.get('type'))
      && props.showHwPrompt && (
        <HWPromptContainer
          style={{ marginBottom: '2rem' }}
          passedDeviceType={props.currentWalletWithInfo.get('type')}
        />
    )
    }
  </StartWrapper>
);

export const ManualRegistrationForm = (props) => (
  <StartWrapper>
    <PrimaryHeading large>
      {props.intl.formatMessage({ id: 'manual_registration' })}
    </PrimaryHeading>
    <PrimaryHeading>
      {props.intl.formatMessage({ id: 'airdriip_manual_registration_instructions' })}
    </PrimaryHeading>
    <Input
      style={{ margin: '2rem 0' }}
      placeholder={props.intl.formatMessage({ id: 'ethereum_address' })}
      onChange={(e) => props.changeManualAddress(e.target.value)}
      value={props.addressValue}
    />
    <Input
      style={{ marginBottom: '2rem' }}
      placeholder={props.intl.formatMessage({ id: 'signature_hex_string' })}
      onChange={(e) => props.changeManualSignedMessage(e.target.value)}
      value={props.signedMessageValue}
    />
  </StartWrapper>
);


export class NahmiiAirdriipRegistration extends React.Component {
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
      currentNetwork,
    } = this.props;
    const { formatMessage } = intl;

    const addressRegistrationStatus = store.getIn([
      'addressStatuses',
      currentWalletWithInfo.get('address'),
    ]);

    const disabledRegisterButton =
      store.get('stage') === 'register-imported'
      && (!walletReady(
          currentWalletWithInfo.get('type'),
          ledgerInfo,
          trezorInfo
        )
      || addressRegistrationStatus !== 'unregistered');

    const registering = store.get('registering');

    return (
      <ScrollableContentWrapper>
        <OuterWrapper>
          {
          currentNetwork.provider._network.chainId !== 1 &&
          <NetworkWarning
            message={intl.formatMessage({ id: 'warning' })}
            description={intl.formatMessage({ id: 'airdriip_testnet_warning' })}
            type="warning"
            showIcon
          />
          }
          {
          store.get('stage') === 'start' && (
            <Start changeStage={this.props.changeStage} intl={intl} />
          )
          }
          {
          store.get('stage') === 'register-imported' && (
            <CoreAddressRegistrationForm
              currentWalletWithInfo={currentWalletWithInfo}
              showHwPrompt={addressRegistrationStatus === 'unregistered'}
              wallets={wallets}
              setCurrentWallet={this.props.setCurrentWallet}
              intl={intl}
            />
          )
          }
          {
          store.get('stage') === 'register-arbitrary' && (
            <ManualRegistrationForm
              notify={this.props.notify}
              changeManualAddress={this.props.changeManualAddress}
              changeManualSignedMessage={this.props.changeManualSignedMessage}
              addressValue={store.getIn(['manualRegistrationInfo', 'address'])}
              signedMessageValue={store.getIn(['manualRegistrationInfo', 'signedMessage'])}
              intl={intl}
            />
          )
          }
          {
          registering && <Spin size="large" />
          }
          {
          store.get('stage') === 'register-imported'
          && addressRegistrationStatus !== 'unregistered' &&
            <AirdriipRegistrationStatusUi
              loading={!addressRegistrationStatus}
              status={addressRegistrationStatus}
              style={{ width: '33rem', marginBottom: '2rem' }}
            />
          }
          {
          !registering && !(store.get('stage') === 'start') && (
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
          )
        }
        </OuterWrapper>
      </ScrollableContentWrapper>
    );
  }
}

NahmiiAirdriipRegistration.propTypes = {
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
  currentNetwork: PropTypes.object.isRequired,
};

CoreAddressRegistrationForm.propTypes = {
  setCurrentWallet: PropTypes.func.isRequired,
  wallets: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  showHwPrompt: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
};

ManualRegistrationForm.propTypes = {
  changeManualAddress: PropTypes.func.isRequired,
  changeManualSignedMessage: PropTypes.func.isRequired,
  addressValue: PropTypes.string.isRequired,
  signedMessageValue: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

Start.propTypes = {
  changeStage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  store: makeSelectNahmiiAirdriipRegistration(),
  wallets: makeSelectExecutableWallets(),
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  currentNetwork: makeSelectCurrentNetwork(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeStage: (...args) => dispatch(changeStage(...args)),
    register: () => dispatch(register()),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
    notify: (...args) => dispatch(notify(...args)),
    changeManualAddress: (...args) => dispatch(changeManualAddress(...args)),
    changeManualSignedMessage: (...args) =>
      dispatch(changeManualSignedMessage(...args)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({
  key: 'nahmiiAirdriipRegistration',
  reducer,
});
const withSaga = injectSaga({ key: 'nahmiiAirdriipRegistration', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl
)(NahmiiAirdriipRegistration);
