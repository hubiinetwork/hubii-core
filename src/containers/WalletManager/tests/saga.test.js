/**
 * WalletManager sagas
 */

import { Wallet } from 'ethers';

/* eslint-disable redux-saga/yield-effects */
import { takeEvery, call, put } from 'redux-saga/effects';
import walletManager, { createWallet, decryptWallet, progressCallback } from '../saga';
import { CREATE_NEW_WALLET, DECRYPT_WALLET } from '../constants';
import {
  createNewWalletSuccess,
  createNewWalletFailed,
} from '../actions';

describe('createWallet saga', () => {
  const name = 'wallet8';
  let mnemonic = 'movie viable write punch mango arrest cotton page grass dad document practice';
  let derivationPath = 'm/44\'/60\'/0\'/0/0';
  const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
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
    const callDescriptor = createWalletGenerator.next().value;
    expect(callDescriptor).toMatchSnapshot();
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

  it('should dispatch the createNewWalletFailed action if no password', () => {
    mnemonic = 'rubbish';
    const createWalletGenerator = createWallet({ name, mnemonic, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid mnemonic');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should throw error if name is undefined', () => {
    const createWalletGenerator = createWallet({ mnemonic, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should throw error if mnemonic is undefined', () => {
    const createWalletGenerator = createWallet({ name, derivationPath, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should throw error if derivationPath is undefined', () => {
    const createWalletGenerator = createWallet({ mnemonic, name, password });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });

  it('should throw error if password is undefined', () => {
    const createWalletGenerator = createWallet({ mnemonic, name, derivationPath });
    const putDescriptor = createWalletGenerator.next().value;
    const error = new Error('invalid param');
    expect(putDescriptor).toEqual(put(createNewWalletFailed(error)));
  });
});

// function* progressCallback(percent) {
//   yield put(updateProgress(percent));
// }

describe('root Saga', () => {
  const walletManagerSaga = walletManager();

  it('should start task to watch for CREATE_NEW_WALLET action', () => {
    const takeDescriptor = walletManagerSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_NEW_WALLET, createWallet));
  });

  // it('should start task to watch for DECRYPT_WALLET action', () => {
  //   const takeDescriptor = walletManagerSaga.next().value;
  //   expect(takeDescriptor).toEqual(take(DECRYPT_WALLET, decryptWallet));
  // });
});
