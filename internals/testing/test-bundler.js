// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';

// change when 'now' is when testing
import MockDate from 'mockdate';
MockDate.set('6/6/2018');

// mock fetch responses
global.fetch = require('jest-fetch-mock');
