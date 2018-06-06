import { List } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TextSecondary,
  TextPrimary,
  StyledListItem,
  AmountWrapper,
  Header,
  StyledSearch,
  StyledList,
  StyledAvatar
} from './CurrencyList.style';

/** The CurrencyList Component shows the list of currencies and search bar to search different currencies.
 */

export default class CurrencyList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeCurrency: '',
      data: props.data,
      search: ''
    };
  }
  render() {
    const { size, layout } = this.props;
    const { data } = this.state;
    const Item = (item, i) => (
      <StyledListItem
        active={this.state.activeCurrency === `${item.coin}` ? 1 : 0}
        onClick={() => this.updateActive(`${item.coin}`)}
      >
        <List.Item.Meta
          title={<TextPrimary>{item.coin}</TextPrimary>}
          avatar={
            <StyledAvatar
              src={`public/asset_images/${item.coin}.svg`}
              alt="coin"
            />
          }
        />
        <AmountWrapper>
          <Text>{item.coinAmount}</Text>
          <TextSecondary>{`$${item.coinAmountUSD}`}</TextSecondary>
        </AmountWrapper>
      </StyledListItem>
    );
    return (
      <StyledList
        size={size}
        dataSource={data}
        renderItem={Item}
        itemLayout={layout}
        header={
          <Header>
            <TextSecondary>Currencies</TextSecondary>
            <StyledSearch
              onChange={this.filterData}
              value={this.state.search}
            />
          </Header>
        }
      />
    );
  }
  filterData = event => {
    const { value } = event.target;
    const filtered = this.props.data.filter(item => {
      return item.coin.toLowerCase().includes(value.toLowerCase());
    });
    this.setState({ data: filtered, search: value });
  };
  updateActive = activeIcon => {
    this.setState({
      activeCurrency: activeIcon
    });
    this.props.onIconSelect(activeIcon);
  };
}

CurrencyList.propTypes = {
  /**
   * Array of icons with amount
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      coin: PropTypes.string.isRequired,
      coinAmount: PropTypes.string.isRequired,
      coinAmountUSD: PropTypes.string.isRequired
    })
  ),
  onIconSelect: PropTypes.func.isRequired
};
