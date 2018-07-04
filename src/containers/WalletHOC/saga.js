import { takeEvery, put, call, select } from 'redux-saga/effects';
import { Wallet, utils, providers, Contract } from 'ethers';
import Notification from 'components/Notification';
import { makeSelectWallets, makeSelectWalletList, makeSelectCurrentWalletDetails } from './selectors';
import request from '../../utils/request';
import { getWalletsLocalStorage, ERC20ABI, EthNetworkProvider } from '../../utils/wallet';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  DECRYPT_WALLET_SUCCESS,
  DECRYPT_WALLET_FAILURE,
  CREATE_NEW_WALLET_SUCCESS,
  LOAD_WALLETS,
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  TRANSFER_ERROR,
  TRANSFER_SUCCESS,
  NOTIFY,
} from './constants';
import {
  createNewWalletFailed,
  createNewWalletSuccess,
  decryptWalletFailed,
  decryptWalletSuccess,
  hideDecryptWalletModal,
  loadWalletsSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  showDecryptWalletModal,
  transferSuccess,
  transferError,
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  notify,
  transactionConfirmed,
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
    if (!name) throw new Error('name undefined');
    const res = yield Wallet.fromEncryptedWallet(encryptedWallet, password);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(name, decryptedWallet));
  } catch (e) {
    yield put(decryptWalletFailed(e));
  }
}

export function cacheNewWallet({ name, newWallet }) {
  const existingWallets = getWalletsLocalStorage();
  existingWallets.software[name] = { encrypted: newWallet.encrypted };
  window.localStorage.setItem('wallets', JSON.stringify(existingWallets));
}

export function* loadWallets() {
  const storedWallets = getWalletsLocalStorage();
  const sessionWallets = (yield select(makeSelectWallets())).toJS();

  Object.keys(storedWallets).forEach((type) => {
    Object.keys(storedWallets[type]).forEach((walletName) => {
      if (!sessionWallets[type][walletName]) {
        sessionWallets[type][walletName] = storedWallets[type][walletName];
      }
    });
  });
  yield put(loadWalletsSuccess(sessionWallets));
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

export function* transfer({ token, wallet, toAddress, amount, gasPrice, gasLimit, contractAddress }) {
  if (!wallet.decrypted) {
    yield put(showDecryptWalletModal(wallet.name));
    return;
  }

  const wei = utils.parseEther(amount.toString());
  if (token === 'ETH') {
    yield put(transferEtherAction({ toAddress, amount: wei, gasPrice, gasLimit }));
  } else if (contractAddress) {
    yield put(transferERC20Action({ token, toAddress, amount: wei, gasPrice, gasLimit, contractAddress }));
  }
}

export function* transferEther({ toAddress, amount, gasPrice, gasLimit }) {
  const walletDetails = yield select(makeSelectCurrentWalletDetails());
  const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
  etherWallet.provider = EthNetworkProvider;

  try {
    const options = { gasPrice, gasLimit };
    const transaction = yield call((...args) => etherWallet.send(...args), toAddress, amount, options);

    yield put(transferSuccess(transaction, 'ETH'));
  } catch (error) {
    yield put(transferError(error));
  }
}

export function* transferERC20({ token, contractAddress, toAddress, amount, gasPrice, gasLimit }) {
  const contractAbiFragment = ERC20ABI;

  const walletDetails = yield select(makeSelectCurrentWalletDetails());
  const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
  etherWallet.provider = EthNetworkProvider;

  try {
    const options = { gasPrice, gasLimit };
    const contract = new Contract(contractAddress, contractAbiFragment, etherWallet);
    const transaction = yield call((...args) => contract.transfer(...args), toAddress, amount, options);
    yield put(transferSuccess(transaction, token));
  } catch (error) {
    yield put(transferError(error));
  }
}

export function* waitTransactionHash({ transaction }) {
  const provider = providers.getDefaultProvider(process.env.NETWORK || 'ropsten');
  const confirmedTxn = yield call((...args) => provider.waitForTransaction(...args), transaction.hash);
  yield put(transactionConfirmed(confirmedTxn));
}

export function* notifyUI({ success, message }) {
  yield Promise.resolve(Notification(success, message));
}

// UI notifications
export function* notifyDecryptWalletSuccessUI({ name }) {
  yield put(notify(true, `Successfully decrypted ${name}`));
  yield put(hideDecryptWalletModal());
}

export function* notifyDecryptWalletErrorUI({ error }) {
  yield put(notify(false, `Failed to decrypt wallet: ${error.message}`));
}

export function* notifyDecryptWalletUI({ name }) {
  yield put(notify(true, `Decrypting wallet ${name}`));
}

export function* notifyTransferSuccessUI() {
  yield put(notify(true, 'Transaction sent'));
}

export function* notifyTransferErrorUI({ error }) {
  yield put(notify(false, `Failed to send transaction: ${error}`));
}

export function* notifyTransferingUI({ wallet }) {
  if (wallet.decrypted) {
    yield put(notify(true, 'Sending transaction'));
  }
}

// Root watcher
export default function* walletManager() {
  yield takeEvery(CREATE_NEW_WALLET, createWallet);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(CREATE_NEW_WALLET_SUCCESS, cacheNewWallet);
  yield takeEvery(LOAD_WALLETS, loadWallets);
  yield takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);
  yield takeEvery(TRANSFER_SUCCESS, waitTransactionHash);

  yield takeEvery(DECRYPT_WALLET_FAILURE, notifyDecryptWalletErrorUI);
  yield takeEvery(DECRYPT_WALLET_SUCCESS, notifyDecryptWalletSuccessUI);
  yield takeEvery(DECRYPT_WALLET, notifyDecryptWalletUI);
  yield takeEvery(TRANSFER_ERROR, notifyTransferErrorUI);
  yield takeEvery(TRANSFER_SUCCESS, notifyTransferSuccessUI);
  yield takeEvery(TRANSFER, notifyTransferingUI);
  yield takeEvery(NOTIFY, notifyUI);
}
