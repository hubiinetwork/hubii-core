import { ipcRenderer } from 'electron';
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, select, take } from 'redux-saga/effects';
import { requestHardwareWalletAPI } from 'utils/request';
import { makeSelectTrezorInfo } from '../../selectors';
import { trezorConnected, trezorDisconnected, fetchedTrezorAddress } from '../../actions';
import { INIT_LEDGER, FETCH_TREZOR_ADDRESSES } from '../../constants';

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

export function* getAddress({ derivationPaths }) {
  const trezorInfo = yield select(makeSelectTrezorInfo());
  try {
    for (let i = 0; i < derivationPaths.length; i += 1) {
      const path = derivationPaths[i];
      const publicAddressKeyPair = yield call(requestHardwareWalletAPI, 'getaddress', { id: trezorInfo.get('id'), path });
      yield put(fetchedTrezorAddress(publicAddressKeyPair.path, publicAddressKeyPair.address));
    }
  } catch (e) {
    console.log('err', e);
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_LEDGER, init);
  yield takeEvery(FETCH_TREZOR_ADDRESSES, getAddress);
}
