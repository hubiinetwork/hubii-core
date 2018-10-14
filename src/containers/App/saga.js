import { takeEvery, put, select } from 'redux-saga/effects';

import Notification from 'components/Notification';

import { NOTIFY, CHANGE_NETWORK } from './constants';
import { CHANGE_LOCALE } from 'containers/LanguageProvider/constants';
import { notify } from './actions';

import { IntlProvider } from 'react-intl';
import {translationMessages} from '../../i18n'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';

export let intl

export function* getIntl() {
  const locale = yield select(makeSelectLocale())
  intl = new IntlProvider({ locale, messages: translationMessages[locale] }, {}).getChildContext().intl;
  return intl
}


export function* notifyUI({ messageType, message, customDuration }) {
  if (!intl) {
    intl = yield getIntl()
  }
  // const translatedText = message.id ? intl.formatMessage({id: message.id}, message.values) : message;
  yield Promise.resolve(Notification(messageType, message, customDuration));
}

export function* hookChangeNetwork() {
  yield put(notify('success', 'Network changed'));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
  yield takeEvery(CHANGE_NETWORK, hookChangeNetwork);
  yield takeEvery(CHANGE_LOCALE, getIntl);
}
