import { delay } from 'redux-saga';
import { takeLatest, takeEvery, put, call, select, spawn } from 'redux-saga/effects';
import { Wallet, utils, Contract } from 'ethers';

import { notify } from 'containers/App/actions';
import { requestWalletAPI } from 'utils/request';
import {
  ERC20ABI,
  EthNetworkProvider,
  getTransaction,
  getTransactionCount,
  sendTransaction,
  isHardwareWallet,
  isAddressMatch,
} from 'utils/wallet';

import {
  makeSelectCurrentWalletWithInfo,
  makeSelectWallets,
  makeSelectCurrentDecryptionCallback,
} from './selectors';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  LOAD_WALLET_BALANCES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  LOAD_PRICES,
  LOAD_TRANSACTIONS,
  LOAD_SUPPORTED_TOKENS,
  INIT_API_CALLS,
  LOAD_BLOCK_HEIGHT,
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
  loadSupportedTokens as loadSupportedTokensAction,
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPrices as loadPricesAction,
  loadPricesSuccess,
  loadPricesError,
  loadTransactions as loadTransactionsAction,
  loadTransactionsSuccess,
  loadTransactionsError,
  showDecryptWalletModal,
  transferSuccess,
  loadBlockHeight as loadBlockHeightAction,
  transferError,
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  hideDecryptWalletModal,
  transfer as transferAction,
  loadBlockHeightSuccess,
  loadBlockHeightError,
} from './actions';

import trezorWatchers, { signTxByTrezor } from './HardwareWallets/trezor/saga';
import ledgerWatchers, { signTxByLedger } from './HardwareWallets/ledger/saga';

import generateRawTx from '../../utils/generateRawTx';

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
  let callbackAction = yield select(makeSelectCurrentDecryptionCallback());
  try {
    yield put(notify('info', 'Unlocking wallet...'));
    if (!address) throw new Error('Address undefined');
    const res = yield Wallet.fromEncryptedWallet(encryptedWallet, password);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(address, decryptedWallet));
    yield put(notify('success', 'Wallet unlocked!'));
    yield put(hideDecryptWalletModal());
    if (callbackAction) {
      callbackAction = callbackAction.toJS();
      callbackAction.wallet.decrypted = decryptedWallet;
      yield put(callbackAction);
    }
  } catch (e) {
    yield put(decryptWalletFailed(e));
    yield put(notify('error', `Failed to unlock wallet: ${e}`));
  }
}

export function* initApiCalls() {
  const wallets = yield select(makeSelectWallets());
  for (let i = 0; i < wallets.size; i += 1) {
    yield put(loadWalletBalances(wallets.getIn([i, 'address'])));
    yield put(loadTransactionsAction(wallets.getIn([i, 'address'])));
  }
  yield put(loadSupportedTokensAction());
  yield put(loadPricesAction());
  yield put(loadBlockHeightAction());
}

export function* loadWalletBalancesSaga({ address, noPoll }) {
  const requestPath = `ethereum/wallets/${address}/balances`;
  try {
    const returnData = yield call(requestWalletAPI, requestPath);

    yield put(loadWalletBalancesSuccess(address, returnData));
  } catch (err) {
    yield put(loadWalletBalancesError(address, err));
  } finally {
    if (!noPoll) {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
      yield put(loadWalletBalances(address));
    }
  }
}

export function* loadSupportedTokens() {
  const requestPath = 'ethereum/supported-tokens';
  try {
    const returnData = yield call(requestWalletAPI, requestPath);
    yield put(loadSupportedTokensSuccess(returnData));
  } catch (err) {
    yield put(loadSupportedTokensError(err));
  }
}

export function* loadBlockHeight() {
  try {
    const blockHeight = yield EthNetworkProvider.getBlockNumber();
    yield put(loadBlockHeightSuccess(blockHeight));
  } catch (error) {
    yield put(loadBlockHeightError(error));
  } finally {
    const TEN_SEC_IN_MS = 1000 * 10;
    yield delay(TEN_SEC_IN_MS);
    yield put(loadBlockHeightAction());
  }
}

