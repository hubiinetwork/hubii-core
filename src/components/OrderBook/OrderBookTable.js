import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledTable,
  TitleLeft,
  TitleRight,
  PrimaryText,
  DangerText,
  SuccessText,
  AmountWrapper,
  SecondaryText,
} from './OrderBook.style';

const OrderBookTable = ({ incrementedData, decrementedData, amountUSD }) => {
  const sucessColumns = [{
    title: <div><TitleLeft>Price </TitleLeft><TitleRight>HBT</TitleRight></div>,
    dataIndex: 'priceHBT',
    key: 'priceHBT',
    render: (amount) => <SuccessText>{amount}</SuccessText>,
    width: '33.3%',
  },
  {
    title: <div><TitleLeft>Amount </TitleLeft><TitleRight>ETH</TitleRight></div>,
    dataIndex: 'amountETH',
    key: 'amountETH',
    render: (amount) => <PrimaryText>{amount}</PrimaryText>,
    width: '33.3%',
  },
  {
    title: <div><TitleLeft>Total </TitleLeft><TitleRight>HBT</TitleRight></div>,
    dataIndex: 'totalHBT',
    key: 'totalHBT',
    render: (amount) => <PrimaryText>{amount}</PrimaryText>,
    width: '33.3%',
  }];

  const incrementedDataSource = incrementedData.map(({ priceHBT, amountETH }, i) => ({
    key: i,
    priceHBT,
    amountETH,
    totalHBT: priceHBT * amountETH,
  }));

  const decrementedDataSource = decrementedData.map(({ priceHBT, amountETH }, i) => ({
    key: i,
    priceHBT,
    amountETH,
    totalHBT: priceHBT * amountETH,
  }));

  const columns = sucessColumns.map((column) => ({ ...column }));
  columns[0].render = (amount) => <DangerText>{amount}</DangerText>;

  return (
    <React.Fragment>
      <StyledTable
        dataSource={incrementedDataSource}
        pagination={false}
        columns={sucessColumns}
        size="small"
      />
      <AmountWrapper><SecondaryText>{amountUSD} USD</SecondaryText></AmountWrapper>
      <StyledTable
        showHeader={false}
        dataSource={decrementedDataSource}
        pagination={false}
        columns={columns}
        size="small"
      />
    </React.Fragment>
  );
};

OrderBookTable.propTypes = {
  /**
   * Table data of incremented values
   */
  incrementedData: PropTypes.array,
  /**
   * Table data of decremented values
   */
  decrementedData: PropTypes.array,
  amountUSD: PropTypes.number,
};
export default OrderBookTable
;
