import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

export default class CandleStickChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
    };
  }
  componentDidMount() {
    // setInterval(() => this.updateData(), 1000);
    this.updateData();
  }
  updateData() {
    console.log('api called');
    fetch('https://raw.githubusercontent.com/smartvikisogn/cryptocurrency/master/bitcoin.json')
    .then((res) => res.json())
    .then((data) => {
       // split the data set into ohlc and volume
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

        volume.push([
          date, // the date
          data[i].volume, // the volume
        ]);
      }
      const config = {

        rangeSelector: {
          selected: 1,
        },

        title: {
          text: 'Bitcoin (BTC) Historical Data',
        },

        yAxis: [{
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        }, {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        }],

        tooltip: {
          split: true,
        },
        plotOptions: {
          candlestick: {
            color: 'green',
          },
          column: {
            color: 'red',
          },
        },

        series: [
          {
            type: 'candlestick',
            name: '<b>Bitcoin</b> Historical Data in <b>USD</b>',
            data: ohlc,
          },
          {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
          },
        ],
      };
      this.setState({ config });
    })
    .catch((err) => {
      console.log('error', err);
    });
  }
  render() {
    return (
      <ReactHighstock config={this.state.config} />
    );
  }
}