export function* loadPrices() {
  const requestPath = 'ethereum/prices';
  try {
    const returnData = yield call(requestWalletAPI, requestPath);
    yield put(loadPricesSuccess(returnData));
  } catch (err) {
    yield put(loadPricesError(err));
  } finally {
    const ONE_MINUTE_IN_MS = 1000 * 60;
    yield delay(ONE_MINUTE_IN_MS);
    yield put(loadPricesAction());
  }
}

export function* loadTransactions({ address }) {
  const requestPath = `ethereum/wallets/${address}/transactions`;
  try {
    const returnData = yield call(requestWalletAPI, requestPath);

    yield put(loadTransactionsSuccess(address, returnData));
  } catch (err) {
    yield put(loadTransactionsError(address, err));
  } finally {
    const FIVE_SEC_IN_MS = 1000 * 5;
    yield call(() => delay(FIVE_SEC_IN_MS));
    yield put(loadTransactionsAction(address));
  }
}

export function* transfer({ token, wallet, toAddress, amount, gasPrice, gasLimit, contractAddress }) {
  if (wallet.encrypted && !wallet.decrypted) {
    yield put(showDecryptWalletModal(transferAction({ wallet, token, toAddress, amount, gasPrice, gasLimit, contractAddress })));
    yield put(transferError(new Error('Wallet is encrypted')));
    return;
  }

  // convert BigNumbers to the etherjs version of BigNumber here so the toHexString() method
  // can be used later
  const amountConverted = utils.bigNumberify(amount.toString());
  const gasPriceConverted = utils.bigNumberify(gasPrice.toString());

  yield put(notify('info', 'Sending transaction...'));
  try {
    if (token === 'ETH') {
      yield put(transferEtherAction({ toAddress, amount: amountConverted, gasPrice: gasPriceConverted, gasLimit }));
    } else if (contractAddress) {
      yield put(transferERC20Action({ token, toAddress, amount: amountConverted, gasPrice: gasPriceConverted, gasLimit, contractAddress }));
    }
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error}`));
  }
}

export function* transferEther({ toAddress, amount, gasPrice, gasLimit }) {
  try {
    let transaction;
    const options = { gasPrice, gasLimit };
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();

    if (isHardwareWallet(walletDetails.type)) {
      transaction = yield call(sendTransactionForHardwareWallet, { toAddress, amount, gasPrice, gasLimit });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
      etherWallet.provider = EthNetworkProvider;
      transaction = yield call((...args) => etherWallet.send(...args), toAddress, amount, options);
    }
    yield put(transferSuccess(transaction, 'ETH'));
    yield put(notify('success', 'Transaction sent'));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error.message}`));
  }
}

