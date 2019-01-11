import React from 'react';
import ReactHighcharts from 'react-highcharts';
import PropTypes from 'prop-types';
// import EventEmitter from 'eventemitter3';
// import OrderBook from '../OrderBook';
import { Wrapper } from './style';

// const EE = new EventEmitter();

// transforms orderBook data into format reabable by Highcharts component
const transformData = ((arr) => arr.reduce((acc, cur) => {
  if (acc.length === 0) return [[parseFloat(cur.price), parseFloat(cur.amount)]];
  const volumeSum = parseFloat(cur.amount) + acc[acc.length - 1][1];
  return [...acc, [parseFloat(cur.price), volumeSum]];
}, []));

class DepthChart extends React.Component {
  constructor(props) {
    super(props);
    const transformedAsks = transformData(props.orderBook.asks);
    const transformedBids = transformData(props.orderBook.bids);
    this.state = {
      config: {
        chart: {
          margin: [0, 0, 0, 0],
          width: 150,
          backgroundColor: 'transparent',
          type: 'area',
          inverted: true,
          events: {
            load() {
              // set up the updating of the chart each second
            },
          },
        },
        title: {
          text: '',
        },
        xAxis: {
          reversed: false,
          visible: false,
        },
        yAxis: {
          reversed: true,
          visible: false,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
          valueDecimals: 2,
        },
        series: [
          {
            name: 'Asks',
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1.1 },
              stops: [
                [0, 'rgba(255,77,154, 0.1)'],
                [1, 'rgba(255,77,154, 1)'],
              ],
            },
            step: 'left',
            data: transformedAsks,
          }, {
            name: 'Bids',
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1.1 },
              stops: [
                [0, 'rgba(70,233,106, 0.1)'],
                [1, 'rgba(70,233,106, 1)'],
              ],
            },
            step: 'left',
            data: transformedBids,
          },
        ],
      },
    };
  }
  render() {
    const { config } = this.state;
    // const { incrementedData, decrementedData, amountUSD } = this.props;
    return (
      <Wrapper className={this.props.className}>
        <ReactHighcharts config={config} />
      </Wrapper>
    );
  }
}
DepthChart.propTypes = {
  className: PropTypes.string,
  orderBook: PropTypes.shape({
    bids: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })).isRequired,
    asks: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
export default DepthChart;
