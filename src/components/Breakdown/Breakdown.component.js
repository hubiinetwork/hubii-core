import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { VictoryPie, VictoryContainer, VictoryTooltip } from 'victory';
import SectionHeading from 'components/ui/SectionHeading';
import Heading from 'components/ui/Heading';
import { formatFiat } from 'utils/numberFormats';
import { Title, Wrapper } from './Breakdown.style';
import Tokens from './Tokens';

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
    return <div />;
  }
  return (
    <Wrapper>
      <SectionHeading>{formatMessage({ id: 'balance_breakdown' })}</SectionHeading>
      {(
        <div>
          <Title>{formatMessage({ id: 'total_fiat_value' })}</Title>
          <Heading large>{formatFiat(value, 'USD')}</Heading>
        </div>
      )}
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
              style={{ marginTop: '-2.5rem', paddingBottom: '1rem' }}
            />
          }
        />
      </div>
      {
        value !== '0' &&
          <div>
            <SectionHeading>{formatMessage({ id: 'assets' })}</SectionHeading>
            <Tokens data={data} />
          </div>
      }
    </Wrapper>
  );
};

Breakdown.propTypes = {
  /**
   * Total  value in dollars.
   */
  value: PropTypes.string.isRequired,
  /**
   * data  to populate  the Breakdowwn Component.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      percentage: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  intl: PropTypes.object,
};
export default injectIntl(Breakdown);