export function* transferERC20({ token, contractAddress, toAddress, amount, gasPrice, gasLimit }) {
  const contractAbiFragment = ERC20ABI;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  let transaction;
  try {
    const options = { gasPrice, gasLimit };
    if (isHardwareWallet(walletDetails.type)) {
      const tx = yield call(generateERC20Transaction, {
        contractAddress,
        walletAddress: walletDetails.address,
        toAddress,
        amount,
      }, options);
      transaction = yield call(sendTransactionForHardwareWallet, { ...tx, amount: tx.value, toAddress: tx.to });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
      etherWallet.provider = EthNetworkProvider;
      const contract = new Contract(contractAddress, contractAbiFragment, etherWallet);
      transaction = yield call((...args) => contract.transfer(...args), toAddress, amount, options);
    }

    if (!transaction) {
      throw new Error('Failed to send transaction');
    }

    yield put(transferSuccess(transaction, token));
    yield put(notify('success', 'Transaction sent'));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error.message}`));
  }
}

// hook into etherjs's sign function get generated erc20 transaction object for further process
export function generateERC20Transaction({ contractAddress, walletAddress, toAddress, amount }, options) {
  return new Promise((resolve) => {
    const contract = new Contract(contractAddress, ERC20ABI, {
      provider: EthNetworkProvider,
      getAddress: () => walletAddress,
      sign: (tx) => {
        resolve(tx);
      },
    });
    contract.transfer(toAddress, amount, options).catch(() => {});
  });
}

export function* hookNewWalletCreated({ newWallet }) {
  const wallets = yield select(makeSelectWallets());
  const existAddress = wallets.find((wallet) => isAddressMatch(wallet.get('address'), newWallet.address));
  const existName = wallets.find((wallet) => wallet.get('name') === newWallet.name);
  if (existAddress) {
    return yield put(notify('error', `Wallet ${newWallet.address} already exists`));
  }
  if (existName) {
    return yield put(notify('error', `Wallet ${newWallet.name} already exists`));
  }
  yield put(addNewWallet(newWallet));
  yield put(loadWalletBalances(newWallet.address));
  yield put(loadTransactionsAction(newWallet.address));
  return yield put(notify('success', `Successfully created ${newWallet.name}`));
}

export function* sendTransactionForHardwareWallet({ toAddress, amount, data, nonce, gasPrice, gasLimit }) {
  const currentWalletWithInfo = yield select(makeSelectCurrentWalletWithInfo());
  const walletDetails = currentWalletWithInfo.toJS();
  let nonceValue = nonce;
  if (!nonceValue) {
    nonceValue = yield call(getTransactionCount, walletDetails.address, 'pending');
  }
  const amountHex = amount ? amount.toHexString() : '0x00';
  const chainId = EthNetworkProvider.chainId;

  // generate raw tx for ledger nano to sign
  const rawTx = generateRawTx({
    toAddress,
    amount: amountHex,
    gasPrice: gasPrice.toHexString(),
    gasLimit,
    nonce: nonceValue,
    data,
    chainId,
  });
  // changes to the raw tx before signing by ledger nano
  rawTx.raw[6] = Buffer.from([chainId]);
  rawTx.raw[7] = Buffer.from([]);
  rawTx.raw[8] = Buffer.from([]);

  let signedTx;
  if (walletDetails.type === 'lns') {
    const rawTxHex = rawTx.serialize().toString('hex');
    signedTx = yield signTxByLedger(walletDetails, rawTxHex);
    rawTx.v = Buffer.from(signedTx.v, 'hex');
  }
  if (walletDetails.type === 'trezor') {
    const raw = rawTx.toJSON();

    signedTx = yield signTxByTrezor({ walletDetails, raw, data, chainId });
    rawTx.v = Buffer.from(signedTx.v.toString(16), 'hex');
  }
  // update raw tx with signed data
  rawTx.r = Buffer.from(signedTx.r, 'hex');
  rawTx.s = Buffer.from(signedTx.s, 'hex');

  // regenerate tx hex string
  const txHex = `0x${rawTx.serialize().toString('hex')}`;
  // broadcast transaction
  const txHash = yield call(sendTransaction, txHex);
  // get transaction details
  return yield call(getTransaction, txHash);
}

// Root watcher
export default function* walletHoc() {
  yield takeEvery(CREATE_WALLET_FROM_MNEMONIC, createWalletFromMnemonic);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(INIT_API_CALLS, initApiCalls);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);

  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);

  yield takeLatest(LOAD_PRICES, loadPrices);
  yield takeEvery(LOAD_TRANSACTIONS, loadTransactions);
  yield takeLatest(LOAD_SUPPORTED_TOKENS, loadSupportedTokens);
  yield takeLatest(LOAD_BLOCK_HEIGHT, loadBlockHeight);

  yield spawn(ledgerWatchers);
  yield spawn(trezorWatchers);
}
