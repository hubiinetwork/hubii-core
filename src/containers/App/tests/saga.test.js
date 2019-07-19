/**
 * App sagas
 */

import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';
import crypto from 'crypto';

/* eslint-disable redux-saga/yield-effects */
import { takeEvery } from 'redux-saga/effects';
import { NahmiiProvider } from 'nahmii-sdk';

import { SUPPORTED_NETWORKS } from 'config/constants';
import Notification from 'components/Notification';

import { createContact } from 'containers/ContactBook/actions';
import { createWalletSuccess, saveTrezorAddress, saveWatchAddress } from 'containers/WalletHoc/actions';
import { saveLedgerAddress } from 'containers/LedgerHoc/actions';
import { contactsMock } from 'containers/WalletHoc/tests/mocks';
import { walletsMock } from 'containers/WalletHoc/tests/mocks/selectors';

import app, {
  notifyUI,
  hookChangeNetwork,
  initNahmiiProviders,
  batchImport,
} from '../saga';

import {
  NOTIFY,
  CHANGE_NETWORK,
} from '../constants';

import {
  notify,
  initNetworkActivity,
  updateNahmiiProvider,
  updateCurrentNetworkNahmiiProvider,
  batchImportError,
  decryptImportSuccess,
  decryptImportError,
  batchExportSuccess,
  batchExportError,
} from '../actions';

import appReducer, { initialState } from '../reducer';

const withReducer = (state, action) => state.set('app', appReducer(state.get('app'), action));

describe('notifyUI saga', () => {
  it('should create a notification', () => {
    const type = 'success';
    const message = 'hello world!';
    const notifyUIGenerator = notifyUI({ type, message });
    const promiseDescriptor = notifyUIGenerator.next().value;
    expect(promiseDescriptor).toEqual(Promise.resolve(Notification(type, message)));
  });
});

describe('hookChangeNetwork saga', () => {
  it('should dispatch the notify action', () => expectSaga(hookChangeNetwork)
    .put(notify('success', 'Network changed'))
    .run()
  );
});


describe('root Saga', () => {
  const appSaga = app();

  it('should start task to watch for NOTIFY action', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(NOTIFY, notifyUI));
  });

  it('should start task to watch for CHANGE_NETWORK action', () => {
    const takeDescriptor = appSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CHANGE_NETWORK, hookChangeNetwork));
  });
});

