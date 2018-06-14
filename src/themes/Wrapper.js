import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import theme from './darkTheme';

export default class ThemeWrapper extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en">
          <BrowserRouter>{this.props.children}</BrowserRouter>
        </IntlProvider>
      </ThemeProvider>
    );
  }
}
