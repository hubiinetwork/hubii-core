import { delay, eventChannel } from 'redux-saga';
import { takeLatest, takeEvery, put, call, select, take, race, spawn } from 'redux-saga/effects';
import { requestHardwareWalletAPI } from 'utils/request';
import {makeSelectTrezorInfo} from '../../selectors'
import {trezorConnected, trezorDisconnected, fetchedTrezorAddress} from '../../actions'
import {INIT_LEDGER, INIT_TREZOR, FETCH_TREZOR_ADDRESSES, FETCHED_TREZOR_ADDRESS} from '../../constants'
// import {listenDevices, getAddresses} from './protocolAPI'
const { ipcRenderer } = require ('electron');

export function* init() {
  const channel = yield call(listenTrezorDevicesChannel)
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const event = yield take(channel);
      if (event.status === 'connected') {
        yield put(trezorConnected(event.deviceId))
      }
      if (event.status === 'disconnected') {
        yield put(trezorDisconnected(event.deviceId))
      }
    } catch (e) {
      console.log('err', e)
    }
  }
}

const devices = {}
let list
export const listenTrezorDevicesChannel = () => eventChannel((emit) => {
  console.log('status')
  // listenDevices(emit)
  // console.log('listen status')
  ipcRenderer.on('status', (event, status) => {
    console.log('got status', status)
    emit(status)
  })
  return () => {  };
});

const acquireDevice = async (deviceId) => {
  if (devices[deviceId]) {
    return devices[deviceId]
  }
  // const deviceList = new DeviceList({debug: false});
  // const { device } = await deviceList.acquireFirstDevice(true);
  return device
}

export function* getAddress({derivationPaths}) {
  const trezorInfo = yield select(makeSelectTrezorInfo())
  try {
    for (let i = 0; i < derivationPaths.length; i += 1) {
      const path = derivationPaths[i];
      const publicAddressKeyPair = yield call(requestHardwareWalletAPI, 'getaddress', {id: trezorInfo.get('id'), path})
      console.log('address', publicAddressKeyPair)
      yield put(fetchedTrezorAddress(publicAddressKeyPair.path, publicAddressKeyPair.address));
    }
    // const requestPath = 'getAddress';
    // const returnData = yield call(requestHardwareWalletAPI, requestPath, {id, path});
    // const data = yield returnData.json()
    // console.log('return data', data)
    // return yield device.waitForSessionAndRun(function (session) {
    //   let promise = Promise.resolve()
    //   for (let i=0; i<paths.length; i++) {
    //     const pathArray = paths[i].replace("'").split('/')
    //     promise = promise.then(() => {
    //       return session.ethereumGetAddress([
    //         (parseInt(pathArray[1]) | hardeningConstant) >>> 0,
    //         (parseInt(pathArray[2]) | hardeningConstant) >>> 0,
    //         (parseInt(pathArray[3]) | hardeningConstant) >>> 0,
    //         parseInt(pathArray[4]),
    //         parseInt(pathArray[5])
    //       ], false)
    //       .then(function (result) {
    //           console.log('Address:', result.message.address);
    //       }).catch(e => {
    //         console.log('addr err', e)
    //         //Transport stopped when disconnected
    //       })
    //     })
    //   }
    //   return promise
    // })
    // const address = yield device.ethereumGetAddress(path)
    // console.log('addr', address)
    // yield put(fetchedLedgerAddress(path, address))
  } catch (e) {
    console.log('err', e)
  }
}

// Root watcher
export default function* watch() {
  yield takeEvery(INIT_LEDGER, init);
  yield takeEvery(FETCH_TREZOR_ADDRESSES, getAddress);
}