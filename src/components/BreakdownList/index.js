import React from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { formatFiat } from 'utils/numberFormats';

import Text from 'components/ui/Text';
import NahmiiText from 'components/ui/NahmiiText';
import {
  Logo,
  Percentage,
  Label,
  FlexContainer,
  ToggleExpandedArrow,
  FlexItem,
  NahmiiBalancesWrapper,
} from './style';

const generateList = (data, extraInfo = false) => {
  if (data.length === 0) {
    return (
      <FlexItem>
        <div>
          <Logo
            src={getAbsolutePath('public/images/assets/ETH.svg')}
          />
          <Text>0</Text>
        &nbsp;
          <Label>ETH</Label>
        </div>
        {
        extraInfo &&
        <Percentage>
          {`${formatFiat(0, 'USD')}`}
        </Percentage>
      }
      </FlexItem>
    );
  }
  const sortedData = data.filter((item) => item.percentage >= 0).sort((a, b) => b.percentage - a.percentage);
  return sortedData.map((item) => (
    <FlexItem key={`token-${item.label}`}>
      <div>
        <Logo
          src={getAbsolutePath(`public/images/assets/${item.label}.svg`)}
        />
        <Text>{item.amount}</Text>
        &nbsp;
        <Label>{item.label}</Label>
      </div>
      {
        extraInfo &&
        <Percentage>
          {`${formatFiat(item.value, 'USD')} (${item.percentage > 1 ? item.percentage.toFixed(0) : '<1'}%)`}
        </Percentage>
      }
    </FlexItem>
    )
  );
};

class BreakdownList extends React.PureComponent {
  render() {
    const {
      combinedBreakdown,
      baseLayerBreakdown,
      nahmiiAvailableBreakdown,
      nahmiiCombinedBreakdown,
      nahmiiStagedBreakdown,
      nahmiiStagingBreakdown,
      expandedAmount,
    } = this.props;
    const { formatMessage } = this.props.intl;
    const combinedBalanceList = generateList(combinedBreakdown, true);
    const baseLayerBalanceList = generateList(baseLayerBreakdown);
    const nahmiiBalanceList = generateList(nahmiiCombinedBreakdown);
    const nahmiiAvailableBalanceList = generateList(nahmiiAvailableBreakdown);
    const nahmiiStagingBalanceList = generateList(nahmiiStagingBreakdown);
    const nahmiiStagedBalanceList = generateList(nahmiiStagedBreakdown);

    return (
      <div>
        <Text large>{formatMessage({ id: 'total_combined_balances' })}</Text>
        <FlexContainer>{combinedBalanceList}</FlexContainer>
        <br />
        <Text large>{formatMessage({ id: 'base_layer_balances' })}</Text>
        <FlexContainer>{baseLayerBalanceList}</FlexContainer>
        <br />
        <a onClick={this.props.togglePie} role="button" tabIndex="0" style={{ textDecoration: 'none' }}>
          <NahmiiText large /><Text large> { formatMessage({ id: 'balances' }) }</Text>
          <ToggleExpandedArrow
            expanded={expandedAmount}
          />
        </a>
        <FlexContainer>{nahmiiBalanceList}</FlexContainer>
        <NahmiiBalancesWrapper expanded={expandedAmount}>
          <Text>{formatMessage({ id: 'available' })}</Text>
          <FlexContainer>{nahmiiAvailableBalanceList}</FlexContainer>
          <br />
          <Text>{formatMessage({ id: 'staging' })}</Text>
          <FlexContainer>{nahmiiStagingBalanceList}</FlexContainer>
          <br />
          <Text>{formatMessage({ id: 'staged' })}</Text>
          <FlexContainer>{nahmiiStagedBalanceList}</FlexContainer>
        </NahmiiBalancesWrapper>
      </div>
    );
  }
  }

BreakdownList.propTypes = {
  togglePie: PropTypes.func.isRequired,
  expandedAmount: PropTypes.number.isRequired,
  combinedBreakdown: PropTypes.array.isRequired,
  nahmiiCombinedBreakdown: PropTypes.array.isRequired,
  baseLayerBreakdown: PropTypes.array.isRequired,
  nahmiiAvailableBreakdown: PropTypes.array.isRequired,
  nahmiiStagingBreakdown: PropTypes.array.isRequired,
  nahmiiStagedBreakdown: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
};

export default compose(
  injectIntl
)(BreakdownList);
