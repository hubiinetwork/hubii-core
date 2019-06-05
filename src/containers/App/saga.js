import { takeEvery, takeLatest, put, select, call } from 'redux-saga/effects';
import { NahmiiProvider } from 'nahmii-sdk';
import fs from 'fs';
import crypto from 'crypto';

import Notification from 'components/Notification';
import { makeSelectCurrentNetwork, makeSelectSupportedNetworks, makeSelectRestoreContents } from 'containers/App/selectors';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { makeSelectWallets } from 'containers/WalletHoc/selectors';
import { makeSelectContacts } from 'containers/ContactBook/selectors';
import { CHANGE_LOCALE } from 'containers/LanguageProvider/constants';
import { setIntl, getIntl } from 'utils/localisation';

import { createContact } from 'containers/ContactBook/actions';
import { createWalletSuccess, saveTrezorAddress, saveWatchAddress } from 'containers/WalletHoc/actions';
import { saveLedgerAddress } from 'containers/LedgerHoc/actions';

import {
  NOTIFY,
  INIT_NAHMII_PROVIDERS,
  CHANGE_NETWORK,
  BATCH_EXPORT,
  BATCH_IMPORT,
  DECRYPT_IMPORT,
} from './constants';
import {
  notify,
  initNetworkActivity,
  updateNahmiiProvider,
  updateCurrentNetworkNahmiiProvider,
  batchImportSuccess,
  batchImportError,
  decryptImportSuccess,
  decryptImportError,
  batchExportSuccess,
  batchExportError,
} from './actions';

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

export function* batchExport({ password, filePath }) {
  try {
    const contacts = yield select(makeSelectContacts());
    const wallets = (yield select(makeSelectWallets())).map(
      (wallet) => wallet.get('type') === 'software' ? wallet.set('decrypted', null) : wallet
    );
    const algorithm = 'aes-256-cbc';
    const cipher = crypto.createCipher(algorithm, password);
    let encrypted = cipher.update(JSON.stringify({ wallets, contacts }), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    fs.writeFileSync(filePath, encrypted);
    yield put(batchExportSuccess());
    yield put(notify('success', getIntl().formatMessage({ id: 'backup_success' })));
  } catch (error) {
    yield put(batchExportError(error));
    yield put(notify('error', getIntl().formatMessage({ id: 'backup_failed' })));
  }
}

export function* decryptImport({ password, filePath }) {
  try {
    const encrypted = fs.readFileSync(filePath, 'utf8');
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipher(algorithm, password);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    yield put(decryptImportSuccess(JSON.parse(decrypted)));
  } catch (error) {
    yield put(decryptImportError(error));
    yield put(notify('error', getIntl().formatMessage({ id: 'decrypt_failed' })));
  }
}

export function* batchImport() {
  try {
    const contents = yield select(makeSelectRestoreContents());
    if (!contents) {
      throw new Error('No data available for importing');
    }
    const { wallets, contacts } = contents;
    // eslint-disable-next-line no-restricted-syntax
    for (const wallet of wallets) {
      switch (wallet.type) {
        case 'software':
          yield put(createWalletSuccess(wallet.name, wallet.encrypted, null, wallet.address));
          break;
        case 'lns':
          yield put(saveLedgerAddress(wallet.name, wallet.derivationPath, wallet.deviceId, wallet.address));
          break;
        case 'trezor':
          yield put(saveTrezorAddress(wallet.name, wallet.derivationPath, wallet.deviceId, wallet.address));
          break;
        case 'watch':
          yield put(saveWatchAddress(wallet.name, wallet.address));
          break;
        default:
          throw new Error(`Not supported wallet type: ${wallet.type}`);
      }
    }

    const existingContacts = yield select(makeSelectContacts());
    // eslint-disable-next-line no-restricted-syntax
    for (const contact of contacts) {
      if (existingContacts.find((c) => c.get('address') === contact.address)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      yield put(createContact(contact.name, contact.address));
    }

    yield put(batchImportSuccess());
  } catch (error) {
    yield put(batchImportError(error));
    yield put(notify('error', getIntl().formatMessage({ id: 'import_failed' }, { message: error.message })));
  }
}

export default function* app() {
  yield takeEvery(NOTIFY, notifyUI);
  yield takeEvery(CHANGE_NETWORK, hookChangeNetwork);
  yield takeEvery(CHANGE_LOCALE, changeLocale);
  yield takeLatest(INIT_NAHMII_PROVIDERS, initNahmiiProviders);
  yield takeLatest(BATCH_EXPORT, batchExport);
  yield takeLatest(BATCH_IMPORT, batchImport);
  yield takeLatest(DECRYPT_IMPORT, decryptImport);
}
