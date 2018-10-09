/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';

import { DEFAULT_LOCALE } from './containers/App/constants'; // eslint-disable-line
import enTranslationMessages from './translations/en.json';

const context = require.context('./translations', true, /\.json$/);
const locales = {};
context.keys().forEach((key) => {
  const locale = key.replace('./', '').replace('.json', '');
  locales[locale] = context(key);
});

export const appLocales = Object.keys(locales);

const localeData = [];
appLocales.forEach((locale) => {
  // eslint-disable-next-line global-require
  const data = require(`react-intl/locale-data/${locale}`);
  localeData.push(data);
});

addLocaleData(localeData);

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE
    ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
    : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, { [key]: message });
  }, {});
};

export const translationMessages = appLocales.reduce((formattedLocaleMessages, locale) => Object.assign(formattedLocaleMessages, { [locale]: formatTranslationMessages(locale, locales[locale]) }), {});
