import * as React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { Wrapper, Span, Image } from './style';

const AssetAmountBubble = (props) => (
  <Wrapper>
    <Image src={getAbsolutePath(`public/images/assets/${props.name}.svg`)} />
    <Span>{props.amount}</Span>
  </Wrapper>
  );

AssetAmountBubble.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default AssetAmountBubble;
