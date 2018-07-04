import { takeEvery, put, call, select } from 'redux-saga/effects';
import { Wallet, utils, providers } from 'ethers';

import { notify } from 'containers/App/actions';

import request from '../../utils/request';

import { makeSelectWalletList } from './selectors';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  TRANSFER,
} from './constants';

import {
  createNewWalletFailed,
  createNewWalletSuccess,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  showDecryptWalletModal,
  transferSuccess,
  transferError,
} from './actions';

// Creates a new software wallet
export function* createWallet({ name, mnemonic, derivationPath, password }) {
  try {
    if (!name || !derivationPath || !password || !mnemonic) throw new Error('invalid param');
    const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    // const encryptedWallet = yield call(decryptedWallet.encrypt, password);
    const encryptedWallet = yield decryptedWallet.encrypt(password);
    yield put(createNewWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(createNewWalletFailed(e));
  }
}

// Decrypt a software wallet using a password
export function* decryptWallet({ name, encryptedWallet, password }) {
  try {
    yield put(notify('info', `Decrypting wallet ${name}`));
    if (!name) throw new Error('name undefined');
    const res = yield Wallet.fromEncryptedWallet(encryptedWallet, password);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(name, decryptedWallet));
    yield put(notify('success', `Successfully decrypted ${name}`));
  } catch (e) {
    yield put(decryptWalletFailed(e));
    yield put(notify('error', `Failed to decrypt wallet: ${e}`));
  }
}

export function* initWalletsBalances() {
  const walletList = yield select(makeSelectWalletList());
  for (let i = 0; i < walletList.length; i += 1) {
    yield put(loadWalletBalances(walletList[i].name, `0x${walletList[i].address}`));
  }
}

export function* loadWalletBalancesSaga({ name, walletAddress }) {
  const requestPath = `ethereum/wallets/${walletAddress}/balance`;
  try {
    const returnData = yield call(request, requestPath);
    yield put(loadWalletBalancesSuccess(name, returnData));
  } catch (err) {
    yield put(loadWalletBalancesError(name, err));
  }
}

export function* transfer({ token, wallet, toAddress, amount, gasPrice, gasLimit }) {
  if (!wallet.decrypted) {
    yield put(showDecryptWalletModal(wallet.name));
    return;
  }
  if (token !== 'ETH') {
    return;
  }
  yield put(notify('info', 'Sending transaction...'));
  const etherWallet = new Wallet(wallet.decrypted.privateKey);
  etherWallet.provider = providers.getDefaultProvider(process.env.NETWORK || 'ropsten');

  const wei = utils.parseEther(amount.toString());
  try {
    const transaction = yield etherWallet.send(toAddress, wei, { gasPrice, gasLimit });
    yield put(transferSuccess(transaction));
    yield put(notify('success', 'Transaction sent'));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error}`));
  }
}

// Root watcher
export default function* walletManager() {
  yield takeEvery(CREATE_NEW_WALLET, createWallet);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(TRANSFER, transfer);
}
