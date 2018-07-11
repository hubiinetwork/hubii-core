import { takeEvery, put, call, select, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Wallet, utils, providers, Contract } from 'ethers';
import { notify } from 'containers/App/actions';
import { makeSelectWalletList, makeSelectCurrentWalletDetails } from './selectors';
import { requestWalletAPI } from '../../utils/request';
import { ERC20ABI, EthNetworkProvider } from '../../utils/wallet';

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
  CREATE_WALLET_FROM_PRIVATE_KEY,
} from './constants';

import {
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
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  transactionConfirmed,
  hideDecryptWalletModal,
} from './actions';

// Creates a new software wallet
export function* createWalletFromMnemonic({ name, mnemonic, derivationPath, password }) {
  try {
    if (!name || !derivationPath || !password || !mnemonic) throw new Error('invalid param');
    const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    const encryptedWallet = yield decryptedWallet.encrypt(password);
    yield put(createWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(createWalletFailed(e));
  }
}

export function* createWalletFromPrivateKey({ privateKey, name, password }) {
  try {
    if (!name || !privateKey || !password) throw new Error('invalid param');
    const decryptedWallet = new Wallet(privateKey);
    const encryptedWallet = yield call((...args) => decryptedWallet.encrypt(...args), password);
    yield put(notify('success', `Successfully imported ${name}`));
    yield put(createWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(notify('error', `Failed to import wallet: ${e}`));
    yield put(createWalletFailed(e));
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
    yield put(decryptWalletSuccess(decryptedWallet));
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
  if (!wallet.decrypted) {
    yield put(showDecryptWalletModal(wallet.name));
    yield put(transferError(new Error('Wallet is encrypted')));
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
  yield put(loadWalletBalances(newWallet.address));
}

// Root watcher
export default function* walletHoc() {
  yield takeEvery(CREATE_WALLET_FROM_MNEMONIC, createWalletFromMnemonic);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);
  yield takeEvery(TRANSFER_SUCCESS, waitTransactionHash);

  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);
  yield takeEvery(LISTEN_TOKEN_BALANCES, listenBalances);
}
