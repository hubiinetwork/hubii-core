import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { VictoryPie, VictoryContainer, VictoryTooltip } from 'victory';

import BreakdownList from 'components/BreakdownList';
import Heading from 'components/ui/Heading';
import Text from 'components/ui/Text';
import { formatFiat } from 'utils/numberFormats';
import { Wrapper } from './style';

/**
 * This component shows user's total coins' convertion in dollar and a relative chart.
 */
const Breakdown = ({ data = [], value, intl }) => {
  const { formatMessage } = intl;
  const chartData = data.map((item) => ({
    x: item.percentage,
    y: 2 * item.percentage,
    label: `${item.label}: ${item.percentage.toFixed(0)}%`,
  }));
  const colors = data.map((item) => item.color);
  if (chartData.length === 0) {
    return (
      <div>
        <Text large>{formatMessage({ id: 'total_fiat_value' })}</Text>
        <Heading large>{formatFiat(value, 'USD')}</Heading>;
      </div>
    );
  }
  return (
    <Wrapper>
      <div>
        <Text large>{formatMessage({ id: 'total_fiat_value' })}</Text>
        <Heading large>{formatFiat(value, 'USD')}</Heading>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '30rem' }}>
        <VictoryPie
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{ stroke: 'transparent', fill: 'rgba(0,0,0,0.5)' }}
              style={{ fill: 'white' }}
              width={90}
            />
          }
          innerRadius={90}
          colorScale={colors}
          data={chartData}
          containerComponent={
            <VictoryContainer
              responsive
              style={{ marginTop: '-2.5rem' }}
            />
          }
        />
      </div>
      <BreakdownList combinedBalances={data} />
    </Wrapper>
  );
};

Breakdown.propTypes = {
  /**
   * Total portfolio value in USD.
   */
  value: PropTypes.string.isRequired,
  /**
   * data  to populate  the Breakdowwn Component.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      percentage: PropTypes.number.isRequired,
      amount: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  intl: PropTypes.object,
};
export default injectIntl(Breakdown);
