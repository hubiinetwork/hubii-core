/**
 * WalletHoc sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeEvery, put, fork } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import BigNumber from 'bignumber.js';

import { requestWalletAPI, requestHardwareWalletAPI } from 'utils/request';
import { getTransaction } from 'utils/wallet';
import { Wallet, utils } from 'ethers';
import walletHocReducer, { initialState } from 'containers/WalletHOC/reducer';
import { fromJS } from 'immutable';
import { CHANGE_NETWORK } from 'containers/App/constants';
import { notify } from 'containers/App/actions';
import {
  appMock,
  currentNetworkMock,
} from 'containers/App/tests/mocks/selectors';

import {
  privateKeyMock,
  encryptedMock,
  addressMock,
  privateKeyNoPrefixMock,
  transferEthActionParamsMock,
  transferErc20ActionParamsMock,
  softwareSignedTransactionMock,
  confirmedTransactionMock,
  lnsSignedTxMock,
  lnsExpectedSignedTxHex,
} from '../../../mocks/wallet';

import {
  supportedTokensMock,
  decryptedSoftwareWallet1Mock,
  lnsWalletMock,
  trezorWalletMock,
} from './mocks';

import {
  walletsMock,
  pricesLoadedMock,
  supportedAssetsLoadedMock,
  transactionsMock,
  blockHeightLoadedMock,
  balancesMock,
} from './mocks/selectors';

import walletHoc, {
  createWalletFromMnemonic,
  createWalletFromPrivateKey,
  decryptWallet,
  loadWalletBalancesSaga,
  transfer,
  transferERC20,
  transferEther,
  hookNewWalletCreated,
  loadSupportedTokens as loadSupportedTokensSaga,
  loadPrices as loadPricesSaga,
  sendTransactionForHardwareWallet,
  generateERC20Transaction,
  loadTransactions,
  loadBlockHeight,
  signPersonalMessage,
  networkApiOrcestrator,
} from '../saga';

import { tryCreateEthTransportActivity } from '../HardwareWallets/ledger/saga';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  DECRYPT_WALLET,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  LOAD_WALLET_BALANCES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  LEDGER_ERROR,
  CREATE_WALLET_SUCCESS,
  INIT_API_CALLS,
  ADD_NEW_WALLET,
} from '../constants';

import {
  createWalletSuccess,
  createWalletFailed,
  decryptWalletSuccess,
  decryptWalletFailed,
  showDecryptWalletModal,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPricesSuccess,
  loadPricesError,
  transferSuccess,
  transferError,
  transfer as transferAction,
  addNewWallet as addNewWalletAction,
  loadTransactionsSuccess,
  loadTransactionsError,
  loadBlockHeightSuccess,
  loadBlockHeightError,
} from '../actions';

const withReducer = (state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action));

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
    const state = fromJS({ walletHoc: initialState });
    const newWallet = walletsMock.get(0).toJS();
    return expectSaga(hookNewWalletCreated, { newWallet })
      .withReducer(withReducer, state)
      .put(addNewWalletAction(newWallet))
      .run({ silenceTimeout: true })
      .then((result) => {
        const wallets = result.storeState.getIn(['walletHoc', 'wallets']);
        expect(wallets.count()).toEqual(1);
        expect(wallets.get(0)).toEqual(fromJS(newWallet));
        expect(wallets.get(0)).toEqual(fromJS(newWallet));
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
      .withReducer(withReducer, fromJS(storeState))
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
      .withReducer(withReducer, fromJS(storeState))
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

  it('should dispatch notify action', () => {
    const decryptWalletGenerator = decryptWallet({ address, encryptedWallet, password });
    decryptWalletGenerator.next();
    const putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(putDescriptor).toEqual(put(notify('info', 'Unlocking wallet...')));
  });

  it('should dispatch the decryptWalletSuccess, notify action, and run the callback function if there is one, if successful', () => {
    const decryptWalletGenerator = decryptWallet({ address, encryptedWallet, password });
    decryptWalletGenerator.next();
    decryptWalletGenerator.next();
    decryptWalletGenerator.next();
    let putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(JSON.stringify(putDescriptor)).toEqual(JSON.stringify(put(decryptWalletSuccess(address, decryptedWallet))));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('success', 'Wallet unlocked!')));
    decryptWalletGenerator.next();
  });

  it('should dispatch decryptWalletFailed and notify action if address is undefined', () => {
    const decryptWalletGenerator = decryptWallet({ encryptedWallet, password });
    decryptWalletGenerator.next();
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
    decryptWalletGenerator.next();
    const error = new Error('some error occured');
    let putDescriptor = decryptWalletGenerator.next(error).value;
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('error', `Failed to unlock wallet: ${error}`)));
  });
});

describe('network API calls', () => {
  describe('network api orcentrator', () => {
    const wallets = walletsMock;
    const mockTask = createMockTask();
    it('should fork all required sagas, cancelling and restarting on CHANGE_NETWORK', () => {
      const saga = testSaga(networkApiOrcestrator);
      const allSagas = [
        ...wallets.map((wallet) => fork(loadWalletBalancesSaga, { address: wallet.get('address') }, currentNetworkMock.walletApiEndpoint)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, currentNetworkMock.walletApiEndpoint)),
        fork(loadSupportedTokensSaga, currentNetworkMock.walletApiEndpoint),
        fork(loadBlockHeight, currentNetworkMock.provider),
        fork(loadPricesSaga, currentNetworkMock.walletApiEndpoint),
      ];
      saga
        .next() // network selector
        .next(currentNetworkMock) // wallets selector
        .next(wallets).all(allSagas)
        .next([mockTask]).take([CHANGE_NETWORK, ADD_NEW_WALLET])
        .next().cancel(mockTask)
        .next() // network selector
        .next(currentNetworkMock) // wallets selector
        .next(wallets).all(allSagas);
    });
  });


  describe('supported tokens', () => {
    const requestPath = 'ethereum/supported-tokens';
    it('should load supported tokens', () => {
      const tokens = supportedTokensMock;
      const assets = supportedAssetsLoadedMock;

      return expectSaga(loadSupportedTokensSaga)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], requestPath);
            return tokens;
          },
        })
        .put(loadSupportedTokensSuccess(tokens))
        .run({ silenceTimeout: true })
        .then((result) => {
          const supportedAssets = result.storeState.getIn(['walletHoc', 'supportedAssets']);
          expect(supportedAssets.get('loading')).toEqual(false);
          expect(supportedAssets.get('error')).toEqual(null);
          expect(supportedAssets).toEqual(fromJS(assets));
        });
    });
    it('should handle request error', () => {
      const error = new Error();
      return expectSaga(loadSupportedTokensSaga)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], requestPath);
            throw error;
          },
        })
        .put(loadSupportedTokensError(error))
        .run({ silenceTimeout: true });
    });
    it('should correctly drop exising call and stop when cancelled', () => {
      const saga = testSaga(loadSupportedTokensSaga, currentNetworkMock.walletApiEndpoint);
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next().finish()
        .next().isDone();
    });
  });
  describe('prices', () => {
    it('should load prices when not exist in the store', () => {
      const response = [
        {
          currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC322',
          eth: 1,
          btc: 1,
          usd: 1,
        },
        {
          currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC323',
          eth: 1,
          btc: 1,
          usd: 1,
        },
      ];
      return expectSaga(loadPricesSaga)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], 'ethereum/prices');
            return response;
          },
        })
        .put(loadPricesSuccess(response))
        .run({ silenceTimeout: true });
    });
    it('should handle request error', () => {
      const error = new Error();
      return expectSaga(loadPricesSaga)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], 'ethereum/prices');
            throw error;
          },
        })
        .put(loadPricesError(error))
        .run({ silenceTimeout: true });
    });
  });

  describe('load transactions', () => {
    const address = '0x00';
    const requestPath = `ethereum/wallets/${address}/transactions`;
    let saga;
    beforeEach(() => {
      saga = testSaga(loadTransactions, { address }, currentNetworkMock.walletApiEndpoint);
    });
    it('should correctly handle success scenario', () => {
      const response = ['1', '2'];
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next(response).put(loadTransactionsSuccess('0x00', response))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly handle failed API call', () => {
      const e = new Error('error');
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .throw(e).put(loadTransactionsError(address, e))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly drop exising call and stop when cancelled', () => {
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next().finish()
        .next().isDone();
    });
  });

  describe('load balances', () => {
    const address = '0x00';
    const requestPath = `ethereum/wallets/${address}/balances`;
    let saga;
    beforeEach(() => {
      saga = testSaga(loadWalletBalancesSaga, { address }, currentNetworkMock.walletApiEndpoint);
    });
    it('should correctly handle success scenario', () => {
      const response = balancesMock.get(0);
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next(response).put(loadWalletBalancesSuccess('0x00', response))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly not poll when noPoll true', () => {
      saga = testSaga(loadWalletBalancesSaga, { address, noPoll: true }, currentNetworkMock.walletApiEndpoint);
      const response = balancesMock.get(0);
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next(response).put(loadWalletBalancesSuccess('0x00', response))
        .next() // delay
        .next().isDone();
    });

    it('should correctly handle failed API call', () => {
      const e = new Error('error');
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .throw(e).put(loadWalletBalancesError(address, e))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly drop exising call and stop when cancelled', () => {
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next().finish()
        .next().isDone();
    });
  });

  describe('load block height', () => {
    const height = '50';
    let saga;
    beforeEach(() => {
      saga = testSaga(loadBlockHeight, currentNetworkMock.provider);
    });
    it('should correctly handle success scenario', () => {
      saga
        .next() // eth provider
        .next(height).put(loadBlockHeightSuccess(height))
        .next() // delay
        .next() // eth provider
        .next(height).put(loadBlockHeightSuccess(height));
    });

    it('should correctly handle err scenario', () => {
      const e = new Error('some err');
      saga
        .next() // eth provider
        .throw(e).put(loadBlockHeightError(e))
        .next() // delay
        .next() // eth provider
        .next(height).put(loadBlockHeightSuccess(height));
    });

    it('should correctly drop existing call and stop when cancelled', () => {
      const e = new Error(e);
      saga
        .next() // eth provider
        .next().finish()
        .next().isDone();
    });
  });

  it('sign transaction for eth payment', () => {
    // create txn hash
    // should save pending txn hash in store and localstorage
    // listen for confirmation
    // update pending txn in store
    const storeState = {
      app: appMock,
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
        transactions: transactionsMock,
        pendingTransactions: [],
        supportedAssets: { loading: true },
      },
    };
    // const timestamp = new Date().getTime();
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
      .withReducer(withReducer, fromJS(storeState))
      .dispatch(transferAction(transferEthActionParamsMock))
      .put(transferSuccess(signedTransaction, 'ETH'))// send signed transaction
      .run({ silenceTimeout: true });
  });

  it('sign transaction for erc20 payment', () => {
    // create txn hash
    // should save pending txn hash in store and localstorage
    // listen for confirmation
    // update pending txn in store
    const storeState = {
      app: appMock,
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
        transactions: transactionsMock,
        supportedAssets: { loading: true },
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
      .withReducer(withReducer, fromJS(storeState))
      .dispatch(transferAction(transferErc20ActionParamsMock))
      .put(transferSuccess(signedTransaction, 'BOKKY'))// send signed transaction
      .run({ silenceTimeout: true });
  });

  describe('payment transfer', () => {
    describe('software wallet', () => {
      it('sign transaction for eth payment', () => {
        // create txn hash
        // should save pending txn hash in store and localstorage
        // listen for confirmation
        // update pending txn in store
        let storeState = fromJS({
          app: appMock,
          walletHoc: {
            app: appMock,
            wallets: [{
              name: 't1',
              type: 'software',
              address: '0xabcd',
              encrypted: '{"address": "abcd"}',
            }],
            currentWallet: {
              name: 't1',
              address: '0xabcd',
            },
            balances: balancesMock,
            prices: pricesLoadedMock,
            supportedAssets: supportedAssetsLoadedMock,
            pendingTransactions: [],
            transactions: transactionsMock,
            blockHeight: blockHeightLoadedMock,
          },
        });
        storeState = storeState.setIn(['walletHoc', 'wallets', 0, 'decrypted'], {
          privateKey: '0x40c2ebcaf1c719f746bc57feb85c56b6143c906d849adb30d62990c4454b2f15',
        });
        let called = 0;
        return expectSaga(walletHoc)
          .provide({
            call(effect, next) {
              called += 1;
              if (called === 1) {
                return softwareSignedTransactionMock;
              }
              if (called === 2) {
                return confirmedTransactionMock;
              }
              return next();
            },
          })
          .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
          .dispatch(transferAction(transferEthActionParamsMock))
          .put(transferSuccess(softwareSignedTransactionMock, 'ETH'))// send signed transaction
          .run({ silenceTimeout: true });
      });
      it('sign transaction for erc20 payment', () => {
        // create txn hash
        // should save pending txn hash in store and localstorage
        // listen for confirmation
        // update pending txn in store
        const storeState = {
          app: appMock,
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
            transactions: transactionsMock,
            pendingTransactions: [],
            supportedAssets: { loading: true },
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
        // const formatedTransaction = {
        //   timestamp: new Date().getTime(),
        //   token: 'BOKKY',
        //   from: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
        //   to: '0x994c3de8cc5bc781183205a3dd6e175be1e6f14a',
        //   hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
        //   value: 0.0001,
        //   input: signedTransaction.data,
        //   success: true,
        //   original: confirmedTransaction,
        // };
        const params = {
          token: 'BOKKY',
          toAddress: '0x994c3de8cc5bc781183205a3dd6e175be1e6f14a',
          amount: new BigNumber(10238918899999),
          gasPrice: new BigNumber(3000000),
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
          .run({ silenceTimeout: true });
      });
      it('#generateERC20Transaction should generate transaction object using etherjs contract', async () => {
        const nonce = 1;
        const gas = {
          gasPrice: 30000000,
          gasLimit: 2100000,
        };
        const amount = 0.000001;
        const expectedTx = {
          ...gas,
          nonce,
          to: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
          data: '0xa9059cbb000000000000000000000000bfdc0c8e54af5719872a2edef8e65c9f4a3eae88000000000000000000000000000000000000000000000000000000e8d4a51000',
        };
        const options = {
          ...gas,
          nonce, // override the nonce so etherjs wont call #getTransactionCount for testing
        };
        const tx = await generateERC20Transaction({
          contractAddress: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
          walletAddress: '0xe1dddbd012f6a9f3f0a346a2b418aecd03b058e7',
          toAddress: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
          amount: utils.parseEther(amount.toString()),
          provider: currentNetworkMock.provider,
        }, options);
        expect(tx).toEqual(expectedTx);
      });
      it('transfer erc20 should pass params correctly to sendTransactionForHardwareWallet', () => {
        const storeState = {
          app: appMock,
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
              descriptor: 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC1@14/XHC1@14000000/PRT2@14200000/Nano S@14200000/Nano S@0/IOUSBHostHIDDevice@14200000,0',
            },
            supportedAssets: { loading: true },
            blockHeight: blockHeightLoadedMock,
          },
        };
        const params = {};
        const tx = {
          gasPrice: 30000000,
          gasLimit: 2100000,
          to: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
          data: '0xa9059cbb000000000000000000000000bfdc0c8e54af5719872a2edef8e65c9f4a3eae88000000000000000000000000000000000000000000000000000000e8d4a51000',
          nonce: 39,
        };
        const sentTx = { value: 1, data: '0xa9059cbb000000000000000000000000994c3de8cc5bc781183205a3dd6e175be1e6f14a00000000000000000000000000000000000000000000000000005af3107a4000' };
        return expectSaga(transferERC20, params)
          .provide({
            call(effect, next) {
              if (effect.fn === generateERC20Transaction) {
                return tx;
              }
              if (effect.fn === sendTransactionForHardwareWallet) {
                expect(effect.args[0].toAddress).toEqual(tx.to);
                expect(effect.args[0].amount).toEqual(tx.value);
                return sentTx;
              }
              return next();
            },
          })
          .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
          .put.actionType(transferSuccess(sentTx).type)// send signed transaction
          .run({ silenceTimeout: true });
      });
    });
    describe('hardware wallet: ledger', () => {
      it('#sendTransactionForHardwareWallet should sign tx and output a hex correctly', () => {
        const storeState = fromJS({
          app: appMock,
          walletHoc: {
            balances: balancesMock,
            prices: pricesLoadedMock,
            supportedAssets: supportedAssetsLoadedMock,
            transactions: transactionsMock,
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
            ledgerNanoSInfo: {
              descriptor: 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC@14/XHC@14000000/HS09@14900000/Nano S@14900000/Nano S@0/IOUSBHostHIDDevice@14900000,0',
            },
            blockHeight: blockHeightLoadedMock,
          },
        });
        const nonce = 16;
        let signedTxHex;
        const params = {
          ...transferErc20ActionParamsMock,
          gasPrice: utils.parseEther(transferErc20ActionParamsMock.gasPrice.toString()),
          amount: utils.parseEther(transferErc20ActionParamsMock.amount.toString()),
        };
        return expectSaga(sendTransactionForHardwareWallet, params)
          .provide({
            call(effect) {
              if (effect.fn === tryCreateEthTransportActivity) {
                return lnsSignedTxMock;
              }
              if (effect.args.includes('pending')) {
                return nonce;
              }
              if (effect.args[0].startsWith('0xf8')) {
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
            expect(signedTxHex).toEqual(lnsExpectedSignedTxHex);
          });
      });
    });
    describe('hardware wallet: trezor', () => {
      it('#sendTransactionForHardwareWallet should sign tx and output a hex correctly', () => {
        const address = 'e1dddbd012f6a9f3f0a346a2b418aecd03b058e7';
        const storeState = fromJS({
          app: appMock,
          walletHoc: {
            balances: balancesMock,
            prices: pricesLoadedMock,
            supportedAssets: supportedAssetsLoadedMock,
            wallets: [{
              name: 't1',
              type: 'trezor',
              address: `0x${address}`,
              derivationPath: 'm/44\'/60\'/0\'/0',
            }],
            currentWallet: {
              name: 't1',
              address: `0x${address}`,
            },
            transactions: transactionsMock,
            pendingTransactions: [],
            confirmedTransactions: [],
            trezorInfo: {
              id: 'test',
            },
            blockHeight: blockHeightLoadedMock,
          },
        });
        const nonce = 8;
        // const rawTx = [
        //   '0x08',
        //   '0x7530',
        //   '0x5208',
        //   '0xbfdc0c8e54af5719872a2edef8e65c9f4a3eae88',
        //   '0x2742',
        //   '0x',
        //   '0x03',
        //   '0x',
        //   '0x',
        // ];
        const signedTx = {
          r: '0f7bfadeca8f4a9c022db1ce73b255ca0d3e293367b47231f161f20b91966095',
          s: '7fb01cb8c9e2f7fdd385e213d653a24436bea63c572c6f8993e4880a66457bbf',
          v: 42,
        };
        const expectedSignedTxHex = '0xf8630882753082520894bfdc0c8e54af5719872a2edef8e65c9f4a3eae88822742802aa00f7bfadeca8f4a9c022db1ce73b255ca0d3e293367b47231f161f20b91966095a07fb01cb8c9e2f7fdd385e213d653a24436bea63c572c6f8993e4880a66457bbf';
        let signedTxHex;
        const params = {
          ...transferErc20ActionParamsMock,
          gasPrice: utils.bigNumberify(transferErc20ActionParamsMock.gasPrice.toString()),
          amount: utils.bigNumberify(transferErc20ActionParamsMock.amount.toString()),
        };
        return expectSaga(sendTransactionForHardwareWallet, params)
          .provide({
            call(effect) {
              if (effect.fn === requestHardwareWalletAPI && effect.args[0] === 'getaddress') {
                return { address };
              }
              if (effect.fn === requestHardwareWalletAPI && effect.args[0] === 'signtx') {
                return signedTx;
              }
              if (effect.args.includes('pending')) {
                return nonce;
              }
              if (effect.args[0].startsWith('0xf8')) {
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
        .put(showDecryptWalletModal(transferAction({ wallet: lockedWallet })))
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

  describe('#signPersonalMessage', () => {
    const message = '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c';
    const signedMessage = '0xb9540a3867e40c2a9ad8ae684956d285ad147ce34dfdd6dee91928d7caf7008d051c4bf7557ddeaf243e2a34ef4bd9958dd87ee3d31d644272c066d6b9f423721c';

    it('should run the function relevant to a software wallet', () => {
      const wallet = decryptedSoftwareWallet1Mock.toJS();
      const expectedResult = {
        done: true,
        value: signedMessage,
      };
      const putDescriptor = signPersonalMessage({ message, wallet }).next();
      expect(putDescriptor).toEqual(expectedResult);
    });
    it('should run the function relevant to a lns', async () => {
      const storeState = fromJS({
        walletHoc: {
          balances: balancesMock,
          prices: pricesLoadedMock,
          supportedAssets: supportedAssetsLoadedMock,
          transactions: transactionsMock,
          wallets: [lnsWalletMock.toJS()],
          currentWallet: {
            name: lnsWalletMock.toJS().name,
            address: lnsWalletMock.toJS().address,
          },
          ledgerNanoSInfo: {
            descriptor: 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC@14/XHC@14000000/HS09@14900000/Nano S@14900000/Nano S@0/IOUSBHostHIDDevice@14900000,0',
          },
          blockHeight: blockHeightLoadedMock,
        },
      });
      const { returnValue } = await expectSaga(signPersonalMessage, { wallet: lnsWalletMock.toJS(), message })
        .provide({
          call(effect) {
            if (effect.fn === tryCreateEthTransportActivity) {
              return signedMessage;
            }
            return {};
          },
        })
        .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
        .run({ silenceTimeout: true });
      expect(returnValue).toEqual(signedMessage);
    });

    it('should run the function relevant to a trezor', async () => {
      const address = trezorWalletMock.get('address');
      const expectedReturnAddress = address.slice(2);

      const storeState = fromJS({
        walletHoc: fromJS({})
          .set('balances', balancesMock)
          .set('prices', pricesLoadedMock)
          .set('wallets', [trezorWalletMock.toJS()])
          .set('currentWallet', {
            name: trezorWalletMock.toJS().name,
            address,
          })
          .set('transactions', transactionsMock)
          .set('pendingTransactions', [])
          .set('confirmedTransactions', [])
          .set('trezorInfo', { id: transactionsMock.toJS().deviceId }).toJS(),
      });
      const { returnValue } = await expectSaga(signPersonalMessage, { wallet: trezorWalletMock.toJS(), message })
        .provide({
          call(effect) {
            if (effect.fn === requestHardwareWalletAPI && effect.args[0] === 'signpersonalmessage') {
              return signedMessage;
            }
            if (effect.fn === requestHardwareWalletAPI && effect.args[0] === 'getaddress') {
              return { address: expectedReturnAddress };
            }
            return {};
          },
        })
        .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
        .run({ silenceTimeout: true });
      expect(returnValue).toEqual(signedMessage);
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

  it('should start task to watch for INIT_API_CALLS action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(INIT_API_CALLS, networkApiOrcestrator));
  });

  it('should start task to watch for LOAD_WALLET_BALANCES action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga));
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

  it('should wait for the CREATE_WALLET_FROM_PRIVATE_KEY action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey));
  });

  it('should wait for the CREATE_WALLET_SUCCESS action', () => {
    const takeDescriptor = walletHocSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated));
  });
});
