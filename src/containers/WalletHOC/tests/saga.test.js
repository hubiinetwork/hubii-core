/**
 * WalletManager sagas
 */

/* eslint-disable redux-saga/yield-effects */
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { takeEvery, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import request from 'utils/request';
import { Wallet, utils } from 'ethers';
import walletManagerReducer from 'containers/WalletHOC/reducer';
import { fromJS } from 'immutable';
import { notify } from 'containers/App/actions';

import walletManager, {
  createWallet,
  decryptWallet,
  loadWalletBalancesSaga,
  initWalletsBalances,
  transfer,
  pollLedger,
} from '../saga';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  LOAD_WALLET_BALANCES,
  LOAD_WALLETS_SUCCESS,
  POLL_LEDGER,
} from '../constants';

import {
  createNewWalletSuccess,
  createNewWalletFailed,
  decryptWalletSuccess,
  decryptWalletFailed,
  showDecryptWalletModal,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  ledgerDetected,
  ledgerError,
  transferSuccess,
  transferError,
  transactionConfirmed as transactionConfirmedAction,
  transfer as transferAction,
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

describe('pollLedger Saga', () => {
  it('should dispatch the ledgerDetected action if successful', () => {
    const transport = new TransportNodeHid();
    const address = { publicKey: '4321' };
    const id = '4321';
    const pollLedgerGenerator = pollLedger();
    pollLedgerGenerator.next();
    pollLedgerGenerator.next(transport);
    const putDescriptor = pollLedgerGenerator.next(address).value;
    expect(putDescriptor).toEqual(put(ledgerDetected(id)));
  });

  it('should dispatch the ledgerError action on error', () => {
    const error = new Error('some error');
    const pollLedgerGenerator = pollLedger();
    pollLedgerGenerator.next();
    const putDescriptor = pollLedgerGenerator.next(error).value;
    expect(putDescriptor).toEqual(put(ledgerError(error)));
  });
});

describe('decryptWallet saga', () => {
  const encryptedWallet = '{"address":"a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","id":"f17128a6-c5f0-4af0-a168-67cf6d3d8552","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6167c13fe3cd195b4ce9312a9f9399ce"},"ciphertext":"2434b52afa29851edea2acb7f33dd854fc7e7b036ad6a2c3614f3d61ef0e19ce","kdf":"scrypt","kdfparams":{"salt":"b0662c8968389207137be9f346fb1cfba604f9d214e95012881025b7ebc5b9da","n":131072,"dklen":32,"p":1,"r":8},"mac":"256bd09baf3341e9f7df675b8a8cc551b86dfd0dfdf1aa8df2596882f3751496"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-06-19T04-19-27.0Z--a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","mnemonicCounter":"20da552ff9e584fc89194af19543a096","mnemonicCiphertext":"ff46b728607532d5be86a0647b169a18","version":"0.1"}}';
  const password = 'dogs';
  const decryptedWallet = { privateKey: '0x409300caf64bdf96a92d7f99547a5d67702fbdd759bbea4ca19b11a21d9c8528', defaultGasLimit: 1500000, address: '0xA0EcCD7605Bb117DD2A4Cd55979C720Cf00F7fa4', mnemonic: 'movie viable write punch mango arrest cotton page grass dad document practice', path: "m/44'/60'/0'/0/0" };

  it('should first dispatch notify action', () => {
    const decryptWalletGenerator = decryptWallet({ name, encryptedWallet, password });
    const putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(putDescriptor).toEqual(put(notify('info', `Decrypting wallet ${name}`)));
  });

  it('should dispatch the decryptWalletSuccess and notify action if successful', () => {
    const decryptWalletGenerator = decryptWallet({ name, encryptedWallet, password });
    decryptWalletGenerator.next();
    decryptWalletGenerator.next();
    let putDescriptor = decryptWalletGenerator.next(decryptedWallet).value;
    expect(JSON.stringify(putDescriptor)).toEqual(JSON.stringify(put(decryptWalletSuccess(name, decryptedWallet))));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('success', `Successfully decrypted ${name}`)));
  });

  it('should dispatch decryptWalletFailed and notify action if name is undefined', () => {
    const decryptWalletGenerator = decryptWallet({ encryptedWallet, password });
    decryptWalletGenerator.next();
    let putDescriptor = decryptWalletGenerator.next().value;
    const error = new Error('name undefined');
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('error', `Failed to decrypt wallet: ${error}`)));
  });

  it('should dispatch the decryptWalletFailed and notify action if decryption fails', () => {
    const decryptWalletGenerator = decryptWallet({ name, encryptedWallet, password });
    decryptWalletGenerator.next();
    decryptWalletGenerator.next();
    const error = new Error('some error occured');
    let putDescriptor = decryptWalletGenerator.next(error).value;
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
    putDescriptor = decryptWalletGenerator.next().value;
    expect(putDescriptor).toEqual(put(notify('error', `Failed to decrypt wallet: ${error}`)));
  });
});

describe('load wallets saga', () => {
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
      .put(transferSuccess(signedTransaction, 'ETH'))// send signed transaction
      .put(transactionConfirmedAction(confirmedTransaction))// transaction confirmed in the network
      // .run({ silenceTimeout: true })
      .run({ silenceTimeout: true })
      .then((result) => {
        const walletManagerState = result.storeState.get('walletManager');
        expect(walletManagerState.getIn(['pendingTransactions']).count()).toEqual(0);
        expect(walletManagerState.getIn(['confirmedTransactions']).count()).toEqual(1);
        formatedTransaction.value = parseFloat(utils.formatEther(formatedTransaction.value));
        expect(walletManagerState.getIn(['confirmedTransactions']).get(0).toJS()).toEqual(formatedTransaction);
      });
  });

  it('sign transaction for erc20 payment', () => {
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
                privateKey: '0x40c2ebcaf1c719f746bc57feb85c56b6143c906d849adb30d62990c4454b2f15',
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
      wallet: { decrypted: {} },
      contractAddress: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
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
      .put(transferSuccess(signedTransaction, 'BOKKY'))// send signed transaction
      .put(transactionConfirmedAction(confirmedTransaction))// transaction confirmed in the network
      .run({ silenceTimeout: true })
      // .run(500000)
      .then((result) => {
        const walletManagerState = result.storeState.get('walletManager');
        expect(walletManagerState.getIn(['pendingTransactions']).count()).toEqual(0);
        expect(walletManagerState.getIn(['confirmedTransactions']).count()).toEqual(1);
        expect(walletManagerState.getIn(['confirmedTransactions']).get(0)).toEqual(fromJS(formatedTransaction));
      });
  });

  it('#initWalletsBalances should trigger loadWalletBalances for all the wallets in the list', () => {
    const walletList = [
      { name: '1', address: '0x1' },
      { name: '2', address: '0x2' },
    ];
    return expectSaga(walletManager)
      .provide({
        select() {
          return walletList;
        },
      })
      .put(loadWalletBalances(walletList[0].name, `${walletList[0].address}`))
      .put(loadWalletBalances(walletList[1].name, `${walletList[1].address}`))
      .dispatch({ type: LOAD_WALLETS_SUCCESS })
      .run({ silenceTimeout: true });
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

  it('should start task to watch for LOAD_WALLETS_SUCCESS action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances));
  });

  it('should start task to watch for LOAD_WALLET_BALANCES action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga));
  });

  it('should start task to watch for POLL_LEDGER action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(POLL_LEDGER, pollLedger));
  });
});
