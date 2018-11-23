import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Spring } from 'react-spring';
import { VictoryPie, VictoryContainer, VictoryTooltip } from 'victory';
import { getBreakdown } from 'utils/wallet';

import BreakdownList from 'components/BreakdownList';
import Heading from 'components/ui/Heading';
import Text from 'components/ui/Text';
import { formatFiat } from 'utils/numberFormats';
import { Wrapper } from './style';

/**
 * This component shows user's total coins' convertion in dollar and a relative chart.
 */
class Breakdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPie: true };
    this.togglePie = this.togglePie.bind(this);
  }

  togglePie(showPie) {
    this.setState({ showPie });
  }

  render() {
    const { showPie } = this.state;
    const {
      totalBalances,
      supportedAssets,
      intl,
    } = this.props;
    const { formatMessage } = intl;
    const combinedBreakdown = getBreakdown(totalBalances.get('combined'), supportedAssets);
    const value = +totalBalances.getIn(['combined', 'total', 'usd']).toFixed(6);
    const chartData = combinedBreakdown.map((item) => ({
      x: item.percentage,
      y: 2 * item.percentage,
      label: `${item.label}: ${item.percentage.toFixed(0)}%`,
    }));
    const colors = combinedBreakdown.map((item) => item.color);
    if (value === '0') {
      return (
        <div>
          <Text large>{formatMessage({ id: 'total_fiat_value' })}</Text>
          <Heading large>{formatFiat(value, 'USD')}</Heading>;
      </div>
      );
    }
    return (
      <Wrapper allowOverflow={!showPie}>
        <div>
          <Text large>{formatMessage({ id: 'total_fiat_value' })}</Text>
          <Heading large>{formatFiat(value, 'USD')}</Heading>
        </div>
        <Spring
          from={{ height: 'auto', opacity: 1 }}
          to={{ height: showPie ? 'auto' : 0, opacity: showPie ? 1 : 0 }}
        >
          {
            (props) =>
              (<div
                style={{
                  ...props,
                  display: 'flex',
                  justifyContent: 'center',
                  maxWidth: '30rem',
                }}
              >
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
                    />
                  }
                />
              </div>)
            }
        </Spring>
        <div
          onMouseEnter={() => this.togglePie(false)}
          onMouseLeave={() => this.togglePie(true)}
        >
          <BreakdownList
            onExpandList={this.togglePie}
            expandList={!this.state.showPie}
            combinedBreakdown={combinedBreakdown}
            baseLayerBreakdown={getBreakdown(totalBalances.get('baseLayer'), supportedAssets)}
            nahmiiAvaliableBreakdown={getBreakdown(totalBalances.get('nahmiiAvaliable'), supportedAssets)}
            nahmiiCombinedBreakdown={getBreakdown(totalBalances.get('nahmiiCombined'), supportedAssets)}
            nahmiiStagingBreakdown={getBreakdown(totalBalances.get('nahmiiStaging'), supportedAssets)}
            nahmiiStagedBreakdown={getBreakdown(totalBalances.get('nahmiiStaged'), supportedAssets)}
          />
        </div>
      </Wrapper>
    );
  }
}

Breakdown.propTypes = {
  /**
   * Total portfolio value in USD.
   */
  totalBalances: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  intl: PropTypes.object,
};
export default injectIntl(Breakdown);
