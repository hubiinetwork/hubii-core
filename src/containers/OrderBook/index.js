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
  OuterDataWrapper,
  InnerDataWrapper,
  DataRowWrapper,
  LastPrice,
  StyledText,
} from './style';

const buys = [
  {
    price: '0.000003',
    amount: '2',
    total: '0.000006',
    side: 'buy',
    id: '1',
  },
  {
    price: '0.000002',
    amount: '5',
    total: '0.000010',
    side: 'buy',
    id: '2',
  },
  {
    price: '0.000001',
    amount: '1',
    total: '0.000001',
    side: 'buy',
    id: '3',
  },
];

const sells = [
  {
    price: '0.000004',
    amount: '2',
    total: '0.000008',
    side: 'sell',
    id: '1',
  },
  {
    price: '0.000005',
    amount: '5',
    total: '0.000025',
    side: 'sell',
    id: '2',
  },
  {
    price: '0.000006',
    amount: '1',
    total: '0.000006',
    side: 'sell',
    id: '3',
  },
];
const sellsR = sells.reverse();

const DataRow = ({ side, amount, total, price }) => (
  <DataRowWrapper>
    <StyledText side={side}>{price}</StyledText>
    <StyledText>{amount}</StyledText>
    <StyledText>{total}</StyledText>
  </DataRowWrapper>
);

DataRow.propTypes = {
  price: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['buy', 'sell']).isRequired,
};


export class OrderBook extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { grouping: '6' };
    this.changeGrouping = this.changeGrouping.bind(this);
  }

  changeGrouping(grouping) {
    this.setState({ grouping });
  }

  render() {
    const { grouping } = this.state;
    return (
      <Wrapper className={this.props.className}>
        <Header>
          <Text large>Order Book</Text>
          <Text style={{ marginLeft: 'auto' }}>Grouping</Text>
          <Select
            style={{ width: '7rem', marginLeft: '1rem' }}
            value={grouping}
            onChange={this.changeGrouping}
          >
            <Option value="3">3 decimals</Option>
            <Option value="4">4 decimals</Option>
            <Option value="5">5 decimals</Option>
            <Option value="6">6 decimals</Option>
          </Select>
        </Header>
        <Header style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
          <StyledText>Price (XXX)</StyledText>
          <StyledText>Amount (XXX)</StyledText>
          <StyledText>Total (XXX)</StyledText>
        </Header>
        <OuterDataWrapper>
          <InnerDataWrapper>
            {
              sellsR.map((s) => <DataRow {...s} />)
            }
          </InnerDataWrapper>
          <LastPrice>{'0.000035 XXX'}</LastPrice>
          <InnerDataWrapper style={{ justifyContent: 'flex-start' }}>
            {
              buys.map((b) => <DataRow {...b} />)
            }
          </InnerDataWrapper>
        </OuterDataWrapper>
      </Wrapper>
    );
  }
}

OrderBook.propTypes = {
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
)(OrderBook);
