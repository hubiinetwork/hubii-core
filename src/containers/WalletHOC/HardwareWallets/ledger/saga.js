import { ipcRenderer } from 'electron';
import { takeLatest, takeEvery, put, call, select, take, race, spawn } from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import { deriveAddresses, prependHexToAddress } from 'utils/wallet';
import { notify } from 'containers/App/actions';
import { requestHardwareWalletAPI } from 'utils/request';
import {
  makeSelectLedgerNanoSInfo,
} from '../../selectors';
import {
  FETCH_LEDGER_ADDRESSES,
  INIT_LEDGER,
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
} from '../../constants';

import {
  ledgerConnected,
  ledgerDisconnected,
  ledgerEthAppConnected,
  ledgerEthAppDisconnected,
  ledgerError,
  fetchedLedgerAddress,
} from '../../actions';


// Creates an eventChannel to listen to Ledger events
export const ledgerChannel = () => eventChannel((emit) => {
  ipcRenderer.on('lns-status', (event, status) => {
    emit(status);
  });
  return () => { };
});

const ethChannels = {};
export const addEthChannel = (descriptor, channel) => {
  removeEthChannel(descriptor);
  ethChannels[descriptor] = channel;
};

export const removeEthChannel = (descriptor) => {
  const channel = ethChannels[descriptor];
  if (channel) {
    channel.close();
    delete ethChannels[descriptor];
  }
};

export const ledgerEthChannel = (descriptor) => eventChannel((listener) => {
  let inProgress = false;
  const iv = setInterval(() => {
    if (inProgress) {
      return;
    }

    inProgress = true;
    const path = 'm/44\'/60\'/0\'/0';
    const method = 'getaddress';
    requestEthTransportActivity({ method, params: { descriptor, path } }).then((address) => {
      inProgress = false;
      listener({ connected: true, address });
    }).catch((err) => {
      inProgress = false;
      listener({ connected: false, error: err });
    });
  }, 2000);
  return () => {
    clearInterval(iv);
  };
});

export function* pollEthApp({ descriptor }) {
  const channel = yield call(ledgerEthChannel, descriptor);
  addEthChannel(descriptor, channel);
  while (true) { // eslint-disable-line no-constant-condition
    const status = yield take(channel);
    try {
      if (status.connected) {
        removeEthChannel(descriptor);
        yield put(ledgerEthAppConnected(descriptor, status.address.publicKey));
      } else {
        yield put(ledgerEthAppDisconnected(descriptor));
        yield put(ledgerError(status.error));
      }
    } catch (error) {
      removeEthChannel(descriptor);
    }
  }
}

export function* hookLedgerDisconnected({ descriptor }) {
  removeEthChannel(descriptor);
  yield put(ledgerError({ message: 'Disconnected' }));
}

export function* initLedger() {
  const supported = yield call(LedgerTransport.isSupported);
  if (!supported) {
    yield put(ledgerError(Error('NoSupport')));
    return;
  }

  const chan = yield call(ledgerChannel);

  // Changing of the physical ledger state (changing app, toggling browser support etc)
  // emits a 'remove', then shortly after 'add' event. If 'remove' is emited and no 'add'
  // afterwards we know the device is disconnected. Every change of the ledger state,
  // try to look into it's Eth state. If it fails, we dispatch the appropriate error
  // message
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const msg = yield take(chan);
      if (msg.type === 'remove') {
        const { timeout } = yield race({
          msg: take(chan),
          timeout: call(delay, 1000),
        });
        if (timeout) {
          yield put(ledgerDisconnected(msg.descriptor));
          continue; // eslint-disable-line no-continue
        }
      }

      yield put(ledgerConnected(msg.descriptor));
    } catch (e) {
      yield put(ledgerError(e));
    }
  }
}

// Dispatches the address for every derivation path in the input
export function* fetchLedgerAddresses({ pathBase, count }) {
  try {
    const ledgerStatus = yield select(makeSelectLedgerNanoSInfo());
    if (!ledgerStatus.get('descriptor')) {
      throw new Error('no descriptor available');
    }
    const descriptor = ledgerStatus.get('descriptor');
    const method = 'getpublickey';
    const publicAddressKeyPair = yield call(tryCreateEthTransportActivity, method, { descriptor, path: pathBase });
    const addresses = deriveAddresses({ publicKey: publicAddressKeyPair.publicKey, chainCode: publicAddressKeyPair.chainCode, count });

    for (let i = 0; i < addresses.length; i += 1) {
      const address = prependHexToAddress(addresses[i]);
      yield put(fetchedLedgerAddress(`${pathBase}/${i}`, address));
    }
  } catch (error) {
    yield put(ledgerError(error));
  }
}

export function* tryCreateEthTransportActivity(method, params) {
  try {
    return yield call(requestEthTransportActivity, { method, params });
  } catch (error) {
    yield spawn(pollEthApp, { descriptor: params.descriptor });
    throw error;
  }
}

export function requestEthTransportActivity({ method, params }) {
  const data = {
    ...params,
    id: params.id || params.descriptor,
  };
  return requestHardwareWalletAPI(method, data, 'lns://').catch((err) => {
    throw err;
  });
}

export function* signTxByLedger(walletDetails, rawTxHex) {
  try {
    const ledgerNanoSInfo = yield select(makeSelectLedgerNanoSInfo());
    const descriptor = ledgerNanoSInfo.get('descriptor');

    // check if the eth app is opened
    yield call(
      tryCreateEthTransportActivity,
      'getaddress',
      { descriptor, path: walletDetails.derivationPath }
    );
    yield put(notify('info', 'Verify transaction details on your Ledger'));

    const signedTx = yield call(
      tryCreateEthTransportActivity,
      'signtx',
      { descriptor, path: walletDetails.derivationPath, rawTxHex },
    );
    return signedTx;
  } catch (e) {
    const refinedError = ledgerError(e);
    yield put(refinedError);
    throw new Error(refinedError.error);
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_LEDGER, initLedger);
  yield takeLatest(FETCH_LEDGER_ADDRESSES, fetchLedgerAddresses);
  yield takeEvery(LEDGER_CONNECTED, pollEthApp);
  yield takeEvery(LEDGER_DISCONNECTED, hookLedgerDisconnected);
}
