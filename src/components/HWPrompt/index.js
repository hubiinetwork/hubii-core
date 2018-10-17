/**
*
* HWPrompt
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { injectIntl } from 'react-intl';

import Text from 'components/ui/Text';

import {
  OuterWrapper,
  Row,
  DescriptiveIcon,
  StatusIcon,
  SingleRowWrapper,
  SingleRowIcon,
  ConfTxDeviceImg,
  ConfTxShield,
} from './style';

const confTxOnDevicePrompt = (deviceType, { formatMessage }) => (
  <SingleRowWrapper>
    <ConfTxShield src={getAbsolutePath('public/images/shield.png')} />
    <ConfTxDeviceImg src={getAbsolutePath(`public/images/conf-tx-${deviceType}.png`)} />
    <Text large>{ formatMessage({ id: 'verify_device_details' }) }</Text>
  </SingleRowWrapper>
);

const singleRowMsg = (msg, iconType, iconColor) => (
  <SingleRowWrapper>
    <SingleRowIcon type={iconType || 'loading'} color={iconColor} />
    <Text large>{msg}</Text>
  </SingleRowWrapper>
);

const lnsPrompt = (ledgerInfo, { formatMessage }) => {
  const error = ledgerInfo.get('error');
  // check if device is connected
  if (ledgerInfo.get('ethConnected')) {
    return singleRowMsg(
        formatMessage({ id: 'hw_connected' }),
        'check'
      );
  }

  // check the error
  if (error && error.includes('ledger_connected_not_browser_support_error')) {
    return singleRowMsg(
      formatMessage({ id: 'ledger_set_browser_support_no' })
    );
  } else if
  (
    error
    && !error.includes('ledger_connected_not_eth_open_error')
    && !error.includes('ledger_not_detected_error')
  ) {
    return singleRowMsg(
      formatMessage({ id: 'hw_unknown_error' }),
      'exclamation-circle-o',
      'orange'
    );
  }
  // no errors, show prompts
  let stage;
  if (!ledgerInfo.get('connected')) {
    stage = 'connect';
  } else if (!ledgerInfo.get('ethConnected')) {
    stage = 'openApp';
  } else {
    return singleRowMsg(
        formatMessage({ id: 'hw_connected' }),
        'check'
    );
  }
  return (
    <OuterWrapper>
      <Row pos="top" active={stage === 'connect'}>
        <DescriptiveIcon
          src={stage === 'connect' ?
            getAbsolutePath('public/images/hw-wallet-usb-green.png') :
            getAbsolutePath('public/images/hw-wallet-usb-white.png')
          }
        />
        <Text>{formatMessage({ id: 'ledger_connect_unlock' })}</Text>
        <StatusIcon
          type={stage === 'connect' ? 'loading' : 'check'}
        />
      </Row>
      <Row pos="bottom" active={stage === 'openApp'}>
        <DescriptiveIcon
          src={stage === 'connect' ?
            getAbsolutePath('public/images/hw-wallet-eth-grey.png') :
            getAbsolutePath('public/images/hw-wallet-eth-green.png')
          }
        />
        <Text>{formatMessage({ id: 'ledger_open_eth_app' })}</Text>
        <StatusIcon
          type={stage === 'openApp' ? 'loading' : 'ellipsis'}
        />
      </Row>
    </OuterWrapper>
  );
};

const trezorPrompt = (trezorInfo, { formatMessage }) => {
  const error = trezorInfo.get('error');
  if (error && !error.includes('trezor_not_connected_error')) {
    return singleRowMsg(
        formatMessage({ id: 'hw_unknown_error' }),
        'exclamation-circle-o',
        'orange'
      );
  }

    // device connection is good
  if (trezorInfo.get('status') === 'connected') {
    return singleRowMsg(
        formatMessage({ id: 'hw_connected' }),
        'check'
      );
  }

    // trezor needs to be connected
  return singleRowMsg(
      formatMessage({ id: 'trezor_connect_unlock' })
    );
};

class HWPrompt extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      deviceType,
      ledgerInfo,
      trezorInfo,
      intl,
    } = this.props;
    const confTxOnDevice = deviceType === 'lns'
      ? ledgerInfo.get('confTxOnDevice')
      : trezorInfo.get('confTxOnDevice');

    // tx needs to be confirmed on device
    if (confTxOnDevice) {
      return confTxOnDevicePrompt(deviceType, intl);
    }

    // handle ledger
    if (deviceType === 'lns') {
      return lnsPrompt(ledgerInfo, intl);
    }

    // handle trezor
    return trezorPrompt(trezorInfo, intl);
  }
}

HWPrompt.propTypes = {
  deviceType: PropTypes.oneOf(['lns', 'trezor']),
  ledgerInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  intl: PropTypes.object,
};

export default injectIntl(HWPrompt);
