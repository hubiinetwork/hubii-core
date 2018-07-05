import React from 'react';
import ReactHighcharts from 'react-highcharts';

const DepthChart = () => {
  const config = {
    chart: {
      type: 'area',
      inverted: true,
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
    },

    series: [


      {
        name: 'BTC',
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
             [0, 'grey'],
             [1, '#FF5A5A'],
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
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
             [0, 'grey'],
             [1, '#78B214'],
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
  return (<ReactHighcharts config={config} />);
};
export default DepthChart;
