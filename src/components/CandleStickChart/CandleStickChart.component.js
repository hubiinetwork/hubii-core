import React from 'react';
import PropTypes from 'prop-types';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import moment from 'moment';
import './CandleStick.css';

export default class CandleStickChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    const data = props.priceHistory.getIn([props.currency, 'history']);
    const ohlc = [];
    const volume = [];
    const dataLength = data.length;
    let i = 0;
    let date;
    let temp;

    for (i; i < dataLength; i += 1) {
      // get year-month-day
      date = data[i].date.split('-').reverse();

      // change month with day to get yyyy-(m)m-(d)d
      temp = date[2];
      date[2] = date[1];
      date[1] = temp;

      // optional change to get yyyy-mm-dd
      // (m)m -> mm
      if (date[1].length < 2) {
        date[1] = `0${date[1]}`;
      }
      // (d)d -> dd
      if (date[2].length < 2) {
        date[2] = `0${date[2]}`;
      }

      // get timestamp
      date = new Date(date.join('-')).getTime();
      ohlc.push([
        date, // the date
        data[i].open, // open
        data[i].high, // high
        data[i].low, // low
        data[i].close, // close
      ]);

      volume.push(
        [
          date,
          data[i].volume,
        ]
      );
    }

    const config = {
      rangeSelector: {
        selected: 1,
        inputEnabled: false,
      },
      scrollbar: {
        enabled: false,
      },

      yAxis: [{
        labels: {
          align: 'left',
          x: -3,
          style: {
            color: '#ffffff',
            opacity: 0.6,
            width: '150px',
          },
          formatter() {
            return `<div style="padding-left:20px;">${this.value}</div>`;
          },
          useHTML: true,
        },
        height: '80%',
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      }, {
        labels: {
          align: 'right',
          x: -3,
          style: {
            color: '#ffffff',
            opacity: 0.6,
          },
        },
        top: '80%',
        height: '20%',
        offset: 0,
        lineWidth: 2,
      }],
      xAxis: {
        labels: {
          style: {
            color: '#ffffff',
            opacity: 0.6,
          },
        },
      },
      tooltip: {
        backgroundColor: 'red',
        borderWidth: 0,
        borderRadius: 0,
        style: {
          color: '#ffffff',
        },
        followTouchMove: false,
        crosshairs: false,
        positioner() {
          return { x: 10, y: 35 };
        },
        shadow: false,
        split: false,
        useHTML: true,
        formatter() {
          /* eslint-disable consistent-return */
          const { high, low, close, open } = this.point;
          if (!high) {
            return;
          }
          return `<div>
                    H <span class="candlestickchart-tooltip-value">${high}</span> 
                    L <span class="candlestickchart-tooltip-value">${low}</span>
                    C <span class="candlestickchart-tooltip-value">${close}</span>
                    O <span class="candlestickchart-tooltip-value">${open}</span>
                  </div>`;
        },
      },

      series: [{
        type: 'candlestick',
        name: '<b>Bitcoin</b> Historical Data in <b>USD</b>',
        data: ohlc,
      },
      {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
        turboThreshold: 0,
      },
      ],
    };
    this.state = {
      config,
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.latestPrice !== nextProps.latestPrice) {
      const latestPrice = nextProps.latestPrice.get(nextProps.currency).toJS();
      this.time = this.time || moment(latestPrice.date).toDate().getTime();

      const chart = this.chartRef.getChart();
      // set up the updating of the chart each second
      const series = chart.series[0];
      const columnSeries = chart.series[1];
      const point = [
        this.time,
        latestPrice.open,
        latestPrice.high,
        latestPrice.low,
        latestPrice.close,
      ];
      // console.log('point', point);
      series.addPoint(point, true, true);
      const columnPoint = [
        this.time,
        latestPrice.volume,
      ];
      columnSeries.addPoint(columnPoint, true, true);
      this.time += 86400000;
    }
    return false;
  }
  render() {
    if (!this.state.config.series) {
      return null;
    }
    return (
      <ReactHighstock config={this.state.config} ref={this.chartRef} />
    );
  }
}

CandleStickChart.propTypes = {
  priceHistory: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  latestPrice: PropTypes.object.isRequired,
};
