import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

import { formatFiat } from 'utils/numberFormats';
import Heading from 'components/ui/Heading';
import WalletStatusIndicator from 'components/WalletStatusIndicator';
import Notification from 'components/Notification';

import {
  Address,
  Balance,
  CopyButton,
  HeaderDetail,
  DetailWrapper,
  WalletHeaderWrapper,
  OverflowHidden,
} from './style';
import WalletHeaderIcon from './WalletHeaderIcon';

/**
 * The WalletHeader Component
 *
 */
const showNotification = () => {
  const success = true;
  const message = 'Address copied to clipboard';
  Notification(success, message);
};

const WalletHeader = (props) => (
  <WalletHeaderWrapper>
    <WalletHeaderIcon
      iconType={props.iconType}
      onIconClick={props.onIconClick}
    />
    <OverflowHidden>
      <WalletStatusIndicator
        active={props.connected || props.isDecrypted}
        walletType={props.type}
      />
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
WalletHeader.propTypes = {
  iconType: PropTypes.string,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  connected: PropTypes.bool.isRequired,
  isDecrypted: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['software', 'hardware', 'watch']).isRequired,
  onIconClick: PropTypes.func.isRequired,
};

export default WalletHeader;
