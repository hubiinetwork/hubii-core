/**
 * WalletManager sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeEvery, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';
import request from 'utils/request';
import { Wallet, utils } from 'ethers';
import walletManagerReducer from 'containers/WalletHOC/reducer';

import walletManager, {
  createWallet,
  decryptWallet,
  cacheNewWallet,
  loadWallets,
  loadWalletBalancesSaga,
  initWalletsBalances,
  transfer,
} from '../saga';
import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  CREATE_NEW_WALLET_SUCCESS,
  LOAD_WALLETS,
  LOAD_WALLET_BALANCES,
  LOAD_WALLETS_SUCCESS,
} from '../constants';
import {
  createNewWalletSuccess,
  createNewWalletFailed,
  decryptWalletSuccess,
  decryptWalletFailed,
  showDecryptWalletModal,
  loadWalletsSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  transfer as transferAction,
  transferSuccess,
  transferError,
  hideDecryptWalletModal,
  notify,
  decryptWallet as decryptWalletAction,
  transactionConfirmed as transactionConfirmedAction,
} from '../actions';

describe('createWallet saga', () => {
  let mnemonic = 'movie viable write punch mango arrest cotton page grass dad document practice';
  let derivationPath = 'm/44\'/60\'/0\'/0/0';
  const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
  const name = 'wallet8';
  let encryptedWallet;
  let password;
  beforeEach(() => {
    password = 'dogs';
    mnemonic = 'movie viable write punch mango arrest cotton page grass dad document practice';
    derivationPath = 'm/44\'/60\'/0\'/0/0';
    encryptedWallet = '{"address":"a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","id":"f17128a6-c5f0-4af0-a168-67cf6d3d8552","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6167c13fe3cd195b4ce9312a9f9399ce"},"ciphertext":"2434b52afa29851edea2acb7f33dd854fc7e7b036ad6a2c3614f3d61ef0e19ce","kdf":"scrypt","kdfparams":{"salt":"b0662c8968389207137be9f346fb1cfba604f9d214e95012881025b7ebc5b9da","n":131072,"dklen":32,"p":1,"r":8},"mac":"256bd09baf3341e9f7df675b8a8cc551b86dfd0dfdf1aa8df2596882f3751496"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-06-19T04-19-27.0Z--a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","mnemonicCounter":"20da552ff9e584fc89194af19543a096","mnemonicCiphertext":"ff46b728607532d5be86a0647b169a18","version":"0.1"}}';
  });

  it('should dispatch the createNewWalletSuccess action if successful', () => {
    const createWalletGenerator = createWallet({ name, mnemonic, derivationPath, password });
    createWalletGenerator.next();
    const putDescriptor = createWalletGenerator.next(encryptedWallet).value;
    expect(JSON.stringify(putDescriptor)).toEqual(JSON.stringify(put(createNewWalletSuccess(name, encryptedWallet, decryptedWallet))));
  });

  it('should dispatch the createNewWalletFailed action if bad mnemonic', () => {
    mnemonic = 'rubbish';
    const createWalletGenerator = createWallet({ name, mnemonic, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid mnemonic');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should dispatch the createNewWalletFailed action if bad derivationPath', () => {
    derivationPath = 'm/0.0';
    const createWalletGenerator = createWallet({ name, mnemonic, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invlaid path component - 0.0');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should dispatch the createNewWalletFailed action if invalid mnemonic password', () => {
    mnemonic = 'rubbish';
    const createWalletGenerator = createWallet({ name, mnemonic, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid mnemonic');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should dispatch createNewWalletFailed action if name is undefined', () => {
    const createWalletGenerator = createWallet({ mnemonic, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should dispatch createNewWalletFailed action if mnemonic is undefined', () => {
    const createWalletGenerator = createWallet({ name, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should dispatch createNewWalletFailed action if derivationPath is undefined', () => {
    const createWalletGenerator = createWallet({ mnemonic, name, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should dispatch createNewWalletFailed action if password is undefined', () => {
    const createWalletGenerator = createWallet({ mnemonic, name, derivationPath });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });
});

describe('decryptWallet saga', () => {
  const encryptedWallet = '{"address":"a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","id":"f17128a6-c5f0-4af0-a168-67cf6d3d8552","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6167c13fe3cd195b4ce9312a9f9399ce"},"ciphertext":"2434b52afa29851edea2acb7f33dd854fc7e7b036ad6a2c3614f3d61ef0e19ce","kdf":"scrypt","kdfparams":{"salt":"b0662c8968389207137be9f346fb1cfba604f9d214e95012881025b7ebc5b9da","n":131072,"dklen":32,"p":1,"r":8},"mac":"256bd09baf3341e9f7df675b8a8cc551b86dfd0dfdf1aa8df2596882f3751496"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-06-19T04-19-27.0Z--a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","mnemonicCounter":"20da552ff9e584fc89194af19543a096","mnemonicCiphertext":"ff46b728607532d5be86a0647b169a18","version":"0.1"}}';
  const password = 'dogs';
  const decryptedWallet = { privateKey: '0x409300caf64bdf96a92d7f99547a5d67702fbdd759bbea4ca19b11a21d9c8528', defaultGasLimit: 1500000, address: '0xA0EcCD7605Bb117DD2A4Cd55979C720Cf00F7fa4', mnemonic: 'movie viable write punch mango arrest cotton page grass dad document practice', path: "m/44'/60'/0'/0/0" };

  it('should dispatch the decryptWalletSuccess action if successful', () => {
    const decryptWalletGenerator = decryptWallet({ name, encryptedWallet, password });
    decryptWalletGenerator.next();
    const putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(JSON.stringify(putDescriptor)).toEqual(JSON.stringify(put(decryptWalletSuccess(name, decryptedWallet))));
  });

  it('should dispatch decryptWalletFailed action if name is undefined', () => {
    const decryptWalletGenerator = decryptWallet({ encryptedWallet, password });
    const putDescriptor = decryptWalletGenerator.next().value;
    const error = new Error('name undefined');
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
  });

  it('should dispatch the decryptWalletFailed action if decryption fails', () => {
    const decryptWalletGenerator = decryptWallet({ name, encryptedWallet, password });
    decryptWalletGenerator.next();
    const error = new Error('some error occured');
    const putDescriptor = decryptWalletGenerator.next(error).value;
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
  });
});

describe('load wallets saga', () => {
  let localStorageMock;
  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;
  });

  it('#cacheNewWallet with null value in localStorage', () => {
    const existingWallets = null;
    localStorage.getItem.mockReturnValueOnce(existingWallets);
    const walletName = 'test';
    const newWallet = { encrypted: '{"address": "abcd"}' };

    cacheNewWallet({ name: walletName, newWallet });

    const expectedWallets = { software: { test: { encrypted: newWallet.encrypted } }, hardware: {} };
    expect(localStorage.setItem).toBeCalledWith('wallets', JSON.stringify(expectedWallets));
  });

  it('#cacheNewWallet with valid json string in localStorage', () => {
    const existingWallets = { software: { test: {}, test2: {} }, hardware: {} };
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(existingWallets));
    const walletName = 'test';
    const newWallet = { encrypted: '{"address": "abcd"}' };

    cacheNewWallet({ name: walletName, newWallet });

    const expectedWallets = Object.assign({}, existingWallets);
    expectedWallets.software.test.encrypted = newWallet.encrypted;
    expect(localStorage.setItem).toBeCalledWith('wallets', JSON.stringify(expectedWallets));
  });

  it('#cacheNewWallet with invalid json string in localStorage', () => {
    localStorage.getItem.mockReturnValueOnce('invalid json string');
    const walletName = 'test';
    const newWallet = { encrypted: '{"address": "abcd"}' };

    cacheNewWallet({ name: walletName, newWallet });

    const expectedWallets = { software: { test: { encrypted: newWallet.encrypted } }, hardware: {} };
    expect(localStorage.setItem).toBeCalledWith('wallets', JSON.stringify(expectedWallets));
  });

  it('#loadWallets should load encrypted wallet and merge into wallets stored in session', () => {
    const storedWallets = { software: { test: {} }, hardware: {} };
    const sessionWallets = { software: { test2: {} }, hardware: {} };

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(storedWallets));

    const expectedWallets = { software: { test: {}, test2: {} }, hardware: {} };
    return expectSaga(loadWallets)
      .provide({
        select() {
          return fromJS(sessionWallets);
        },
      })
      .put(loadWalletsSuccess(expectedWallets))
      .run({ silenceTimeout: true });
  });

  it('#loadWallets should only override non-exist wallet states from cache', () => {
    const storedWallets = { software: { test: { encrypted: '1' } }, hardware: {} };
    const sessionWallets = { software: { test: { encrypted: '2' } }, hardware: {} };

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(storedWallets));

    return expectSaga(loadWallets)
      .provide({
        select() {
          return fromJS(sessionWallets);
        },
      })
      .put(loadWalletsSuccess(sessionWallets))
      .run({ silenceTimeout: true });
  });

  it('#loadWalletBalances should load balances and dispatch loadWalletBalancesSuccess', () => {
    const response = { tokens: [] };
    const walletName = 'test';
    const walletAddress = 'abcd';
    return expectSaga(loadWalletBalancesSaga, { name: walletName, walletAddress })
      .provide({
        call(effect) {
          expect(effect.fn).toBe(request);
          expect(effect.args[0], `ethereum/wallets/${walletAddress}/balance`);
          return response;
        },
      })
      .put(loadWalletBalancesSuccess(walletName, response))
      .run({ silenceTimeout: true });
  });

  it('#loadWalletBalances should dispatch loadWalletBalancesError when error throws in request', () => {
    const walletName = 'test';
    const walletAddress = 'abcd';
    const error = new Error();
    return expectSaga(loadWalletBalancesSaga, { name: walletName, walletAddress })
      .provide({
        call(effect) {
          expect(effect.fn).toBe(request);
          throw error;
        },
      })
      .put(loadWalletBalancesError(walletName, error))
      .run({ silenceTimeout: true });
  });

  it('sign transaction for eth payment', () => {
    // create txn hash
    // should save pending txn hash in store and localstorage
    // listen for confirmation
    // update pending txn in store
    const storeState = {
      walletManager: {
        wallets: {
          software: {
            t1: {
              encrypted: '{"address": "abcd"}',
              decrypted: {
                privateKey: '0xf2249b753523f2f7c79a07c1b7557763af0606fb503d935734617bb7abaf06db',
              },
            },
          },
        },
        currentWallet: {
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
    const params = {
      token: 'ETH',
      toAddress: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
      amount: 0.0001,
      gasPrice: 30000,
      gasLimit: 21000,
      wallet: { decrypted: {} },
    };
    let called = 0;
    return expectSaga(walletManager)
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
      .withReducer((state, action) => state.set('walletManager', walletManagerReducer(state.get('walletManager'), action)), fromJS(storeState))
      .dispatch(transferAction(params))
      .put(transferSuccess(signedTransaction))// send signed transaction
      .put(transactionConfirmedAction(confirmedTransaction))// transaction confirmed in the network
      // .run({ silenceTimeout: true })
      .run({ silenceTimeout: true })
      .then((result) => {
        const walletManagerState = result.storeState.get('walletManager');
        expect(walletManagerState.getIn(['pendingTransactions']).count()).toEqual(0);
        expect(walletManagerState.getIn(['confirmedTransactions']).count()).toEqual(1);
        expect(walletManagerState.getIn(['confirmedTransactions']).get(0)).toEqual(fromJS(confirmedTransaction));
      });
  });

  it('sign transaction for erc20 payment', () => {
    // create txn hash
    // should save pending txn hash in store
    // listen for confirmation
    // update pending txn in store
  });

  it('#initWalletsBalances should trigger loadWalletBalances for all the wallets in the list', () => {
    const walletList = [
      { name: '1', address: '1' },
      { name: '2', address: '2' },
    ];
    return expectSaga(walletManager)
      .provide({
        select() {
          return walletList;
        },
      })
      .put(loadWalletBalances(walletList[0].name, `0x${walletList[0].address}`))
      .put(loadWalletBalances(walletList[1].name, `0x${walletList[1].address}`))
      .dispatch({ type: LOAD_WALLETS_SUCCESS })
      .run({ silenceTimeout: true });
  });

  describe('UI notifications', () => {
    it('DECRYPT_WALLET_FAILURE', () => {
      const error = { message: 'error' };
      return expectSaga(walletManager)
      .put(notify(false, `Failed to decrypt wallet: ${error.message}`))
      .dispatch(decryptWalletFailed(error))
      .run({ silenceTimeout: true });
    });
    it('DECRYPT_WALLET_SUCCESS', () => {
      const name = 'name';
      return expectSaga(walletManager)
      .put(notify(true, `Successfully decrypted ${name}`))
      .put(hideDecryptWalletModal())
      .dispatch(decryptWalletSuccess(name))
      .run({ silenceTimeout: true });
    });
    it('DECRYPT_WALLET', () => {
      const name = 'w1';
      const encrypted = '';
      const password = '';
      return expectSaga(walletManager)
      .put(notify(true, `Decrypting wallet ${name}`))
      .dispatch(decryptWalletAction(name, encrypted, password))
      .run({ silenceTimeout: true });
    });
    it('TRANSFER', () => expectSaga(walletManager)
      .put(notify(true, 'Sending transaction'))
      .dispatch(transferAction({ wallet: { decrypted: {} }, amount: 1 }))
      .run({ silenceTimeout: true }));
    it('TRANSFER_SUCCESS', () => {
      const txnhash = 'abcd';
      return expectSaga(walletManager)
      .provide({
        call: () => {},
      })
      .put(notify(true, 'Transaction sent'))
      .dispatch(transferSuccess({ hash: txnhash }))
      .run({ silenceTimeout: true });
    });
    it('TRANSFER_ERROR', () => {
      const error = 'w1';
      return expectSaga(walletManager)
      .put(notify(false, `Failed to send transaction: ${error}`))
      .dispatch(transferError(error))
      .run({ silenceTimeout: true });
    });
  });

  describe('transfer', () => {
    const key = '0xf2249b753523f2f7c79a07c1b7557763af0606fb503d935734617bb7abaf06db';
    const toAddress = '0xbfdc0c8e54af5719872a2edef8e65c9f4a3eae88';
    const token = 'ETH';
    const decrypted = new Wallet(key);
    const walletName = 'wallet name';
    const wallet = { decrypted, name: walletName };
    const amount = 0.0001;
    const gasPrice = 30000;
    const gasLimit = 21000;
    const transaction = { hash: '' };
    it('should trigger SHOW_DECRYPT_WALLET_MODAL action when the wallet is not decrypted yet', () => expectSaga(transfer, { wallet: { name: walletName } })
        .put(showDecryptWalletModal(walletName))
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
  const walletManagerSaga = walletManager();

  it('should start task to watch for CREATE_NEW_WALLET action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_NEW_WALLET, createWallet));
  });

  it('should start task to watch for DECRYPT_WALLET action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(DECRYPT_WALLET, decryptWallet));
  });

  it('should start task to watch for CREATE_NEW_WALLET_SUCCESS action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_NEW_WALLET_SUCCESS, cacheNewWallet));
  });

  it('should start task to watch for LOAD_WALLETS action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLETS, loadWallets));
  });

  it('should start task to watch for LOAD_WALLETS_SUCCESS action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances));
  });

  it('should start task to watch for LOAD_WALLET_BALANCES action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga));
  });
});
