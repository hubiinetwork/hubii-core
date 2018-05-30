import * as React from 'react';
import walletTypeDescriptions from '../../../helpers/walletTypeDescriptions';
import { Subtitle, Wrapper } from './WalletDetailPopoverContent.style';
import PropTypes from 'prop-types';

/**
 * This component shows specific content in the popover of WalletItemCard.
 */

const WalletDetailPopoverContent = props => {
  const description = walletTypeDescriptions[props.type];
  return (
    <Wrapper>
      <div>{props.type}</div>
      <Subtitle>{description}</Subtitle>
      <div>Wallet Address</div>
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
  type: PropTypes.string.isRequired
};

export default WalletDetailPopoverContent;
