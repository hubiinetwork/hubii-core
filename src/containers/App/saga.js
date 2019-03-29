import { takeEvery, takeLatest, put, select, call } from 'redux-saga/effects';
import { NahmiiProvider } from 'nahmii-sdk';

import Notification from 'components/Notification';
import { makeSelectCurrentNetwork, makeSelectSupportedNetworks } from 'containers/App/selectors';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { CHANGE_LOCALE } from 'containers/LanguageProvider/constants';
import { setIntl } from 'utils/localisation';

import { NOTIFY, INIT_NAHMII_PROVIDERS, CHANGE_NETWORK } from './constants';
import { notify, initNetworkActivity, updateNahmiiProvider, updateCurrentNetworkNahmiiProvider } from './actions';

export function* changeLocale() {
  const locale = yield select(makeSelectLocale());
  setIntl(locale);
}

export function* notifyUI({ messageType, message, customDuration }) {
  yield Promise.resolve(Notification(messageType, message, customDuration));
}

export function* initNahmiiProviders() {
  const supportedNetworks = yield select(makeSelectSupportedNetworks());
  const currentNetwork = yield select(makeSelectCurrentNetwork());
  const networks = supportedNetworks.valueSeq().toJS();

  for (let i = 0; i < networks.length; i += 1) {
    const { name, apiDomain, nahmiiProvider, identityServiceSecret, identityServiceAppId } = networks[i];
    if (nahmiiProvider) {
      // eslint-disable-next-line no-continue
      continue;
    }
    let _nahmiiProvider;
    try {
      _nahmiiProvider = yield call(NahmiiProvider.from, apiDomain, identityServiceAppId, identityServiceSecret);
    } catch (error) {
      _nahmiiProvider = supportedNetworks.getIn([name, 'defaultNahmiiProvider']);
    }
    yield put(updateNahmiiProvider(_nahmiiProvider, name));
    if (currentNetwork.name === name) {
      yield put(updateCurrentNetworkNahmiiProvider(_nahmiiProvider));
    }
  }

  yield put(initNetworkActivity());
}

export function* hookChangeNetwork() {
  yield put(notify('success', 'Network changed'));
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
  yield takeEvery(CHANGE_NETWORK, hookChangeNetwork);
  yield takeEvery(CHANGE_LOCALE, changeLocale);
  yield takeLatest(INIT_NAHMII_PROVIDERS, initNahmiiProviders);
}
