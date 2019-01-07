import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import USBConnected from '../../../public/images/usb-icon.svg';
import USBDisconnected from '../../../public/images/usb-icon-white.svg';
import Locked from '../../../public/images/lock.png';
import Unlocked from '../../../public/images/lock_open.svg';

import { Slanted, Icon } from './style';

/**
 * This component shows status of the user's API connection with wallet by showing connected flag.
 * For proper UI, give style={{overflow:'hidden}} to the parent container.
 */

const WalletStatusIndicator = ({ active, walletType }) => {
  let title;
  let icon;
  if (walletType === 'software') {
    if (active) {
      title = 'Unlocked';
      icon = Unlocked;
    } else {
      title = 'Locked';
      icon = Locked;
    }
  } else if (active) {
    title = 'Connected';
    icon = USBConnected;
  } else {
    title = 'Disconnected';
    icon = USBDisconnected;
  }
  return (
    <Slanted active={active}>
      <Tooltip
        placement="right"
        title={title}
      >
        <Icon walletType={walletType} src={icon} />
      </Tooltip>
    </Slanted>
  );
};
WalletStatusIndicator.propTypes = {
  active: PropTypes.bool.isRequired,
  walletType: PropTypes.oneOf(['software', 'hardware']),
};

export default WalletStatusIndicator;
