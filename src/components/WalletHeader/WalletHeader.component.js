import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  Name,
  Address,
  Balance,
  CopyButton,
  HeaderDetail,
  DetailWrapper,
  WalletHeaderWrapper,
  OverflowHidden,
} from './WalletHeader.style';
import USBFlag from '../USBFlag';
import Notification from '../Notification';
import WalletHeaderIcon from './WalletHeaderIcon';
import { formatFiat } from '../../utils/numberFormats';

/**
 * The WalletHeader Component
 *
 */

const WalletHeader = (props) => {
  const showNotification = () => {
    const success = true;
    const message = 'Address copied to clipboard.';
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
            <Name>{props.name}</Name>
            <Address>
              {`${props.address}`}
              <CopyToClipboard text={`${props.address}`}>
                <CopyButton
                  type="primary"
                  shape="circle"
                  icon="copy"
                  size={'small'}
                  onClick={showNotification}
                  key={2}
                />
              </CopyToClipboard>
            </Address>
          </DetailWrapper>
          <DetailWrapper>
            <Balance>${formatFiat(props.balance, 'USD')}</Balance>
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
