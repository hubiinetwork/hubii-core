/**
 *
 * HWPromptContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import HWPrompt from 'components/HWPrompt';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/NahmiiHoc/combined-selectors';


export class HWPromptContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      currentWalletWithInfo,
      ledgerInfo,
      trezorInfo,
      passedDeviceType,
    } = this.props;
    const deviceType = passedDeviceType || currentWalletWithInfo.get('type');
    return (
      <div style={this.props.style}>
        <HWPrompt
          deviceType={deviceType}
          ledgerInfo={ledgerInfo}
          trezorInfo={trezorInfo}
        />
      </div>
    );
  }
}

HWPromptContainer.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  ledgerInfo: PropTypes.object.isRequired,
  style: PropTypes.object,
  trezorInfo: PropTypes.object.isRequired,
  passedDeviceType: PropTypes.oneOf(['lns', 'trezor']),
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
});

const withConnect = connect(mapStateToProps, null);

export default compose(
  withConnect,
)(HWPromptContainer);
