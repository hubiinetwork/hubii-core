/**
 * WalletHoc sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { eventChannel } from 'redux-saga';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import { takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
// import * as matchers from 'redux-saga-test-plan/matchers';
import { requestWalletAPI } from 'utils/request';
import { createEthTransportActivity } from 'utils/ledger/comms';
import { ethAppNotOpenErrorMsg, disconnectedErrorMsg } from 'utils/ledger/friendlyErrors';
import { Wallet, utils } from 'ethers';
import walletHocReducer from 'containers/WalletHOC/reducer';
import { fromJS } from 'immutable';
import { notify } from 'containers/App/actions';

import walletHoc, {
  createWalletFromMnemonic,
  createWalletFromPrivateKey,
  decryptWallet,
  loadWalletBalancesSaga,
  initWalletsBalances,
  transfer,
  fetchLedgerAddresses,
  transferERC20,
  transferEther,
  waitTransactionHash,
  hookNewWalletCreated,
  listenBalances,
  initLedger,
  ledgerChannel,
  ledgerEthChannel,
  pollEthApp,
  sendTransactionByLedger,
} from '../saga';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  DECRYPT_WALLET,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  LOAD_WALLET_BALANCES,
  LOAD_WALLETS_SUCCESS,
  FETCH_LEDGER_ADDRESSES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  TRANSFER_SUCCESS,
  CREATE_WALLET_SUCCESS,
  LISTEN_TOKEN_BALANCES,
  INIT_LEDGER,
  LEDGER_ERROR,
  // LEDGER_CONNECTED,
} from '../constants';

import {
  createWalletSuccess,
  createWalletFailed,
  decryptWalletSuccess,
  decryptWalletFailed,
  showDecryptWalletModal,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  initLedger as initLedgerAction,
  loadWalletBalancesError,
  transferSuccess,
  transferError,
  transactionConfirmed as transactionConfirmedAction,
  transfer as transferAction,
  listenBalances as listenBalancesAction,
  addNewWallet as addNewWalletAction,
  ledgerError,
  ledgerEthAppConnected,
  ledgerEthAppDisconnected,
  ledgerConnected,
  ledgerDisconnected,
} from '../actions';
import { findWalletIndex, getTransactionCount, sendTransaction, getTransaction } from '../../../utils/wallet';
// import { transportMock, addressMock, ethMock, channelMock } from './mocks/ledgerMocks';
// import { createTransport, newEth } from '../../../utils/ledger/comms';
import { privateKeyMock, encryptedMock, addressMock, privateKeyNoPrefixMock } from '../../../mocks/wallet';

describe('createWalletFromMnemonic saga', () => {
  describe('create wallet by mnemonic', () => {
    const password = 'dogs';
    const mnemonic = 'movie viable write punch mango arrest cotton page grass dad document practice';
    const derivationPath = 'm/44\'/60\'/0\'/0/0';
    const name = 'wallet8';
    const encryptedWallet = '{"address":"a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","id":"f17128a6-c5f0-4af0-a168-67cf6d3d8552","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6167c13fe3cd195b4ce9312a9f9399ce"},"ciphertext":"2434b52afa29851edea2acb7f33dd854fc7e7b036ad6a2c3614f3d61ef0e19ce","kdf":"scrypt","kdfparams":{"salt":"b0662c8968389207137be9f346fb1cfba604f9d214e95012881025b7ebc5b9da","n":131072,"dklen":32,"p":1,"r":8},"mac":"256bd09baf3341e9f7df675b8a8cc551b86dfd0dfdf1aa8df2596882f3751496"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-06-19T04-19-27.0Z--a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","mnemonicCounter":"20da552ff9e584fc89194af19543a096","mnemonicCiphertext":"ff46b728607532d5be86a0647b169a18","version":"0.1"}}';
    const address = '0xA0EcCD7605Bb117DD2A4Cd55979C720Cf00F7fa4';

    it('should dispatch createWalletSuccess', () => expectSaga(createWalletFromMnemonic, { name, mnemonic, derivationPath, password })
      .provide({
        call() {
          return encryptedWallet;
        },
      })
      .put.like({
        action: createWalletSuccess(name, encryptedWallet, { address, mnemonic }),
      })
      .run({ silenceTimeout: true }));
    describe('exceptions', () => {
      it('when mnemonic is invalid', () => {
        const invalidMnemonic = 'rubbish';
        expectSaga(createWalletFromMnemonic, { name, invalidMnemonic, derivationPath, password })
          .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
          .put(createWalletFailed(new Error('invalid param')))
          .run({ silenceTimeout: true });
      });
      it('when mnemonic is not given', () => expectSaga(createWalletFromMnemonic, { name, derivationPath, password })
        .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
        .put(createWalletFailed(new Error('invalid param')))
        .run({ silenceTimeout: true }));
      it('when derivation path is not given', () => expectSaga(createWalletFromMnemonic, { name, mnemonic, password })
        .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
        .put(createWalletFailed(new Error('invalid param')))
        .run({ silenceTimeout: true }));
      it('when password is not given', () => expectSaga(createWalletFromMnemonic, { name, mnemonic, derivationPath })
        .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
        .put(createWalletFailed(new Error('invalid param')))
        .run({ silenceTimeout: true }));
    });
  });

  describe('create wallet by private key', () => {
    const pwd = 'test';
    it('should dispatch createWalletSuccess when wallet creation successful with prefixed private key', () => expectSaga(createWalletFromPrivateKey, { privateKey: privateKeyMock, name, password: pwd })
      .provide({
        call() {
          return encryptedMock;
        },
      })
      .put.like({
        action: createWalletSuccess(name, encryptedMock, { privateKey: privateKeyMock, address: addressMock }),
      })
      .run({ silenceTimeout: true })
    );
    it('should dispatch createWalletSuccess when wallet creation successful with non-prefixed private key', () => expectSaga(createWalletFromPrivateKey, { privateKey: privateKeyNoPrefixMock, name, password: pwd })
      .provide({
        call() {
          return encryptedMock;
        },
      })
      .put.like({
        action: createWalletSuccess(name, encryptedMock, { privateKey: privateKeyMock, address: addressMock }),
      })
      .run({ silenceTimeout: true })
    );
    describe('exceptions', () => {
      it('when private key is invalid', () => expectSaga(createWalletFromPrivateKey, { privateKeyMock: null, name, password: pwd })
        .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
        .put(createWalletFailed(new Error('invalid param')))
          .run({ silenceTimeout: true }));
      it('when address is not given', () => expectSaga(createWalletFromPrivateKey, { privateKeyMock, address: null, password: pwd })
        .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
        .put(createWalletFailed(new Error('invalid param')))
          .run({ silenceTimeout: true }));
      it('when password is not given', () => expectSaga(createWalletFromPrivateKey, { privateKeyMock, name, password: null })
        .put(notify('error', `Failed to import wallet: ${new Error('invalid param')}`))
        .put(createWalletFailed(new Error('invalid param')))
          .run({ silenceTimeout: true }));
    });
  });
});

describe('CREATE_WALLET_SUCCESS', () => {
  it('should add wallet to the store', () => {
    const storeState = {
      walletHoc: {
        wallets: [],
      },
    };
    const address = '01';
    const newWallet = { name: 'name', address: `0x${address}`, encrypted: `{"address":"${address}"}`, decrypted: {} };
    return expectSaga(hookNewWalletCreated, { newWallet })
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .put(addNewWalletAction(newWallet))
      .put(loadWalletBalances(`0x${address}`))
      .run({ silenceTimeout: true })
      .then((result) => {
        const wallets = result.storeState.getIn(['walletHoc', 'wallets']);
        const wallet = fromJS(newWallet).set('loadingBalances', true);
        expect(wallets.count()).toEqual(1);
        expect(wallets.get(0)).toEqual(wallet);
      });
  });
  it('should not add wallet with same address', () => {
    const address = '01';
    const existWallet = { name: 'name', address: `0x${address}`, encrypted: `{"address":"${address}"}`, decrypted: {} };
    const storeState = {
      walletHoc: {
        wallets: [existWallet],
      },
    };
    const newWallet = Object.assign({}, existWallet);
    newWallet.name = 'new name';
    return expectSaga(hookNewWalletCreated, { newWallet })
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .put(notify('error', `Wallet ${existWallet.address} already exists`))
      .run({ silenceTimeout: true })
      .then((result) => {
        const wallets = result.storeState.getIn(['walletHoc', 'wallets']);
        expect(wallets.count()).toEqual(1);
        expect(wallets.get(0).get('name')).toEqual(existWallet.name);
      });
  });
  it('should not add wallet with same name', () => {
    const address = '01';
    const existWallet = { name: 'name', address: `0x${address}`, encrypted: `{"address":"${address}"}`, decrypted: {} };
    const storeState = {
      walletHoc: {
        wallets: [existWallet],
      },
    };
    const newWallet = Object.assign({}, existWallet);
    newWallet.address = '0x02';
    return expectSaga(hookNewWalletCreated, { newWallet })
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .put(notify('error', `Wallet ${existWallet.name} already exists`))
      .run({ silenceTimeout: true })
      .then((result) => {
        const wallets = result.storeState.getIn(['walletHoc', 'wallets']);
        expect(wallets.count()).toEqual(1);
        expect(wallets.get(0).get('address')).toEqual(existWallet.address);
      });
  });
});

describe('decryptWallet saga', () => {
  const encryptedWallet = '{"address":"a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","id":"f17128a6-c5f0-4af0-a168-67cf6d3d8552","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6167c13fe3cd195b4ce9312a9f9399ce"},"ciphertext":"2434b52afa29851edea2acb7f33dd854fc7e7b036ad6a2c3614f3d61ef0e19ce","kdf":"scrypt","kdfparams":{"salt":"b0662c8968389207137be9f346fb1cfba604f9d214e95012881025b7ebc5b9da","n":131072,"dklen":32,"p":1,"r":8},"mac":"256bd09baf3341e9f7df675b8a8cc551b86dfd0dfdf1aa8df2596882f3751496"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-06-19T04-19-27.0Z--a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","mnemonicCounter":"20da552ff9e584fc89194af19543a096","mnemonicCiphertext":"ff46b728607532d5be86a0647b169a18","version":"0.1"}}';
  const password = 'dogs';
  const address = '0x00';
  const decryptedWallet = { privateKey: '0x409300caf64bdf96a92d7f99547a5d67702fbdd759bbea4ca19b11a21d9c8528', defaultGasLimit: 1500000, address: '0xA0EcCD7605Bb117DD2A4Cd55979C720Cf00F7fa4', mnemonic: 'movie viable write punch mango arrest cotton page grass dad document practice', path: "m/44'/60'/0'/0/0" };

  it('should first dispatch notify action', () => {
    const decryptWalletGenerator = decryptWallet({ name, encryptedWallet, password });
    const putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(putDescriptor).toEqual(put(notify('info', 'Unlocking wallet...')));
  });

  it('should dispatch the decryptWalletSuccess and notify action if successful', () => {
    const decryptWalletGenerator = decryptWallet({ address, encryptedWallet, password });
    decryptWalletGenerator.next();
    decryptWalletGenerator.next();
    let putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(JSON.stringify(putDescriptor)).toEqual(JSON.stringify(put(decryptWalletSuccess(address, decryptedWallet))));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('success', 'Wallet unlocked!')));
  });

  it('should dispatch decryptWalletFailed and notify action if address is undefined', () => {
    const decryptWalletGenerator = decryptWallet({ encryptedWallet, password });
    decryptWalletGenerator.next();
    let putDescriptor = decryptWalletGenerator.next().value;
    const error = new Error('Address undefined');
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('error', `Failed to unlock wallet: ${error}`)));
  });

  it('should dispatch the decryptWalletFailed and notify action if decryption fails', () => {
    const decryptWalletGenerator = decryptWallet({ address, encryptedWallet, password });
    decryptWalletGenerator.next();
    decryptWalletGenerator.next();
    const error = new Error('some error occured');
    let putDescriptor = decryptWalletGenerator.next(error).value;
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('error', `Failed to unlock wallet: ${error}`)));
  });
});

describe('initLedger saga', () => {
  it('should dispatch ledgerError if cannot establish Transport', () => expectSaga(initLedger)
    .provide([
      [call(LedgerTransport.isSupported), false],
    ])
    .put(ledgerError(Error('NoSupport')))
    .dispatch(initLedgerAction())
    .run()
  );

  // redux-saga-test-plan has issues running inside infinite loops
  // skipping this test until it's clear how to handle
  // see https://github.com/jfairbank/redux-saga-test-plan/issues/74
  // xit('should dispatch ledgerEthAppConnected if Ledger successfully connected', () => expectSaga(initLedger)
  //   .provide([
  //     [call(LedgerTransport.isSupported), true],
  //     [matchers.call.fn(ledgerChannel), channelMock],
  //     [matchers.call.fn(createTransport), transportMock],
  //     [matchers.call.fn(newEth), ethMock],
  //     [matchers.call.fn(ethMock.getAddress), addressMock],
  //     {
  //       take({ channel }, next) {
  //         if (channel === channelMock) {
  //           return { type: 'add' };
  //         }
  //         return next();
  //       },
  //     },
  //   ])
  //     .put(ledgerEthAppConnected(addressMock.publicKey))
  //     .dispatch(initLedgerAction())
  //     .run()
  //   );

  it('should trigger ledgerConnectedAction when ledger usb is connected', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    return expectSaga(initLedger)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = true;
          }
          if (effect.fn === ledgerChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ type: 'add', descriptor });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
      })
      .put(ledgerConnected(descriptor))
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'connected'])).toEqual(true);
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'descriptor'])).toEqual(descriptor);
      });
  });
  it('should trigger ledgerDisconnectedAction when ledger usb is discorded', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    return expectSaga(walletHoc)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = true;
          }
          if (effect.fn === ledgerChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ type: 'remove', descriptor });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
        race() {
          return { timeout: true };
        },
      })
      .dispatch({ type: INIT_LEDGER })
      .put(ledgerDisconnected(descriptor))
      .put(ledgerError({ message: 'Disconnected' }))
      .not.put.actionType(ledgerConnected().type)
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'status'])).toEqual('disconnected');
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'connected'])).toEqual(false);
        expect(state.getIn(['walletHoc', 'errors', 'ledgerError'])).toEqual(disconnectedErrorMsg);
      });
  });
  it('should trigger nosupport error action when ledger is not supported', () => {
    const storeState = {};
    return expectSaga(initLedger)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = false;
          }
          return result;
        },
      })
      .put(ledgerError(Error('NoSupport')))
      .not.put.actionType(ledgerDisconnected().type)
      .not.put.actionType(ledgerConnected().type)
      .run({ silenceTimeout: true });
  });
  it('should debounce remove event if add event follows within a second', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    return expectSaga(initLedger)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          let result;
          if (effect.fn === LedgerTransport.isSupported) {
            result = true;
          }
          if (effect.fn === ledgerChannel) {
            result = eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ type: 'remove', descriptor });
                emitter({ type: 'add', descriptor });
              }, 100);
              return () => {};
            });
          }
          return result;
        },
      })
      .put.actionType(ledgerConnected().type)
      .not.put.actionType(ledgerDisconnected().type)
      .run({ silenceTimeout: true });
  });
  xit('should close eth channel when ledger disconnected', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    const closeSpy = jest.fn();
    // removeEthChannel =
    return expectSaga(walletHoc)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      // .provide({
      //   call(effect) {
      //     if (effect.fn === LedgerTransport.isSupported) {
      //       return true;
      //     }
      //     if (effect.fn === ledgerChannel) {
      //       return eventChannel((emitter) => {
      //         setTimeout(() => {
      //           emitter({ type: 'remove', descriptor });
      //           emitter({ type: 'add', descriptor });
      //         }, 100);
      //         return () => {};
      //       });
      //     }
      //   },
      // .put.actionType(ledgerConnected().type)
      // .not.put.actionType(ledgerDisconnected().type)
      .dispatch(ledgerDisconnected(descriptor))
      .run({ silenceTimeout: true })
      .then(() => {
        expect(closeSpy).toBeCalled();
        // expect(ethChannels[descriptor]).toEqual(undefined);
      });
  });
  it('should trigger ledger detected when ethereum app is open', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    const status = {
      address: {
        publicKey: 'test',
      },
    };
    return expectSaga(pollEthApp, { descriptor })
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          if (effect.fn === ledgerEthChannel) {
            return eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ connected: true, address: status.address });
              }, 100);
              return () => {};
            });
          }
          return true;
        },
      })
      .put(ledgerEthAppConnected(descriptor, status.address.publicKey))
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'status'])).toEqual('connected');
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'ethConnected'])).toEqual(true);
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'id'])).toEqual(status.address.publicKey);
        // expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'descriptor'])).toEqual(descriptor);
      });
  });
  it('should trigger ledger detected when ethereum app is close', () => {
    const storeState = {};
    const descriptor = 'test descriptor string';
    const error = { name: 'TransportStatusError' };
    return expectSaga(pollEthApp, { descriptor })
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          if (effect.fn === ledgerEthChannel) {
            return eventChannel((emitter) => {
              setTimeout(() => {
                emitter({ connected: false, error });
              }, 100);
              return () => {};
            });
          }
          return true;
        },
      })
      .put(ledgerEthAppDisconnected(descriptor))
      .put(ledgerError(error))
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'status'])).toEqual('disconnected');
        expect(state.getIn(['walletHoc', 'ledgerNanoSInfo', 'ethConnected'])).toEqual(false);
        expect(state.getIn(['walletHoc', 'errors', 'ledgerError'])).toEqual(ethAppNotOpenErrorMsg);
      });
  });
  // it('should close existing eth channel with the same descriptor for ledger connected event', () => {
  //   const storeState = {
  //   };
  //   return expectSaga(walletHoc)
  //     .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
  //     .provide([
  //       // mock existing eth channel for same descriptor
  //     ])
  //     .put(ledgerEthAppConnected({ status: 'connect' }))
  //     .put(ledgerEthAppConnected({ status: 'disconnect' }))
  //     .dispatch({ type: LEDGER_CONNECTED })
  //     .dispatch({ type: LEDGER_CONNECTED })
  //     .run(5000000)
  //     .then((result) => {
  //       // assert eth channel with same descriptor closed
  //     });
  // });
  // it('should close existing eth channel with the same descriptor for ledger disconnected event', () => {
  //   const storeState = {
  //   };
  //   return expectSaga(walletHoc)
  //     .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
  //     .provide([
  //       // mock existing eth channel for same descriptor
  //     ])
  //     .put(ledgerEthAppConnected({ status: 'disconnect' }))
  //     .dispatch({ type: LEDGER_DISCONNECTED })
  //     .run(5000000)
  //     .then((result) => {
  //       // assert eth channel with same descriptor closed
  //     });
  // });
});

describe('load wallets saga', () => {
  xit('#loadWalletBalances should load balances and dispatch loadWalletBalancesSuccess', () => {
    const response = { tokens: [] };
    const address = 'abcd';
    return expectSaga(loadWalletBalancesSaga, { address })
      .provide({
        call(effect) {
          expect(effect.fn).toBe(requestWalletAPI);
          expect(effect.args[0], `ethereum/wallets/${address}/balance`);
          return response;
        },
      })
      .put(loadWalletBalancesSuccess(address, response))
      .run({ silenceTimeout: true });
  });

  it('#loadWalletBalances should dispatch loadWalletBalancesError when error throws in request', () => {
    const address = 'abcd';
    const error = new Error();
    return expectSaga(loadWalletBalancesSaga, { address })
      .provide({
        call(effect) {
          expect(effect.fn).toBe(requestWalletAPI);
          throw error;
        },
      })
      .put(loadWalletBalancesError(address, error))
      .run({ silenceTimeout: true });
  });

  it('should trigger action loadWalletBalances when createWalletSuccess action is dispatch', () => {
    const decryptedWallet = { address: '0x123' };
    const encryptedWallet = JSON.stringify({ address: '123' });
    return expectSaga(walletHoc)
      .provide({
        select() {
          return fromJS([]);
        },
      })
      .put(loadWalletBalances(decryptedWallet.address))
      .dispatch(createWalletSuccess(name, encryptedWallet, decryptedWallet))
      .run({ silenceTimeout: true });
  });


  describe('payment transfer', () => {
    describe('software wallet', () => {
      it('sign transaction for eth payment', () => {
        // create txn hash
        // should save pending txn hash in store and localstorage
        // listen for confirmation
        // update pending txn in store
        const storeState = {
          walletHoc: {
            wallets: [{
              name: 't1',
              type: 'software',
              address: '0xabcd',
              encrypted: '{"address": "abcd"}',
              decrypted: {
                privateKey: '0x40c2ebcaf1c719f746bc57feb85c56b6143c906d849adb30d62990c4454b2f15',
              },
            }],
            currentWallet: {
              name: 't1',
              address: '0xabcd',
            },
            pendingTransactions: [],
            confirmedTransactions: [],
          },
        };
        const timestamp = new Date().getTime();
        const signedTransaction = {
          nonce: 49,
          gasPrice: 1,
          gasLimit: 1,
          to: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          value: 1,
          data: '0x',
          v: 42,
          r: '0x715935bf243f0273429ba09b2c65ff2d15ca3a8b18aecc35e7d5b4ebf5fe2f56',
          s: '0x32aacbc76007f51de3c6efedad074a6b396d2a35d9b6a49ad0b250d40a7f046e',
          chainId: 3,
          from: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a',
          hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
        };
        const confirmedTransaction = {
          ...signedTransaction,
          blockHash: '0x756da99f6be563b86238a162ee2586b0236e3e87c62cde69426ff7bab71d6066',
          blockNumber: 3558042,
          transactionIndex: 9,
          raw: 'raw',
        };
        const formatedTransaction = {
          timestamp,
          token: 'ETH',
          from: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a',
          to: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
          value: 1,
          input: '0x',
          success: true,
          original: confirmedTransaction,
        };
        const params = {
          token: 'ETH',
          toAddress: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          amount: 0.0001,
          gasPrice: 30000,
          gasLimit: 21000,
          wallet: { encrypted: {}, decrypted: {} },
        };
        let called = 0;
        return expectSaga(walletHoc)
          .provide({
            call(effect, next) {
              called += 1;
              if (called === 1) {
                return signedTransaction;
              }
              if (called === 2) {
                return confirmedTransaction;
              }
              return next();
            },
          })
          .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
          .dispatch(transferAction(params))
          .put(transferSuccess(signedTransaction, 'ETH'))// send signed transaction
          .put(transactionConfirmedAction(confirmedTransaction))// transaction confirmed in the network
          .run({ silenceTimeout: true })
          .then((result) => {
            const walletHocState = result.storeState.get('walletHoc');
            expect(walletHocState.getIn(['pendingTransactions']).count()).toEqual(0);
            expect(walletHocState.getIn(['confirmedTransactions']).count()).toEqual(1);
            formatedTransaction.value = parseFloat(utils.formatEther(formatedTransaction.value));
            expect(walletHocState.getIn(['confirmedTransactions']).get(0).toJS()).toEqual(formatedTransaction);
          });
      });
      it('sign transaction for erc20 payment', () => {
        // create txn hash
        // should save pending txn hash in store and localstorage
        // listen for confirmation
        // update pending txn in store
        const storeState = {
          walletHoc: {
            wallets: [{
              name: 't1',
              type: 'software',
              address: '0xabcd',
              encrypted: '{"address": "abcd"}',
              decrypted: {
                privateKey: '0x40c2ebcaf1c719f746bc57feb85c56b6143c906d849adb30d62990c4454b2f15',
              },
            }],
            currentWallet: {
              name: 't1',
              address: '0xabcd',
            },
            pendingTransactions: [],
            confirmedTransactions: [],
          },
        };
        const signedTransaction = {
          nonce: 49,
          gasPrice: 1,
          gasLimit: 1,
          from: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          value: 1,
          data: '0xa9059cbb000000000000000000000000994c3de8cc5bc781183205a3dd6e175be1e6f14a00000000000000000000000000000000000000000000000000005af3107a4000',
          v: 42,
          r: '0x715935bf243f0273429ba09b2c65ff2d15ca3a8b18aecc35e7d5b4ebf5fe2f56',
          s: '0x32aacbc76007f51de3c6efedad074a6b396d2a35d9b6a49ad0b250d40a7f046e',
          chainId: 3,
          to: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
          hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
        };
        const confirmedTransaction = {
          ...signedTransaction,
          blockHash: '0x756da99f6be563b86238a162ee2586b0236e3e87c62cde69426ff7bab71d6066',
          blockNumber: 3558042,
          transactionIndex: 9,
          raw: 'raw',
        };
        const formatedTransaction = {
          timestamp: new Date().getTime(),
          token: 'BOKKY',
          from: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          to: '0x994c3de8cc5bc781183205a3dd6e175be1e6f14a',
          hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
          value: 0.0001,
          input: signedTransaction.data,
          success: true,
          original: confirmedTransaction,
        };
        const params = {
          token: 'BOKKY',
          toAddress: '0x994c3de8cc5bc781183205a3dd6e175be1e6f14a',
          amount: 0.0001,
          gasPrice: 3000000,
          gasLimit: 210000,
          wallet: { encrypted: {}, decrypted: {} },
          contractAddress: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
        };
        let called = 0;
        return expectSaga(walletHoc)
          .provide({
            call(effect, next) {
              called += 1;
              if (called === 1) {
                return signedTransaction;
              }
              if (called === 2) {
                return confirmedTransaction;
              }
              return next();
            },
          })
          .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
          .dispatch(transferAction(params))
          .put(transferSuccess(signedTransaction, 'BOKKY'))// send signed transaction
          .put(transactionConfirmedAction(confirmedTransaction))// transaction confirmed in the network
          .run({ silenceTimeout: true })
          // .run(500000)
          .then((result) => {
            const walletHocState = result.storeState.get('walletHoc');
            expect(walletHocState.getIn(['pendingTransactions']).count()).toEqual(0);
            expect(walletHocState.getIn(['confirmedTransactions']).count()).toEqual(1);
            expect(walletHocState.getIn(['confirmedTransactions']).get(0)).toEqual(fromJS(formatedTransaction));
          });
      });
    });
    describe('hardware wallet: ledger', () => {
      it('#sendTransactionByLedger should sign tx and output a hex correctly', () => {
        const storeState = {
          walletHoc: {
            wallets: [{
              name: 't1',
              type: 'lns',
              address: '0xe1dddbd012f6a9f3f0a346a2b418aecd03b058e7',
              derivationPath: 'm/44\'/60\'/0\'/0',
            }],
            currentWallet: {
              name: 't1',
              address: '0xe1dddbd012f6a9f3f0a346a2b418aecd03b058e7',
            },
            pendingTransactions: [],
            confirmedTransactions: [],
            ledgerNanoSInfo: {
              descriptor: 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC@14/XHC@14000000/HS09@14900000/Nano S@14900000/Nano S@0/IOUSBHostHIDDevice@14900000,0',
            },
          },
        };
        const params = {
          token: 'ETH',
          toAddress: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          amount: utils.parseEther('0.0001'),
          gasPrice: 30000,
          gasLimit: 21000,
        };
        const nonce = 16;
        const signedTx = {
          v: '2a',
          r: '7140f2dbd69f235c5ba229da1651a8c30062213a8a3a27f424a177cc01189fd8',
          s: '1b7384730b63b8a70bababc3999c00bd99ed7fbd4c5c7e74cabcfa4d3133d119',
        };
        const expectedSignedTxHex = '0xf8671082753082520894bfdc0c8e54af5719872a2edef8e65c9f4a3eae88865af3107a4000802aa07140f2dbd69f235c5ba229da1651a8c30062213a8a3a27f424a177cc01189fd8a01b7384730b63b8a70bababc3999c00bd99ed7fbd4c5c7e74cabcfa4d3133d119';
        let signedTxHex;
        return expectSaga(sendTransactionByLedger, params)
          .provide({
            call(effect) {
              if (effect.fn === createEthTransportActivity) {
                return signedTx;
              }
              if (effect.fn === getTransactionCount) {
                return nonce;
              }
              if (effect.fn === sendTransaction) {
                signedTxHex = effect.args[0];
                return 'hash';
              }
              if (effect.fn === getTransaction) {
                return { value: 1 };
              }
              return {};
            },
          })
          .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
          .not.put.actionType(LEDGER_ERROR)
          .run({ silenceTimeout: true })
          .then(() => {
            expect(signedTxHex).toEqual(expectedSignedTxHex);
          });
      });
      it('handle ledger nano errors during signing a transaction', () => {
        // no pin code/disconnected: [cannot open device with path IOService]
        // no eth open: [Ledger device: Incorrect length]
        // eth browser support set to yes: [Invalid channel]
        // denied tx confirmation by user: [Ledger device: Condition of use not satisfied (denied by the user?)]
      });
    });
  });

  it('#initWalletsBalances should trigger loadWalletBalances for all the wallets in the list', () => {
    const walletList = [
      { name: '1', address: '0x1' },
      { name: '2', address: '0x2' },
    ];
    return expectSaga(walletHoc)
      .provide({
        select() {
          return walletList;
        },
      })
      .put(loadWalletBalances(`${walletList[0].address}`))
      .put(loadWalletBalances(`${walletList[1].address}`))
      .dispatch({ type: LOAD_WALLETS_SUCCESS })
      .run({ silenceTimeout: true });
  });

  xit('balance should be updated when new balance arrived', () => {
    const storeState = {
      walletHoc: {
        wallets: [{
          name: 't1',
          address: '0x00',
          encrypted: '{"address": "686353066E9873F6aC1b7D5dE9536099Cb41f321"}',
          balances: [
                { symbol: 'ETH', balance: '1' },
                { symbol: 'SII', balance: '2' },
          ],
        }],
      },
    };
    const newBalance = '3';
    return expectSaga(walletHoc)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call() {
          return eventChannel((emitter) => {
            setTimeout(() => {
              emitter({ newBalance: utils.bigNumberify(3) });
            }, 100);
            return () => {};
          });
        },
      })
      .dispatch(listenBalancesAction('0x00'))
      .run({ silenceTimeout: true })
      .then((result) => {
        const walletHocState = result.storeState.get('walletHoc');
        expect(
          walletHocState
            .getIn(['wallets', findWalletIndex(walletHocState, '0x00'), 'balances'])
            .find((bal) => bal.get('symbol') === 'ETH')
            .get('balance')
        ).toEqual(newBalance);
      });
  });

  describe('transfer', () => {
    const key = '0xf2249b753523f2f7c79a07c1b7557763af0606fb503d935734617bb7abaf06db';
    const toAddress = '0xbfdc0c8e54af5719872a2edef8e65c9f4a3eae88';
    const token = 'ETH';
    const decrypted = new Wallet(key);
    const walletName = 'wallet name';
    const wallet = { encrypted: { privateKey: '123' }, decrypted, name: walletName };
    const lockedWallet = { encrypted: { privateKey: '123' }, name: walletName };
    const amount = 0.0001;
    const gasPrice = 30000;
    const gasLimit = 21000;
    const transaction = { hash: '' };
    it('should trigger SHOW_DECRYPT_WALLET_MODAL action when the wallet is not decrypted yet', () => expectSaga(transfer, { wallet: lockedWallet })
        .put(showDecryptWalletModal(walletName))
        .put(transferError(new Error('Wallet is encrypted')))
        .run());
    xit('should trigger transferSuccess action', () => expectSaga(transfer, { wallet, token, toAddress, amount, gasPrice, gasLimit })
        .provide({
          call(effect) {
            expect(effect.args[0]).toEqual(toAddress);
            expect(effect.args[1]).toEqual(utils.parseEther(amount.toString()));
            expect(effect.args[2]).toEqual({ gasPrice, gasLimit });
            return transaction;
          },
        })
        .put(transferSuccess(transaction))
        .run());
    xit('should trigger transferError action', () => {
      const error = new Error();
      return expectSaga(transfer, { wallet, token, toAddress, amount, gasPrice, gasLimit })
        .provide({
          call() {
            throw error;
          },
        })
        .put(transferError(error))
        .run({ silenceTimeout: true });
    });
  });
});

describe('root Saga', () => {
  const walletHocSaga = walletHoc();

  it('should start task to watch for CREATE_WALLET_FROM_MNEMONIC action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_WALLET_FROM_MNEMONIC, createWalletFromMnemonic));
  });

  it('should start task to watch for DECRYPT_WALLET action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(DECRYPT_WALLET, decryptWallet));
  });

  it('should start task to watch for LOAD_WALLETS_SUCCESS action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances));
  });

  it('should start task to watch for LOAD_WALLET_BALANCES action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga));
  });

  it('should start task to watch for FETCH_LEDGER_ADDRESSES action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeLatest(FETCH_LEDGER_ADDRESSES, fetchLedgerAddresses));
  });

  it('should start task to watch for TRANSFER action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(TRANSFER, transfer));
  });

  it('should start task to watch for TRANSFER_ETHER action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(TRANSFER_ETHER, transferEther));
  });

  it('should start task to watch for TRANSFER_ERC20 action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(TRANSFER_ERC20, transferERC20));
  });

  it('should start task to watch for TRANSFER_SUCCESS action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(TRANSFER_SUCCESS, waitTransactionHash));
  });

  it('should wait for the CREATE_WALLET_FROM_PRIVATE_KEY action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey));
  });

  it('should wait for the CREATE_WALLET_SUCCESS action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated));
  });

  it('should wait for the LISTEN_TOKEN_BALANCES action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LISTEN_TOKEN_BALANCES, listenBalances));
  });

  it('should wait for the INIT_LEDGER action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(INIT_LEDGER, initLedger));
  });
});
