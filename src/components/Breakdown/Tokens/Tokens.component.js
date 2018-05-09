import React from 'react';
import {
  Logo,
  Percentage,
  Label,
  FlexContainer,
  FlexItem
} from './Tokens.style';
import PropTypes from 'prop-types';

/**
 * This component is used to show percentage of every coin in the wallet.
 */
const Tokens = props => {
  const sortedData = props.data.sort((a, b) => {
    return b.percentage - a.percentage;
  });
  const items = sortedData.map(item => (
    <FlexItem>
      <Logo src={`public/asset_images/${item.label}.svg`} />
      <Label>{item.label}</Label>
      <Percentage>{item.percentage}%</Percentage>
    </FlexItem>
  ));
  return <FlexContainer>{items}</FlexContainer>;
};

Tokens.propTypes = {
  /**
   * data prop to populate tokens.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      percentage: PropTypes.number
    }).isRequired
  )
};

export default Tokens;
