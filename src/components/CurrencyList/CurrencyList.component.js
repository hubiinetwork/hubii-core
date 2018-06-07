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
  StyledAvatar,
  StyledPrice,
} from './CurrencyList.style';

/** The CurrencyList Component shows the list of currencies and search bar to search different currencies.
 */

export default class CurrencyList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      search: '',
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.filterData({ target: { value: this.state.search } });
    }
  }
  render() {
    const { size, layout, activeCurrency, onCurrencySelect } = this.props;
    const { data } = this.state;
    const Item = (item, i) => (
      <StyledListItem
        active={activeCurrency === `${item.coin}` ? 1 : 0}
        onClick={() => onCurrencySelect(`${item.coin}`)}
      >
        <List.Item.Meta
          title={<TextPrimary>{item.coin}</TextPrimary>}
          avatar={
            <StyledAvatar
              src={`/public/asset_images/${item.coin}.svg`}
              alt="coin"
            />
          }
        />
        <AmountWrapper>
          <Text>{item.coinAmount}</Text>
          <TextSecondary>
            {item.exchangeRate && <StyledPrice amount={item.coinAmount} {...item.exchangeRate} symbol="$" />}
          </TextSecondary>
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
  filterData = (event) => {
    const { value } = event.target;
    const filtered = this.props.data.filter((item) => item.coin.toLowerCase().includes(value.toLowerCase()));
    this.setState({ data: filtered, search: value });
  };
}

CurrencyList.propTypes = {
  /**
   * Array of icons with amount
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      coin: PropTypes.string.isRequired,
      coinAmount: PropTypes.number.isRequired,
      exchangeRate: PropTypes.object,
    })
  ),
  onCurrencySelect: PropTypes.func.isRequired,
  activeCurrency: PropTypes.string.isRequired,
};
