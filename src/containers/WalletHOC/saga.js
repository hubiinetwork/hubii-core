import { delay } from 'redux-saga';
import { takeEvery, put, call, select, fork, take, cancel } from 'redux-saga/effects';
import Eth from '@ledgerhq/hw-app-eth';
import { Wallet, utils, providers, Contract } from 'ethers';

import { notify } from 'containers/App/actions';

import request from '../../utils/request';
import { ERC20ABI, EthNetworkProvider } from '../../utils/wallet';
import { makeSelectWalletList, makeSelectCurrentWalletDetails } from './selectors';
import LedgerTransport from '../../utils/ledger/Transport';

import {
  CREATE_NEW_WALLET,
  DECRYPT_WALLET,
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  TRANSFER_SUCCESS,
  POLL_LEDGER,
  START_LEDGER_SYNC,
  STOP_LEDGER_SYNC,
  LEDGER_ERROR,
  LEDGER_DETECTED,
  FETCH_LEDGER_ADDRESSES,
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
  ledgerDetected,
  ledgerError,
  pollLedger as pollLedgerAction,
  stopLedgerSync,
  startLedgerSync,
  fetchedLedgerAddress,
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  transactionConfirmed,
  hideDecryptWalletModal,
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
    yield put(hideDecryptWalletModal());
  } catch (e) {
    yield put(decryptWalletFailed(e));
    yield put(notify('error', `Failed to decrypt wallet: ${e}`));
  }
}

export function* initWalletsBalances() {
  const walletList = yield select(makeSelectWalletList());
  for (let i = 0; i < walletList.length; i += 1) {
    yield put(loadWalletBalances(walletList[i].name, `${walletList[i].address}`));
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
  yield put(notify('info', 'Sending transaction...'));

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
    yield put(notify('success', 'Transaction sent'));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error}`));
  }
}

export function* waitTransactionHash({ transaction }) {
  const provider = providers.getDefaultProvider(process.env.NETWORK || 'ropsten');
  const confirmedTxn = yield call((...args) => provider.waitForTransaction(...args), transaction.hash);
  yield put(transactionConfirmed(confirmedTxn));
  yield put(notify('success', 'Transaction confirmed'));
}

/*
 * Ledger sagas
 */

// Will continuously poll the ledger, keeping the connection status up to date
export function* ledgerSync() {
  try {
    while (true) { // eslint-disable-line no-constant-condition
      yield put(pollLedgerAction());
      yield take([LEDGER_ERROR, LEDGER_DETECTED]);
      yield delay(2500);
    }
  } finally {
    // sync cancelled
  }
}

// Keeps connection status of Ledger Nano S up to date
export function* pollLedger() {
  try {
    const transport = yield LedgerTransport.create();
    const eth = new Eth(transport);
    // Ledger ID is its default address's public key
    const address = yield eth.getAddress("m/44'/60'/0'/0");
    const id = address.publicKey;
    yield put(ledgerDetected(id));
  } catch (e) {
    yield put(ledgerError(e));
  }
}

// Dispatches the address for every derivation path in the input
export function* fetchLedgerAddresses({ derivationPaths }) {
  try {
    // Pause the ledger sync to ensure only one process is accessing it at a time
    yield put(stopLedgerSync());
    const transport = yield LedgerTransport.create();
    const eth = new Eth(transport);

    let i;
    for (i = 0; i < derivationPaths.length; i += 1) {
      const path = derivationPaths[i];
      const publicAddressKeyPair = yield eth.getAddress(path);
      yield put(fetchedLedgerAddress(path, publicAddressKeyPair.address));
    }
  } catch (error) {
    put(ledgerError('Error fetching address'));
  } finally {
    // Start ledger sync back up
    yield put(startLedgerSync());
  }
}

// Root watcher
export default function* walletHoc() {
  yield takeEvery(CREATE_NEW_WALLET, createWallet);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(POLL_LEDGER, pollLedger);
  yield takeEvery(FETCH_LEDGER_ADDRESSES, fetchLedgerAddresses);
  yield takeEvery(TRANSFER, transfer);

  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);
  yield takeEvery(TRANSFER_SUCCESS, waitTransactionHash);

  // Handles the Ledger auto polling lifecycle
  // START_LEDGER_SYNC activates ledgerSync saga
  // STOP_LEDGER_SYNC causes ledgerSync saga to drop what it's doing
  // and immidietly enter its 'finally' block
  while (yield take(START_LEDGER_SYNC)) {
    const bgSyncTask = yield fork(ledgerSync);

    yield take(STOP_LEDGER_SYNC);
    yield cancel(bgSyncTask);
  }
}
