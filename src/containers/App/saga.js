import { takeEvery, put, select } from 'redux-saga/effects';

import Notification from 'components/Notification';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { CHANGE_LOCALE } from 'containers/LanguageProvider/constants';
import { setIntl } from 'utils/localisation';

import { NOTIFY, CHANGE_NETWORK } from './constants';
import { notify } from './actions';


export function* changeLocale() {
  const locale = yield select(makeSelectLocale());
  setIntl(locale);
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
  yield takeEvery(CHANGE_LOCALE, changeLocale);
  // yield setIntl();
}
