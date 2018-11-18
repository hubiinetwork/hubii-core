import React from 'react';
import { Spring } from 'react-spring';
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
  FlexItem,
  NahmiiBalancesWrapper,
} from './style';

const generateList = (data, extraInfo = false) => {
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
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { combinedBalances, expandList } = this.props;
    const { formatMessage } = this.props.intl;
    const combinedBalanceList = generateList(combinedBalances, true);
    const baseLayerBalanceList = generateList(combinedBalances);
    const nahmiiBalanceList = generateList(combinedBalances);
    const nahmiiAvaliableBalanceList = generateList(combinedBalances);
    const nahmiiStagingBalanceList = generateList(combinedBalances);
    const nahmiiStagedBalanceList = generateList(combinedBalances);

    return (
      <Spring
        from={{ expanded: 0 }}
        to={{ expanded: expandList ? 1 : 0 }}
      >
        {
          (props) =>
            (<div style={{ marginTop: `${props.expanded * 2}rem`, overflow: 'hidden' }}>
              <Text large>{formatMessage({ id: 'total_combined_balances' })}</Text>
              <FlexContainer>{combinedBalanceList}</FlexContainer>
              <br />
              <Text large>{formatMessage({ id: 'base_layer_balances' })}</Text>
              <FlexContainer>{baseLayerBalanceList}</FlexContainer>
              <br />
              <span >
                <NahmiiText large /><Text large> { formatMessage({ id: 'balances' }) }</Text>
              </span>
              <FlexContainer>{nahmiiBalanceList}</FlexContainer>
              <NahmiiBalancesWrapper {...props}>

                <Text>{formatMessage({ id: 'avaliable' })}</Text>
                <FlexContainer>{nahmiiAvaliableBalanceList}</FlexContainer>
                <br />
                <Text>{formatMessage({ id: 'staging' })}</Text>
                <FlexContainer>{nahmiiStagingBalanceList}</FlexContainer>
                <br />
                <Text>{formatMessage({ id: 'staged' })}</Text>
                <FlexContainer>{nahmiiStagedBalanceList}</FlexContainer>
              </NahmiiBalancesWrapper>
            </div>
            )
          }
      </Spring>
    );
  }
}

BreakdownList.propTypes = {
  combinedBalances: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      percentage: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    }).isRequired
  ),
  expandList: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
};

export default compose(
  injectIntl
)(BreakdownList);
