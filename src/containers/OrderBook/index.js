/**
 *
 * OrderBook
 *
 */

import React from 'react';
import uuidv4 from 'uuid/v4';
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

const bids = [
  {
    price: '0.00039',
    amount: '1',
  },
  {
    price: '0.00038',
    amount: '1',
  },
  {
    price: '0.00037',
    amount: '1',
  },
  {
    price: '0.00036',
    amount: '1',
  },
  {
    price: '0.00035',
    amount: '1',
  },
  {
    price: '0.00034',
    amount: '1',
  },
  {
    price: '0.00003',
    amount: '2',
  },
  {
    price: '0.00002',
    amount: '5',
  },
  {
    price: '0.00001',
    amount: '1',
  },
];

const asks = [
  {
    price: '0.00033',
    amount: '2',
  },
  {
    price: '0.00034',
    amount: '2',
  },
  {
    price: '0.00035',
    amount: '2',
  },
  {
    price: '0.00036',
    amount: '2',
  },
  {
    price: '0.00037',
    amount: '2',
  },
  {
    price: '0.00038',
    amount: '2',
  },
  {
    price: '0.00039',
    amount: '2',
  },
  {
    price: '0.0004',
    amount: '2',
  },
  {
    price: '0.0005',
    amount: '5',
  },
  {
    price: '10.0006',
    amount: '10',
  },
  {
    price: '10.0007',
    amount: '10',
  },
  {
    price: '11.0007',
    amount: '10',
  },
  {
    price: '12.0007',
    amount: '10',
  },
];

const DataRow = ({ side, amount, total, price }) => (
  <DataRowWrapper>
    <StyledText style={{ width: '33%' }} side={side}>{parseFloat(price)}</StyledText>
    <StyledText style={{ width: '33%', textAlign: 'center' }}>{amount}</StyledText>
    <StyledText style={{ width: '33%', textAlign: 'right' }}>{parseFloat(total).toFixed(6)}</StyledText>
  </DataRowWrapper>
);

DataRow.propTypes = {
  price: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['buy', 'sell']).isRequired,
};

// TODO: 1. tests 2. determine how to handle orders magnitudes higher than the cur price
const groupOrders = (decimals, orders, side) => {
  const roundingFactor = 10 ** decimals;
  // round and add a total field
  const roundingFunc = side === 'bids'
    ? Math.floor
    : Math.ceil;
  const rounded = orders.map((o) => (
    { ...o,
      price: (roundingFunc((o.price * roundingFactor) + Number.EPSILON) / roundingFactor).toString(),
      total: (o.amount / o.price).toString(),
    }
  ));
  // group by nth decimal
  return rounded.reduce((acc, cur) => {
    if (acc.length === 0) return [cur];
    const i = acc.length - 1;
    if (acc[i].price === cur.price) {
      const amtSum = (Number(acc[i].amount) + Number(cur.amount)).toString();
      const totalSum = (Number(acc[i].total) + Number(cur.total)).toString();
      acc[i].amount = amtSum;
      acc[i].total = totalSum;
      return acc;
    }
    return [...acc, cur];
  }, []);
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
    const { primary, secondary } = this.props;

    // perform grouping
    const groupedAsks = groupOrders(grouping, asks, 'asks');
    const groupedBids = groupOrders(grouping, bids, 'bids');
    const groupedAsksR = [...groupedAsks].reverse();

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
            <Option value="0">0 decimals</Option>
            <Option value="1">1 decimals</Option>
            <Option value="2">2 decimals</Option>
            <Option value="3">3 decimals</Option>
            <Option value="4">4 decimals</Option>
            <Option value="5">5 decimals</Option>
            <Option value="6">6 decimals</Option>
          </Select>
        </Header>
        <Header style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
          <StyledText>{`Price (${secondary})`}</StyledText>
          <StyledText>{`Amount (${primary})`}</StyledText>
          <StyledText>{`Total (${secondary})`}</StyledText>
        </Header>
        <OuterDataWrapper>
          <InnerDataWrapper>
            {
              groupedAsksR.map((i) => <DataRow key={uuidv4()} {...i} side="sell" />)
            }
          </InnerDataWrapper>
          <LastPrice>{`0.000035 ${primary}`}</LastPrice>
          <InnerDataWrapper style={{ justifyContent: 'flex-start' }}>
            {
              groupedBids.map((i) => <DataRow {...i} key={uuidv4()} side="buy" />)
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
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
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
