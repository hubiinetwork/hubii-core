import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

import { formatFiat } from 'utils/numberFormats';
import Heading from 'components/ui/Heading';
import USBFlag from 'components/USBFlag';
import Notification from 'components/Notification';

import {
  Address,
  Balance,
  CopyButton,
  HeaderDetail,
  DetailWrapper,
  WalletHeaderWrapper,
  OverflowHidden,
} from './WalletHeader.style';
import WalletHeaderIcon from './WalletHeaderIcon';

/**
 * The WalletHeader Component
 *
 */

const WalletHeader = (props) => {
  const showNotification = () => {
    const success = true;
    const message = 'Address copied to clipboard';
    Notification(success, message);
  };
  return (
    <WalletHeaderWrapper>
      <WalletHeaderIcon
        iconType={props.iconType}
        onIconClick={props.onIconClick}
      />
      <OverflowHidden>
        {props.connected !== undefined && (
          <USBFlag connected={props.connected} />
        )}
        <HeaderDetail>
          <DetailWrapper>
            <Heading>{props.name}</Heading>
            <Address>
              {`${props.address}`}
              <CopyToClipboard text={`${props.address}`}>
                <CopyButton
                  type="icon"
                  icon="copy"
                  size={'small'}
                  onClick={showNotification}
                  key={2}
                />
              </CopyToClipboard>
            </Address>
          </DetailWrapper>
          <DetailWrapper>
            <Balance large>{formatFiat(props.balance, 'USD')}</Balance>
          </DetailWrapper>
        </HeaderDetail>
      </OverflowHidden>
    </WalletHeaderWrapper>
  );
};
WalletHeader.propTypes = {
  /**
   * Type of icon to be shown in header.
   */
  iconType: PropTypes.string,
  /**
   * Name of the wallet.
   */
  name: PropTypes.string,
  /**
   * Address of the wallet
   */
  address: PropTypes.string,
  /**
   * Balance of the wallet
   */
  balance: PropTypes.number,
  /**
   *  Balance of the wallet
   */
  connected: PropTypes.bool,
  /**
   * Callback when header icon is clicked.
   */
  onIconClick: PropTypes.func,
};

export default WalletHeader;
