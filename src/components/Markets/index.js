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
  InnerDataWrapper,
  DataRowWrapper,
  StyledText,
} from './style';

const markets = {
  ETH: [
    {
      ticker: 'DAI',
      price: '0.035088',
      volume: '328399.90112',
      change: 7.438,
    },
    {
      ticker: 'HBT',
      price: '0.035088',
      volume: '328399.90112',
      change: 7.438,
    },
    {
      ticker: 'OMG',
      price: '0.035088',
      volume: '328399.90112',
      change: -7.438,
    },
    {
      ticker: 'ZRX',
      price: '0.035088',
      volume: '328399.90112',
      change: -7.438,
    },
    {
      ticker: 'HBT',
      price: '0.035088',
      volume: '328399.90112',
      change: -7.438,
    },
    {
      ticker: 'OMG',
      price: '0.035088',
      volume: '328399.90112',
      change: 7.438,
    },
    {
      ticker: 'ZRX',
      price: '0.035088',
      volume: '328399.90112',
      change: 7.438,
    },
  ],
  DAI: [],
};

const DataRow = ({ ticker, price, volume, change }) => (
  <DataRowWrapper>
    <StyledText>{ticker}</StyledText>
    <StyledText>{price}</StyledText>
    <StyledText>{volume}</StyledText>
    <StyledText>{change}</StyledText>
  </DataRowWrapper>
);

DataRow.propTypes = {
  price: PropTypes.string.isRequired,
  ticker: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
  change: PropTypes.number.isRequired,
};

export class Markets extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { base: 'ETH' };
    this.changeBase = this.changeBase.bind(this);
  }

  changeBase(base) {
    this.setState({ base });
  }

  render() {
    const { base } = this.state;

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
        <Header style={{ margin: '0.5rem 0' }}>
          <StyledText>Ticker</StyledText>
          <StyledText>Price</StyledText>
          <StyledText>24hr Volume</StyledText>
          <StyledText>24hr Change</StyledText>
        </Header>
        <div
          style={{ overflowX: 'visible' }}
        >
          <InnerDataWrapper>
            {
              markets[base].map((i) => <DataRow key={i.ticker} {...i} />)
            }
          </InnerDataWrapper>
        </div>
      </Wrapper>
    );
  }
}

Markets.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
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
