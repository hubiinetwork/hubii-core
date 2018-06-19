import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Name,
  Address,
  Balance,
  CopyButton,
  HeaderDetail,
  DetailWrapper,
  WalletHeaderWrapper,
} from './WalletHeader.style';
import Notification from '../Notification';
import WalletHeaderIcon from './WalletHeaderIcon';
import CopyToClipboard from 'react-copy-to-clipboard';

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
        onIconClick={props.onIconClick}
        iconType={props.iconType}
      />
      <HeaderDetail>
        <DetailWrapper>
          <Name>{props.name}</Name>
          <Address>
            {`0x${props.address}`}
            <CopyToClipboard text={`0x${props.address}`}>
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
          <Balance>${props.balance}</Balance>
        </DetailWrapper>
      </HeaderDetail>
    </WalletHeaderWrapper>
  );
};
WalletHeader.propTypes = {
  /**
   * Type of icon to be shown in header
   */
  iconType: PropTypes.string,
  /**
   * Name of the wallet
   */
  name: PropTypes.string,
  /** Address of the wallet */
  address: PropTypes.string,
  /** Balance of the wallet */
  balance: PropTypes.number,
  /**
   * Callback when header icon is clicked.
   */
  onIconClick: PropTypes.func,
};

export default WalletHeader;
