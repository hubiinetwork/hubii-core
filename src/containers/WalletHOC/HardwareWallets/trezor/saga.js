import { ipcRenderer } from 'electron';
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, select, take } from 'redux-saga/effects';
import { deriveAddresses, prependHexToAddress } from 'utils/wallet';
import { requestHardwareWalletAPI } from 'utils/request';
import { makeSelectTrezorInfo } from '../../selectors';
import { trezorConnected, trezorDisconnected, fetchedTrezorAddress } from '../../actions';
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
      }
    } catch (e) {
      console.log('err', e);
    }
  }
}

export const listenTrezorDevicesChannel = () => eventChannel((emit) => {
  ipcRenderer.on('status', (event, status) => {
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
  } catch (e) {
    console.log('err', e);
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_TREZOR, init);
  yield takeEvery(FETCH_TREZOR_ADDRESSES, getAddresses);
}
