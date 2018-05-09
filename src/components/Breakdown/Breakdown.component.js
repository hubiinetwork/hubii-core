import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { TotalAmount, Title } from './Breakdown.style';
import PropTypes from 'prop-types';
import { VictoryPie, VictoryContainer, VictoryTooltip } from 'victory';
import Tokens from './Tokens';

/**
 * This component shows user's total coins' convertion in dollar and a relative chart.
 */
class Breakdown extends React.Component {
  render() {
    const data = this.props.data.map(item => ({
      x: item.percentage,
      y: 2 * item.percentage,
      label: `${item.label}: ${item.percentage}%`
    }));
    const colors = this.props.data.map(item => item.color);
    const labels = this.props.data.map(item => ({
      label: item.label,
      percentage: item.percentage
    }));
    return (
      <div>
        <SectionHeading>Breakdown</SectionHeading>
        {this.props.value && (
          <div>
            <Title>Total Value</Title>
            <TotalAmount>${this.props.value}</TotalAmount>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <VictoryPie
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{
                  stroke: 'transparent',
                  fill: 'rgba(0,0,0,0.5)'
                }}
                style={{
                  fill: 'white'
                }}
                width={90}
              />
            }
            innerRadius={90}
            animate={{
              onLoad: {
                duration: 1200,
                before: () => ({ _y: -1200, label: ' ' }),
                after: datum => ({ _y: datum._y })
              }
            }}
            colorScale={colors}
            data={data}
            containerComponent={
              <VictoryContainer
                responsive={true}
                style={{
                  marginTop: '-35px',
                  width: '90%',
                  height: '90%'
                }}
              />
            }
          />
        </div>
        <SectionHeading>Tokens</SectionHeading>
        <Tokens data={labels} />
      </div>
    );
  }
}

Breakdown.propTypes = {
  /**
   * Total  value in dollars.
   */
  value: PropTypes.node,
  /**
   * data  to populate  the Breakdowwn Component.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      percentage: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};
export default Breakdown;
