import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import walletTypeDescriptions from '../walletTypeDescriptions';
import { Subtitle, Wrapper } from './WalletDetailPopoverContent.style';
import { humanFriendlyWalletType } from '../../../utils/wallet';

/**
 * This component shows specific content in the popover of WalletItemCard.
 */

const WalletDetailPopoverContent = (props) => {
  const description = walletTypeDescriptions[props.type];
  const {formatMessage} = props.intl
  return (
    <Wrapper>
      <div>{formatMessage({id: humanFriendlyWalletType(props.type)})}</div>
      <Subtitle>{description}</Subtitle>
      <div>{formatMessage({id: 'address'})}</div>
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

export default injectIntl(WalletDetailPopoverContent);
