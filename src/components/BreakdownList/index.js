import React from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import { formatFiat } from 'utils/numberFormats';

import Text from 'components/ui/Text';
import Collapse, { Panel } from 'components/ui/Collapse';
import NahmiiText from 'components/ui/NahmiiText';
import {
  Logo,
  Percentage,
  Label,
  FlexContainer,
  FlexItem,
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
  constructor(props) {
    super(props);
    this.state = { dropdownOpen: false };
    this.onToggleDropdown = this.onToggleDropdown.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dropdownOpen && !prevState.dropdownOpen) {
      setTimeout(() => window.scrollBy({
        top: 1000,
        left: 0,
        behavior: 'smooth',
      }), 150);
    }
  }

  onToggleDropdown(keys) {
    if (keys.includes('1')) {
      this.setState({ dropdownOpen: true });
    } else {
      this.setState({ dropdownOpen: false });
    }
  }

  render() {
    const { combinedBalances } = this.props;
    const { formatMessage } = this.props.intl;
    const combinedBalanceList = generateList(combinedBalances, true);
    const baseLayerBalanceList = generateList(combinedBalances);
    const nahmiiBalanceList = generateList(combinedBalances);
    const nahmiiAvaliableBalanceList = generateList(combinedBalances);
    const nahmiiStagingBalanceList = generateList(combinedBalances);
    const nahmiiStagedBalanceList = generateList(combinedBalances);

    return (
      <div>
        <Text large>{formatMessage({ id: 'total_combined_balances' })}</Text>
        <FlexContainer>{combinedBalanceList}</FlexContainer>
        <br />
        <Text large>{formatMessage({ id: 'base_layer_balances' })}</Text>
        <FlexContainer>{baseLayerBalanceList}</FlexContainer>
        <br />
        <span><NahmiiText large /><Text large> { formatMessage({ id: 'balances' }) }</Text></span>
        <FlexContainer>{nahmiiBalanceList}</FlexContainer>
        <Collapse
          bordered={false}
          onChange={this.onToggleDropdown}
        >
          <Panel
            header="Show nahmii balance breakdown"
            key="1"
            forceRender
          >
            <div style={{ marginLeft: '2rem' }}>
              <Text>{formatMessage({ id: 'avaliable' })}</Text>
              <FlexContainer>{nahmiiAvaliableBalanceList}</FlexContainer>
              <br />
              <Text>{formatMessage({ id: 'staging' })}</Text>
              <FlexContainer>{nahmiiStagingBalanceList}</FlexContainer>
              <br />
              <Text>{formatMessage({ id: 'staged' })}</Text>
              <FlexContainer>{nahmiiStagedBalanceList}</FlexContainer>
            </div>
          </Panel>
        </Collapse>
      </div>
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
  intl: PropTypes.object.isRequired,
};

export default compose(
  injectIntl
)(BreakdownList);
