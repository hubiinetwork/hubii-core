import { IntlProvider } from 'react-intl';
import moment from 'moment';
import { translationMessages } from '../i18n';

let intl;

export const getIntl = () => {
  if (!intl) {
    try {
      const { language } = JSON.parse(localStorage.getItem('state'));
      intl = setIntl(language.locale);
    } catch (error) {
      intl = setIntl('en');
    }
  }
  return intl;
};

export const setIntl = (locale) => {
  if (locale === 'zh') {
    moment.locale('zh-cn');
  } else {
    moment.locale(locale);
  }
  intl = new IntlProvider({ locale, messages: translationMessages[locale] }, {}).getChildContext().intl;
  return intl;
};


export default getIntl;
