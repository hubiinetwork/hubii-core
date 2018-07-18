import React from 'react';
import ReactHighcharts from 'react-highcharts';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter3';
import OrderBook from '../OrderBook';
import { Wrapper } from './DepthChart.style';

const EE = new EventEmitter();

class DepthChart extends React.Component {
  componentDidMount() {
    // setInterval(() => {
    //   EE.emit('DepthChart-update');
    // }, 1000);
  }
  componentWillUnmount() {
    EE.removeAllListeners('DepthChart-update');
  }
  render() {
    const config = {
      chart: {
        type: 'area',
        inverted: true,
        height: 401,
        width: 200,
        events: {
          load() {
            // set up the updating of the chart each second
            const series = this.series[0];
            const columnSeries = this.series[1];
            let point = [870.46, 55];
            let columnPoint = [860.51, 58];
            EE.on('DepthChart-update', () => {
              point = [columnPoint[0] - (Math.random() * 2), columnPoint[1] - 1];

              series.addPoint(point, true, true);
              columnPoint = [columnPoint[0] - (Math.random() * 2), columnPoint[1] + 1];
              columnSeries.addPoint(columnPoint, true, true);
            });
          },
        },
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      credits: {
        display: false,
      },
      xAxis: {
        reversed: false,
        visible: false,
        title: {
          enabled: false,
        },
        labels: {
          format: '{value} USD',
        },
      },
      yAxis: {
        title: {
          text: 'BTC',
        },
        labels: {
          format: '{value}°',
        },
        reversed: true,
        visible: false,
        lineWidth: 2,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x} USD,  {point.y} Unit',
        style: {
          color: '#ffffff',
        },
      },

      series: [


        {
          name: 'BTC',
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1.1 },
            stops: [
              [0, 'grey'],
              [1, '#fc519a'],
            ],
          },
          step: 'right',
          data: [
            [870.46, 55],
            [869.45, 54],
            [868.42, 35],
            [867.40, 34],
            [867.39, 34],
            [867.38, 33],
            [867.37, 33],
            [867.34, 32],
            [867.33, 32],
            [867.32, 17],
            [867.31, 16],
            [867.30, 1],
            [867.29, 0],
          ],
        }, {
          name: 'Hubii',
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1.1 },
            stops: [
              [0, 'grey'],
              [1, '#44d169'],
            ],
          },
          step: 'left',
          data: [
            [866.79, 1],
            [866.73, 23],
            [866.72, 30],
            [866.71, 31],
            [866.70, 31],
            [866.69, 35],
            [866.58, 36],
            [866.57, 37],
            [866.56, 49],
            [863.55, 55],
            [862.54, 55],
            [861.52, 56],
            [860.51, 58],
          ],
        },

      ],
    };
    const { incrementedData, decrementedData, amountUSD } = this.props;
    return (
      <Wrapper>
        <ReactHighcharts config={config} />
        <OrderBook incrementedData={incrementedData} decrementedData={decrementedData} amountUSD={amountUSD} />
      </Wrapper>
    );
  }
}
DepthChart.propTypes = {
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
export default DepthChart;
