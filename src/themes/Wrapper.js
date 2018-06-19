import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import theme from './darkTheme';

/* eslint-disable */
export default class ThemeWrapper extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>{this.props.children}</BrowserRouter>
      </ThemeProvider>
    );
  }
}
