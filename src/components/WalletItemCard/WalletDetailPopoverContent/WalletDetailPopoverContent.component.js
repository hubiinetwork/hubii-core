import React from 'react';
import PropTypes from 'prop-types';
import walletTypeDescriptions from '../walletTypeDescriptions';
import { Subtitle, Wrapper } from './WalletDetailPopoverContent.style';
import { humanFriendlyWalletType } from '../../../utils/wallet';

/**
 * This component shows specific content in the popover of WalletItemCard.
 */

const WalletDetailPopoverContent = (props) => {
  const description = walletTypeDescriptions[props.type];
  return (
    <Wrapper>
      <div>{humanFriendlyWalletType(props.type)}</div>
      <Subtitle>{description}</Subtitle>
      <div>Address</div>
      <Subtitle>{props.address}</Subtitle>
    </Wrapper>
  );
};

WalletDetailPopoverContent.propTypes = {
  /**
   * address of wallet item.
   */
  address: PropTypes.string.isRequired,
  /**
   * type of wallet item.
   */
  type: PropTypes.string.isRequired,
};

export default WalletDetailPopoverContent;
