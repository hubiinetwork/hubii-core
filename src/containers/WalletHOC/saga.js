import { delay } from 'redux-saga';
import {
  takeEvery,
  take,
  put,
  call,
  select,
  spawn,
  cancel,
  all,
  fork,
} from 'redux-saga/effects';
import { Wallet, utils, Contract } from 'ethers';

import { notify } from 'containers/App/actions';
import { CHANGE_NETWORK } from 'containers/App/constants';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { requestWalletAPI } from 'utils/request';
import {
  ERC20ABI,
  isHardwareWallet,
  IsAddressMatch,
} from 'utils/wallet';
import generateRawTx from 'utils/generateRawTx';

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
  INIT_API_CALLS,
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
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPricesSuccess,
  loadPricesError,
  loadTransactions as loadTransactionsAction,
  loadTransactionsSuccess,
  loadTransactionsError,
  showDecryptWalletModal,
  transferSuccess,
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

export function* loadWalletBalancesSaga({ address, noPoll }, _endpoint) {
  const requestPath = `ethereum/wallets/${address}/balances`;
  let endpoint = _endpoint;
  if (!endpoint) {
    endpoint = (yield select(makeSelectCurrentNetwork())).walletApiEndpoint;
  }
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, endpoint);
      yield put(loadWalletBalancesSuccess(address, returnData));
    } catch (err) {
      if (!noPoll) {
        yield put(loadWalletBalancesError(address, err));
      }
    } finally {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
    }
    if (noPoll) break;
  }
}

export function* loadSupportedTokens(endpoint) {
  const requestPath = 'ethereum/supported-tokens';
  try {
    const returnData = yield call(requestWalletAPI, requestPath, endpoint);
    yield put(loadSupportedTokensSuccess(returnData));
  } catch (err) {
    yield put(loadSupportedTokensError(err));
  }
}

export function* loadBlockHeight(provider) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const blockHeight = yield provider.getBlockNumber();
      yield put(loadBlockHeightSuccess(blockHeight));
    } catch (error) {
      yield put(loadBlockHeightError(error));
    } finally {
      const TEN_SEC_IN_MS = 1000 * 10;
      yield delay(TEN_SEC_IN_MS);
    }
  }
}

export function* loadPrices(endpoint) {
  const requestPath = 'ethereum/prices';
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, endpoint);
      yield put(loadPricesSuccess(returnData));
    } catch (err) {
      yield put(loadPricesError(err));
    } finally {
      const ONE_MINUTE_IN_MS = 1000 * 60;
      yield delay(ONE_MINUTE_IN_MS);
    }
  }
}

export function* loadTransactions({ address }, endpoint) {
  const requestPath = `ethereum/wallets/${address}/transactions`;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const returnData = yield call(requestWalletAPI, requestPath, endpoint);

      yield put(loadTransactionsSuccess(address, returnData));
    } catch (err) {
      yield put(loadTransactionsError(address, err));
    } finally {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
    }
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
    const network = yield select(makeSelectCurrentNetwork());

    if (isHardwareWallet(walletDetails.type)) {
      transaction = yield call(sendTransactionForHardwareWallet, { toAddress, amount, gasPrice, gasLimit });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
      etherWallet.provider = network.provider;
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
  const network = yield select(makeSelectCurrentNetwork());
  const provider = network.provider;
  let transaction;
  try {
    const options = { gasPrice, gasLimit };
    if (isHardwareWallet(walletDetails.type)) {
      // console.log(provider);
      const tx = yield call(generateERC20Transaction, {
        contractAddress,
        walletAddress: walletDetails.address,
        toAddress,
        amount,
        provider,
      }, options);
      transaction = yield call(sendTransactionForHardwareWallet, { ...tx, amount: tx.value, toAddress: tx.to });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
      etherWallet.provider = provider;
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
export function generateERC20Transaction({ contractAddress, walletAddress, toAddress, amount, provider }, options) {
  return new Promise((resolve) => {
    const contract = new Contract(contractAddress, ERC20ABI, {
      provider,
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
  const existAddress = wallets.find((wallet) => IsAddressMatch(wallet.get('address'), newWallet.address));
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
  const network = yield select(makeSelectCurrentNetwork());
  const provider = network.provider;
  const walletDetails = currentWalletWithInfo.toJS();
  let nonceValue = nonce;
  if (!nonceValue) {
    nonceValue = yield call([provider, 'getTransactionCount'], walletDetails.address, 'pending');
  }
  const amountHex = amount ? amount.toHexString() : '0x00';
  const chainId = provider.chainId;

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
  const txHash = yield call([provider, 'sendTransaction'], txHex);
  // get transaction details
  return yield call([provider, 'getTransaction'], txHash);
}

// manages calling of network specific APIs
export function* networkApiOrcestrator() {
  try {
    while (true) { // eslint-disable-line no-constant-condition
      // fork new processes, some of which will poll
      const network = yield select(makeSelectCurrentNetwork());
      const wallets = yield select(makeSelectWallets());
      const allTasks = yield all([
        ...wallets.map((wallet) => fork(loadWalletBalancesSaga, { address: wallet.get('address') }, network.walletApiEndpoint)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, network.walletApiEndpoint)),
        fork(loadSupportedTokens, network.walletApiEndpoint),
        fork(loadBlockHeight, network.provider),
        fork(loadPrices, network.walletApiEndpoint),
      ]);

      // on network change kill all forks and restart
      yield take(CHANGE_NETWORK);
      yield cancel(...allTasks);
    }
  } catch (e) {
    // errors in the forked processes themselves should be caught
    // and handled before they get here. if something goes wrong here
    // there was probably an error with the wallet selector, which should
    // never happen
    throw new Error(e);
  }
}

// Root watcher
export default function* walletHoc() {
  yield takeEvery(CREATE_WALLET_FROM_MNEMONIC, createWalletFromMnemonic);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(INIT_API_CALLS, networkApiOrcestrator);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);

  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);

  yield spawn(ledgerWatchers);
  yield spawn(trezorWatchers);
}