describe('init nahmii providers', () => {
  it('should dynamically init nahmii providers and init default nahmii provider', () => {
    const nahmiiProviders = [
      { provider: new NahmiiProvider('1', '1', '1', '1', 1), name: 'mainnet' },
      { provider: new NahmiiProvider('3', '3', '3', '3', 3), name: 'ropsten' },
    ];
    return expectSaga(initNahmiiProviders)
      .withReducer(withReducer, fromJS({ app: initialState }))
      .provide({
        call(effect) {
          if (effect.fn.name === 'from') {
            if (effect.args[0] === 'api.nahmii.io') {
              return nahmiiProviders[0].provider;
            }
            return nahmiiProviders[1].provider;
          }
          return null;
        },
      })
      .put(updateNahmiiProvider(nahmiiProviders[0].provider, nahmiiProviders[0].name))
      .put(updateNahmiiProvider(nahmiiProviders[1].provider, nahmiiProviders[1].name))
      .put(
        updateCurrentNetworkNahmiiProvider(
          nahmiiProviders
            .find((p) => p.name === initialState.get('currentNetwork').get('name'))
            .provider
        )
      )
      .put(initNetworkActivity())
      .run({ silenceTimeout: true })
      .then((result) => {
        const supportedNetworks = result.storeState.getIn(['app', 'supportedNetworks']);
        const currentNetwork = result.storeState.getIn(['app', 'currentNetwork']);
        expect(supportedNetworks.getIn(['mainnet', 'nahmiiProvider'])).toEqual(nahmiiProviders[0].provider);
        expect(supportedNetworks.getIn(['ropsten', 'nahmiiProvider'])).toEqual(nahmiiProviders[1].provider);
        expect(currentNetwork.get('nahmiiProvider')).toEqual(nahmiiProviders[1].provider);
      });
  });
  it('should use default default nahmii providers when failed to determine from API', () => expectSaga(initNahmiiProviders)
    .withReducer(withReducer, fromJS({ app: initialState }))
    .provide({
      call() {
        throw new Error();
      },
    })
    .put(updateNahmiiProvider(SUPPORTED_NETWORKS.mainnet.defaultNahmiiProvider, SUPPORTED_NETWORKS.mainnet.name))
    .put(updateNahmiiProvider(SUPPORTED_NETWORKS.ropsten.defaultNahmiiProvider, SUPPORTED_NETWORKS.ropsten.name))
    .put(updateCurrentNetworkNahmiiProvider(SUPPORTED_NETWORKS[initialState.get('currentNetwork').get('name')].defaultNahmiiProvider))
    .put(initNetworkActivity())
    .run({ silenceTimeout: true })
    .then((result) => {
      const supportedNetworks = result.storeState.getIn(['app', 'supportedNetworks']);
      const currentNetwork = result.storeState.getIn(['app', 'currentNetwork']);
      expect(supportedNetworks.getIn(['mainnet', 'nahmiiProvider'])).toEqual(SUPPORTED_NETWORKS.mainnet.defaultNahmiiProvider);
      expect(supportedNetworks.getIn(['ropsten', 'nahmiiProvider'])).toEqual(SUPPORTED_NETWORKS.ropsten.defaultNahmiiProvider);
      expect(currentNetwork.get('nahmiiProvider')).toEqual(SUPPORTED_NETWORKS[initialState.get('currentNetwork').get('name')].defaultNahmiiProvider);
    }));
});
describe('batch import/export', () => {
  const filePath = '/file/path';
  const password = '123';
  const algorithm = 'aes-256-cbc';
  const contents = {
    wallets: walletsMock.map((wallet) => {
      if (wallet.get('type') === 'software') {
        return wallet.set('decrypted', null);
      }
      return wallet;
    }),
    contacts: contactsMock,
  };
  const cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(JSON.stringify(contents), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  beforeEach(() => {
    jest.resetModules();
  });
  describe('batch export', () => {
    it('should successfully encrypt a json that contains all the existing wallets and contacts', (done) => {
      jest.doMock('fs', () => ({
        writeFileSync: (path, encryptedContent) => {
          expect(path).toEqual(filePath);
          expect(encryptedContent).toEqual(encrypted);
          done();
        },
      }));
      const {batchExport} = require('../saga'); // eslint-disable-line
      return expectSaga(batchExport, { password, filePath })
        .withReducer(withReducer, fromJS({
          app: initialState,
          walletHoc: { wallets: walletsMock },
          contacts: { contacts: contactsMock },
        }))
        .put(batchExportSuccess())
        .run({ silenceTimeout: true });
    });
    it('should trigger batchExportError action when failed to save it in a file', () => {
      jest.doMock('fs', () => ({
        writeFileSync: () => {
          throw new Error();
        },
      }));
      const {batchExport} = require('../saga'); // eslint-disable-line
      return expectSaga(batchExport, { password, filePath })
        .withReducer(withReducer, fromJS({
          app: initialState,
          walletHoc: { wallets: walletsMock },
          contacts: { contacts: contactsMock },
        }))
        .put.actionType(batchExportError().type)
        .run({ silenceTimeout: true })
        .then((result) => {
          const error = result.storeState.getIn(['app', 'restore', 'export', 'error']);
          expect(error).toBeDefined();
        });
    });
  });
  describe('decrypt import file', () => {
    let decryptImport;
    const expectedRestoreContents = JSON.parse(JSON.stringify(contents));
    beforeEach(() => {
      jest.doMock('fs', () => ({
        readFileSync: (path) => {
          expect(path).toEqual(filePath);
          return encrypted;
        },
      }));
      decryptImport = require('../saga').decryptImport; // eslint-disable-line
    });
    it('should decrypt the import file and temporary save them in store', () => expectSaga(decryptImport, { password, filePath })
      .withReducer(withReducer, fromJS({
        app: initialState.setIn(['restore', 'import', 'error'], 'error'),
      }))
      .put(decryptImportSuccess(expectedRestoreContents))
      .run({ silenceTimeout: true })
      .then((result) => {
        const restoreContents = result.storeState.getIn(['app', 'restore', 'import', 'data']);
        expect(restoreContents).toEqual(expectedRestoreContents);
        const error = result.storeState.getIn(['app', 'restore', 'import', 'error']);
        expect(error).toEqual(null);
      }));
    it('should trigger decrypt error when the password is invalid', () => {
      const invalidPassword = '234';
      return expectSaga(decryptImport, { password: invalidPassword, filePath })
        .withReducer(withReducer, fromJS({
          app: initialState.setIn(['restore', 'import', 'data'], 'data'),
        }))
        .put.actionType(decryptImportError().type)
        .run({ silenceTimeout: true }).then((result) => {
          const error = result.storeState.getIn(['app', 'restore', 'import', 'error']);
          const data = result.storeState.getIn(['app', 'restore', 'import', 'data']);
          expect(error).toBeDefined();
          expect(data).toEqual(null);
        });
    });
  });
  describe('batch import', () => {
    it('should batch import wallets and contacts from the store', () => {
      const expectedRestoreContents = JSON.parse(JSON.stringify(contents));
      const saga = expectSaga(batchImport)
        .withReducer(withReducer, fromJS({
          app: initialState.setIn(['restore', 'import', 'data'], expectedRestoreContents),
          contacts: {
            contacts: [{ name: 'john', address: '0x1231323' }],
          },
        }));

      // eslint-disable-next-line no-restricted-syntax
      for (const wallet of contents.wallets.toJS()) {
        switch (wallet.type) {
          case 'software':
            saga.put(createWalletSuccess(wallet.name, wallet.encrypted, null, wallet.address));
            break;
          case 'lns':
            saga.put(saveLedgerAddress(wallet.name, wallet.derivationPath, wallet.deviceId, wallet.address));
            break;
          case 'trezor':
            saga.put(saveTrezorAddress(wallet.name, wallet.derivationPath, wallet.deviceId, wallet.address));
            break;
          case 'watch':
            saga.put(saveWatchAddress(wallet.name, wallet.address));
            break;
          default:
            break;
        }
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const contact of contents.contacts.filter((c) => c.name === 'john').toJS()) {
        saga.put(createContact(contact.name, contact.address));
      }

      return saga
        .run({ silenceTimeout: true })
        .then((result) => {
          const restoreContents = result.storeState.getIn(['app', 'restore', 'import', 'data']);
          const error = result.storeState.getIn(['app', 'restore', 'import', 'error']);
          expect(restoreContents).toEqual(null);
          expect(error).toEqual(null);
        });
    });
    it('should throw error when no data available for importing', () => expectSaga(batchImport)
      .withReducer(withReducer, fromJS({
        app: initialState,
        contacts: {
          contacts: [{ name: 'john', address: '0x1231323' }],
        },
      }))
      .put.actionType(batchImportError().type)
      .run({ silenceTimeout: true }));
    it('should throw error when a wallet type is not supported in batch import', () => {
      const expectedRestoreContents = JSON.parse(JSON.stringify(contents));
      expectedRestoreContents.wallets.push({ type: 'unknown' });
      return expectSaga(batchImport)
        .withReducer(withReducer, fromJS({
          app: initialState.setIn(['restore', 'import', 'data'], expectedRestoreContents),
          contacts: {
            contacts: [{ name: 'john', address: '0x1231323' }],
          },
        }))
        .put.actionType(batchImportError().type)
        .run({ silenceTimeout: true });
    });
  });
});
