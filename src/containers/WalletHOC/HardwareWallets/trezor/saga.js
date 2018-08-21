import { ipcRenderer } from 'electron';
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, select, take } from 'redux-saga/effects';
import { toBuffer, bufferToHex, stripHexPrefix } from 'ethereumjs-util';
import { notify } from 'containers/App/actions';
import { deriveAddresses, prependHexToAddress, IsAddressMatch } from 'utils/wallet';
import { requestHardwareWalletAPI } from 'utils/request';
import { makeSelectTrezorInfo } from '../../selectors';
import { trezorConnected, trezorDisconnected, fetchedTrezorAddress, trezorError } from '../../actions';
import { INIT_TREZOR, FETCH_TREZOR_ADDRESSES } from '../../constants';

export function* init() {
  const channel = yield call(listenTrezorDevicesChannel);
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const event = yield take(channel);
      if (event.status === 'connected') {
        yield put(trezorConnected(event.deviceId));
      }
      if (event.status === 'disconnected') {
        yield put(trezorDisconnected(event.deviceId));
        yield put(trezorError(new Error('Disconnected')));
      }
    } catch (e) {
      yield put(notify('error', e.message));
    }
  }
}

export const listenTrezorDevicesChannel = () => eventChannel((emit) => {
  ipcRenderer.on('trezor-status', (event, status) => {
    emit(status);
  });
  return () => { };
});

export function* getAddresses({ pathBase, count }) {
  const trezorInfo = yield select(makeSelectTrezorInfo());
  try {
    const key = yield call(requestHardwareWalletAPI, 'getpublickey', { id: trezorInfo.get('id'), path: pathBase });
    const addresses = deriveAddresses({ publicKey: key.node.public_key, chainCode: key.node.chain_code, count });
    for (let i = 0; i < addresses.length; i += 1) {
      const address = prependHexToAddress(addresses[i]);
      yield put(fetchedTrezorAddress(`${pathBase}/${i}`, address));
    }
  } catch (error) {
    const refinedError = trezorError(error);
    yield put(notify('error', refinedError.error));
  }
}

export function* signTxByTrezor({ walletDetails, raw, data, chainId }) {
  try {
    const tx = {
      nonce: stripHexPrefix(raw[0]),
      toAddress: stripHexPrefix(raw[3]),
      value: stripHexPrefix(raw[4]),
      data: raw[5] === '0x' ? null : stripHexPrefix(bufferToHex(toBuffer(data))),
      gasPrice: stripHexPrefix(raw[1]),
      gasLimit: stripHexPrefix(raw[2]),
      chainId,
    };
    const trezorInfo = yield select(makeSelectTrezorInfo());
    const deviceId = trezorInfo.get('id');
    const path = walletDetails.derivationPath;
    const publicAddressKeyPair = yield call(requestHardwareWalletAPI, 'getaddress', { id: deviceId, path });
    if (!IsAddressMatch(`0x${publicAddressKeyPair.address}`, walletDetails.address)) {
      throw new Error('PASSPHRASE_MISMATCH');
    }
    yield put(notify('info', 'Verify transaction details on your Trezor'));
    const signedTx = yield call(
      requestHardwareWalletAPI,
      'signtx',
      {
        id: deviceId,
        path,
        tx,
      }
    );

    return signedTx;
  } catch (e) {
    const refinedError = trezorError(e);
    throw new Error(refinedError.error);
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_TREZOR, init);
  yield takeEvery(FETCH_TREZOR_ADDRESSES, getAddresses);
}
