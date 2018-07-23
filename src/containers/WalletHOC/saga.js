import { eventChannel, delay } from 'redux-saga';
import { takeLatest, takeEvery, put, call, select, fork, take, cancel } from 'redux-saga/effects';
import Eth from '@ledgerhq/hw-app-eth';
// import Web3 from 'web3';
import { Wallet, utils, providers, Contract } from 'ethers';

import { notify } from 'containers/App/actions';

import {
  makeSelectWalletList,
  makeSelectCurrentWalletDetails,
  makeSelectWallets,
} from './selectors';
import { requestWalletAPI } from '../../utils/request';
import { ERC20ABI, EthNetworkProvider } from '../../utils/wallet';
import LedgerTransport from '../../utils/ledger/Transport';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  LISTEN_TOKEN_BALANCES,
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
  CREATE_WALLET_FROM_PRIVATE_KEY,
} from './constants';

import {
  addNewWallet,
  createWalletFailed,
  createWalletSuccess,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  updateBalances as updateBalancesAction,
  listenBalances as listenBalancesAction,
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
// import generateRawTx from '../../utils/generateRawTx';

// Creates a new software wallet
export function* createWalletFromMnemonic({ name, mnemonic, derivationPath, password }) {
  try {
    if (!name || !derivationPath || !password || !mnemonic) throw new Error('invalid param');
    const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    const encryptedWallet = yield call((...args) => decryptedWallet.encrypt(...args), password);
    yield put(createWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(notify('error', `Failed to import wallet: ${e}`));
    yield put(createWalletFailed(e));
  }
}

export function* createWalletFromPrivateKey({ privateKey, name, password }) {
  try {
    if (!name || !privateKey || !password) throw new Error('invalid param');
    let prefixedPrivateKey = privateKey;
    if (!prefixedPrivateKey.startsWith('0x')) prefixedPrivateKey = `0x${privateKey}`;
    const decryptedWallet = new Wallet(prefixedPrivateKey);
    const encryptedWallet = yield call((...args) => decryptedWallet.encrypt(...args), password);
    yield put(createWalletSuccess(name, encryptedWallet, decryptedWallet));
    yield put(notify('warning', 'Wallets imported by private key are difficult to backup. It is recommended to sweep your funds into a mnemonic based wallet, which allows backup by a word phrase rather than a long hex string'));
  } catch (e) {
    yield put(notify('error', `Failed to import wallet: ${e}`));
    yield put(createWalletFailed(e));
  }
}

// Decrypt a software wallet using a password
export function* decryptWallet({ address, encryptedWallet, password }) {
  try {
    yield put(notify('info', 'Unlocking wallet...'));
    if (!address) throw new Error('Address undefined');
    const res = yield Wallet.fromEncryptedWallet(encryptedWallet, password);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(address, decryptedWallet));
    yield put(notify('success', 'Wallet unlocked!'));
    yield put(hideDecryptWalletModal());
  } catch (e) {
    yield put(decryptWalletFailed(e));
    yield put(notify('error', `Failed to unlock wallet: ${e}`));
  }
}

export function* initWalletsBalances() {
  const walletList = yield select(makeSelectWalletList());
  for (let i = 0; i < walletList.length; i += 1) {
    yield put(loadWalletBalances(walletList[i].address));
  }
}

export function* loadWalletBalancesSaga({ address }) {
  const requestPath = `ethereum/wallets/${address}/balance`;
  try {
    const returnData = yield call(requestWalletAPI, requestPath);
    yield put(loadWalletBalancesSuccess(address, returnData));
    yield put(listenBalancesAction(address));
  } catch (err) {
    yield put(loadWalletBalancesError(address, err));
  }
}


export function* listenBalances({ address }) {
  let walletList = yield select(makeSelectWalletList());
  let wallet = walletList.find((wal) => wal.address === address);
  const chan = yield call((addr) => eventChannel((emitter) => {
    EthNetworkProvider.on(addr, (newBalance) => {
      if (!newBalance) {
        return;
      }
      emitter({ newBalance });
    });

    return () => {
      EthNetworkProvider.removeListener(addr);
    };
  }
  ), wallet.address);
  while (true) { // eslint-disable-line no-constant-condition
    const updates = yield take(chan);

    // If wallet has been deleted since listening, do nothing
    walletList = yield select(makeSelectWalletList());
    wallet = walletList.find((wal) => wal.address === address);
    if (!wallet) {
      return;
    }
    yield put(updateBalancesAction(address, { symbol: 'ETH', balance: updates.newBalance.toString() }));
  }
}

export function* transfer({ token, wallet, toAddress, amount, gasPrice, gasLimit, contractAddress }) {
  if (wallet.encrypted && !wallet.decrypted) {
    yield put(showDecryptWalletModal(wallet.name));
    yield put(transferError(new Error('Wallet is encrypted')));
    return;
  }

  yield put(notify('info', 'Sending transaction...'));

  // Transfering from a Ledger
  if (!wallet.encrypted) {
    // Build raw transaction
    yield put(notify('error', 'Sending transactions from a LNS is not supported in this version of Hubii Core, please check back soon!'));
    // const rawTx = generateRawTx({ toAddress, amount, gasPrice, gasLimit });

    // // Sign raw transaction
    // try {
    //   yield put(notify('info', 'Verify transaction details on your Ledger'));
    //   const signedTx = ledgerSignTxn(rawTx);

    // // Broadcast signed transaction
    //   const web3 = new Web3('http://geth-ropsten.dev.hubii.net/');
    //   const txHash = yield web3.eth.sendRawTransaction(signedTx);
    //   yield put(transferSuccess(txHash, 'ETH'));
    // } catch (e) {
    //   yield put(ledgerError('Error making transaction: ', e));
    // }
  } else {
    // Transfering from a software wallet
    const wei = utils.parseEther(amount.toString());
    if (token === 'ETH') {
      yield put(transferEtherAction({ toAddress, amount: wei, gasPrice, gasLimit }));
    } else if (contractAddress) {
      yield put(transferERC20Action({ token, toAddress, amount: wei, gasPrice, gasLimit, contractAddress }));
    }
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
    yield put(notify('success', 'Transaction sent'));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error}`));
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

export function* hookNewWalletCreated({ newWallet }) {
  const wallets = yield select(makeSelectWallets());
  const existAddress = wallets.find((wallet) => wallet.get('address') === newWallet.address);
  const existName = wallets.find((wallet) => wallet.get('name') === newWallet.name);
  if (existAddress) {
    return yield put(notify('error', `Wallet ${newWallet.address} already exists`));
  }
  if (existName) {
    return yield put(notify('error', `Wallet ${newWallet.name} already exists`));
  }
  yield put(addNewWallet(newWallet));
  yield put(loadWalletBalances(newWallet.address));
  return yield put(notify('success', `Successfully created ${newWallet.name}`));
}


/*
 * Ledger sagas
 */

// Sign a transaction with a Ledger
export function* ledgerSignTxn({ derivationPath, rawTx }) {
  try {
    yield put(stopLedgerSync());
    const transport = yield LedgerTransport.create();
    const eth = new Eth(transport);
    return yield eth.signTransaction(derivationPath, rawTx);
  } catch (e) {
    yield put(ledgerError('Error signing transaction: ', e));
    return -1;
  } finally {
    yield put(startLedgerSync());
  }
}

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
    yield delay(1000); // Wait for any ongoing operations to clear
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
  yield takeEvery(CREATE_WALLET_FROM_MNEMONIC, createWalletFromMnemonic);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(POLL_LEDGER, pollLedger);
  yield takeLatest(FETCH_LEDGER_ADDRESSES, fetchLedgerAddresses);
  yield takeEvery(TRANSFER, transfer);

  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);
  yield takeEvery(TRANSFER_SUCCESS, waitTransactionHash);
  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);
  yield takeEvery(LISTEN_TOKEN_BALANCES, listenBalances);

  // Handles the Ledger auto polling lifecycle
  // START_LEDGER_SYNC activates ledgerSync saga
  // STOP_LEDGER_SYNC causes ledgerSync saga to drop what it's doing
  // and immediately enter its 'finally' block
  while (yield take(START_LEDGER_SYNC)) {
    const bgSyncTask = yield fork(ledgerSync);

    yield take(STOP_LEDGER_SYNC);
    yield cancel(bgSyncTask);
  }
}
