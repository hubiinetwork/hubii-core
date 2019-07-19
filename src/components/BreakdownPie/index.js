import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Spring } from 'react-spring';
import { VictoryPie, VictoryContainer, VictoryTooltip } from 'victory';
import ColorHash from 'color-hash';
import { getBreakdown } from 'utils/wallet';

import BreakdownList from 'components/BreakdownList';
import Text from 'components/ui/Text';
import { formatFiat } from 'utils/numberFormats';
import { Wrapper, StyledHeading, StyledNumericText } from './style';

/**
 * This component shows user's total coins' convertion in dollar and a relative chart.
 */
class Breakdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPie: true };
    this.togglePie = this.togglePie.bind(this);
  }

  togglePie() {
    this.setState({ showPie: !this.state.showPie });
  }

  render() {
    const { showPie } = this.state;
    const {
      totalBalances,
      supportedAssets,
      intl,
    } = this.props;
    const { formatMessage } = intl;
    const value = +totalBalances.getIn(['combined', 'total', 'usd']).toFixed(6);
    if (value === 0 || supportedAssets.get('loading') || supportedAssets.get('error')) {
      return (
        <div>
          <Text large>{formatMessage({ id: 'total_fiat_value' })}</Text>
          <StyledHeading large>{formatFiat(value, 'USD')}</StyledHeading>
        </div>
      );
    }
    const combinedBreakdown = getBreakdown(totalBalances.get('combined'), supportedAssets);
    const chartData = combinedBreakdown.map((item) => ({
      x: item.percentage,
      y: 2 * item.percentage,
      label: `${item.label}: ${item.percentage.toFixed(0)}%`,
    }));
    const colorHash = new ColorHash();
    const colors = combinedBreakdown.map((item) => {
      let color;
      switch (item.label) {
        case 'ETH': {
          color = '#647BE7';
          break;
        }
        case 'HBT': {
          color = '#204969';
          break;
        }
        case 'NII': {
          color = '#fff7f7';
          break;
        }
        default: {
          color = colorHash.hex(item.label);
        }
      }
      return color;
    });
    return (
      <Wrapper>
        <div>
          <Text large>{formatMessage({ id: 'total_fiat_value' })}</Text>
          <StyledHeading large>
            <StyledNumericText large value={value.toString()} type="fiat" />
          </StyledHeading>
        </div>
        <Spring
          from={{ height: 'auto', opacity: 1, listExpanded: 0 }}
          to={{ height: showPie ? 'auto' : 0, opacity: showPie ? 1 : 0, listExpanded: showPie ? 0 : 1 }}
        >
          {
            (props) =>
              (<div>
                <div
                  style={{
                    ...props,
                    display: 'flex',
                    justifyContent: 'center',
                    maxWidth: '30rem',
                    maxHeight: '25rem',
                    marginBottom: '1rem',
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
                </div>
                <div>
                  <BreakdownList
                    togglePie={this.togglePie}
                    expandedAmount={props.listExpanded}
                    combinedBreakdown={combinedBreakdown}
                    baseLayerBreakdown={getBreakdown(totalBalances.get('baseLayer'), supportedAssets)}
                    nahmiiAvailableBreakdown={getBreakdown(totalBalances.get('nahmiiAvailable'), supportedAssets)}
                    nahmiiCombinedBreakdown={getBreakdown(totalBalances.get('nahmiiCombined'), supportedAssets)}
                    nahmiiStagingBreakdown={getBreakdown(totalBalances.get('nahmiiStaging'), supportedAssets)}
                    nahmiiStagedBreakdown={getBreakdown(totalBalances.get('nahmiiStaged'), supportedAssets)}
                  />
                </div>
              </div>
              )
          }
        </Spring>
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
