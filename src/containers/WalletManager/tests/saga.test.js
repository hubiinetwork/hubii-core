/**
 * WalletManager sagas
 */

import { Wallet } from 'ethers';

/* eslint-disable redux-saga/yield-effects */
import { takeEvery, put } from 'redux-saga/effects';
import walletManager, { createWallet, decryptWallet, progressCallback } from '../saga';
import { CREATE_NEW_WALLET, DECRYPT_WALLET } from '../constants';
import {
  createNewWalletSuccess,
  createNewWalletFailed,
  decryptWalletSuccess,
  decryptWalletFailed,
  updateProgress,
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
    const callDescriptor = decryptWalletGenerator.next().value;
    expect(callDescriptor).toMatchSnapshot();
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
    const callDescriptor = decryptWalletGenerator.next().value;
    const error = new Error('some error occured');
    expect(callDescriptor).toMatchSnapshot();
    const putDescriptor = decryptWalletGenerator.next(error).value;
    expect(putDescriptor).toEqual(put(decryptWalletFailed(error)));
  });
});

describe('progressCallback', () => {
  it('should dispatch the updateProgress action on valid input', () => {
    const progress = 0.3423;
    const progressCallbackGenerator = progressCallback(progress);
    const putDescriptor = progressCallbackGenerator.next().value;
    expect(putDescriptor).toEqual(put(updateProgress(progress)));
  });

  it('should throw error on negative input', () => {
    const progress = -0.3423;
    expect(() => {
      const progressCallbackGenerator = progressCallback(progress);
      progressCallbackGenerator.next();
    }).toThrow();
  });

  it('should throw error on input > 1', () => {
    const progress = 1.3;
    expect(() => {
      const progressCallbackGenerator = progressCallback(progress);
      progressCallbackGenerator.next();
    }).toThrow();
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
});
