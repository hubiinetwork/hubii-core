import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { humanFriendlyWalletType } from 'utils/wallet';

import Text from 'components/ui/Text';
import { Subtitle, Wrapper } from './style';

/**
 * This component shows specific content in the popover of WalletItemCard.
 */

const WalletDetailPopoverContent = (props) => {
  const { formatMessage } = props.intl;
  return (
    <Wrapper>
      <Text large>{formatMessage({ id: humanFriendlyWalletType(props.type) })}</Text>
      <Text large>{formatMessage({ id: 'address' })}</Text>
      <Subtitle>{props.address}</Subtitle>
    </Wrapper>
  );
};

WalletDetailPopoverContent.propTypes = {
  address: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(WalletDetailPopoverContent);
