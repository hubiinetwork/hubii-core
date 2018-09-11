/**
 *
 * HwpromptContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { isHardwareWallet } from 'utils/wallet';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import HWPrompt from 'components/HWPrompt';
import {
  makeSelectCurrentWalletWithInfo,
  makeSelectErrors,
  makeSelectTrezorInfo,
} from 'containers/WalletHOC/selectors';


export class HWPromptContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      currentWalletWithInfo,
      ledgerInfo,
      trezorInfo,
      errors,
      passedDeviceType,
    } = this.props;
    let confTxOnDevice = false;
    const deviceType = passedDeviceType || currentWalletWithInfo.get('type');
    if (isHardwareWallet(deviceType)) {
      confTxOnDevice = deviceType === 'lns' ?
        ledgerInfo.get('confTxOnDevice') :
        trezorInfo.get('confTxOnDevice');
    }
    let hardwareError;
    if (currentWalletWithInfo.get('type') === 'lns') hardwareError = ledgerInfo.get('error');
    if (currentWalletWithInfo.get('type') === 'trezor') hardwareError = errors.get('trezorError');
    return (
      <HWPrompt
        deviceType={deviceType}
        error={hardwareError}
        confTxOnDevice={confTxOnDevice}
        ledgerInfo={ledgerInfo}
      />
    );
  }
}

HWPromptContainer.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  ledgerInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  passedDeviceType: PropTypes.oneOf(['lns', 'trezor']),
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorInfo(),
  errors: makeSelectErrors(),
});

const withConnect = connect(mapStateToProps, null);

export default compose(
  withConnect,
)(HWPromptContainer);
