import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { formatFiat } from 'utils/numberFormats';

import Text from 'components/ui/Text';
import {
  Logo,
  Percentage,
  Label,
  FlexContainer,
  FlexItem,
} from './style';

const BreakdownList = (props) => {
  const sortedData = props.data.filter((item) => item.percentage >= 0).sort((a, b) => b.percentage - a.percentage);
  const items = sortedData.map((item) => (
    <FlexItem key={`token-${item.label}`}>
      <div>
        <Logo
          src={getAbsolutePath(`public/images/assets/${item.label}.svg`)}
        />
        <Text>{item.amount}</Text>
        &nbsp;
        <Label>{item.label}</Label>
      </div>
      <Percentage>
        {`${formatFiat(item.value, 'USD')} (${item.percentage > 1 ? item.percentage.toFixed(0) : '<1'}%)`}</Percentage>
    </FlexItem>
  ));

  return <FlexContainer>{items}</FlexContainer>;
};

BreakdownList.propTypes = {
  /**
   * data prop to populate tokens.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      percentage: PropTypes.number,
    }).isRequired
  ),
};

export default BreakdownList;
