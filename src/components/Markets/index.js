/**
 *
 * OrderBook
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Text from 'components/ui/Text';
import Select, { Option } from 'components/ui/Select';
import {
  Header,
  Wrapper,
  DataWrapper,
  DataRowWrapper,
  StyledText,
} from './style';

const markets = {
  ETH: [
    {
      ticker: 'DAI',
      price: '0.035088',
      volume: '328399.90',
      change: 17.41,
    },
    {
      ticker: 'HBT',
      price: '0.035088',
      volume: '328399.90',
      change: 17.41,
    },
    {
      ticker: 'OMG',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
    {
      ticker: 'ZRX',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
  ],
  DAI: [
    {
      ticker: 'ZRX',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
    {
      ticker: 'OMG',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
  ],
};

const DataRow = ({ pair, price, volume, change, selected, onClick }) => (
  <DataRowWrapper selected={selected} onClick={selected ? () => {} : onClick}>
    <StyledText style={{ width: '25%' }}>{pair}</StyledText>
    <StyledText>{price}</StyledText>
    <StyledText>{volume}</StyledText>
    <StyledText change={change}>{change < 0 ? `${change}%` : `+${change}%`}</StyledText>
  </DataRowWrapper>
);

DataRow.propTypes = {
  price: PropTypes.string.isRequired,
  pair: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
  change: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export class Markets extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { base: props.selectedMarket.primary };
    this.changeBase = this.changeBase.bind(this);
  }

  changeBase(base) {
    this.setState({ base });
  }

  render() {
    const { base } = this.state;
    const {
      selectedMarket,
      changeSelectedMarket,
    } = this.props;

    return (
      <Wrapper className={this.props.className}>
        <Header>
          <Text large>Markets</Text>
          <Text style={{ marginLeft: 'auto' }}>Base</Text>
          <Select
            style={{ width: '7rem', marginLeft: '1rem' }}
            value={base}
            onChange={this.changeBase}
          >
            <Option value="ETH">ETH</Option>
            <Option value="DAI">DAI</Option>
          </Select>
        </Header>
        <Header style={{ margin: '0.5rem 11px 0.5rem 0' }}>
          <StyledText>Market</StyledText>
          <StyledText>Price</StyledText>
          <StyledText>Volume</StyledText>
          <StyledText>Change</StyledText>
        </Header>
        <DataWrapper>
          {
            markets[base].map((i) => (
              <DataRow
                pair={`${base}/${i.ticker}`}
                volume={i.volume}
                change={i.change}
                price={i.price}
                selected={i.ticker === selectedMarket.secondary && base === selectedMarket.primary}
                onClick={() => changeSelectedMarket({ primary: base, secondary: i.ticker })}
                key={i.ticker}
              />
            ))
          }
        </DataWrapper>
      </Wrapper>
    );
  }
}

Markets.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
  selectedMarket: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
  }),
  changeSelectedMarket: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(Markets);
