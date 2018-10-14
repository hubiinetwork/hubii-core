import { takeEvery, put, select } from 'redux-saga/effects';

import Notification from 'components/Notification';
import { IntlProvider } from 'react-intl';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { CHANGE_LOCALE } from 'containers/LanguageProvider/constants';

import { translationMessages } from '../../i18n';
import { NOTIFY, CHANGE_NETWORK } from './constants';
import { notify } from './actions';


export let intl;// eslint-disable-line import/no-mutable-exports

export function* getIntl() {
  const locale = yield select(makeSelectLocale());
  intl = new IntlProvider({ locale, messages: translationMessages[locale] }, {}).getChildContext().intl;
  return intl;
}

export function* notifyUI({ messageType, message, customDuration }) {
  yield Promise.resolve(Notification(messageType, message, customDuration));
}

export function* hookChangeNetwork() {
  yield put(notify('success', 'Network changed'));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
  yield takeEvery(CHANGE_NETWORK, hookChangeNetwork);
  yield takeEvery(CHANGE_LOCALE, getIntl);
  intl = yield getIntl();
}
