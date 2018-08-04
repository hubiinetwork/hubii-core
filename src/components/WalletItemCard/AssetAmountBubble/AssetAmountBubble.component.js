import * as React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { Wrapper, Span, Image } from './AssetAmountBubble.style';

/**
 * This Component  is useful  to show  name  and  amount of  a  wallet's  balance.
 */
const AssetAmountBubble = (props) => (
  <Wrapper>
    <Image src={getAbsolutePath(`public/images/assets/${props.name}.svg`)} />
    <Span>{props.amount}</Span>
  </Wrapper>
  );

AssetAmountBubble.propTypes = {
  /**
   * Name of the image to be shown in the bubble
   */
  name: PropTypes.string.isRequired,
  /**
   * Amount shown in the bubble
   */
  amount: PropTypes.string.isRequired,
};

export default AssetAmountBubble;
