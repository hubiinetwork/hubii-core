/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */


// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { ethers } from 'ethers';

// import semantic ui styles
import 'semantic-ui-css/semantic.min.css';

// Import root app
import App from 'containers/App';

// Import Theme Provider
import { ThemeProvider } from 'styled-components';
// Import Themes
import dark from 'themes/darkTheme';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
import { getIntl as initIntl } from 'utils/localisation';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import './global-styles';

// Create redux store with history
const history = createHistory();
const store = configureStore(history);
const MOUNT_NODE = document.getElementById('app');

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={dark}>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <Route path="/" component={App} />
          </ConnectedRouter>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// init localisation
initIntl();

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}

// Silence the warnings on the overloaded functions from the contract ABIs.
// ethers v5 will deprecate these warnings https://github.com/ethers-io/ethers.js/issues/499
ethers.errors.setLogLevel('error');
