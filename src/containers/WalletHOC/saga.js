import { delay, eventChannel } from 'redux-saga';
import { takeLatest, takeEvery, put, call, select, take, race, spawn } from 'redux-saga/effects';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import { Wallet, utils, Contract } from 'ethers';

import { notify } from 'containers/App/actions';
import { requestWalletAPI } from 'utils/request';
import {
  ERC20ABI,
  EthNetworkProvider,
  getTransaction,
  getTransactionCount,
  sendTransaction,
} from 'utils/wallet';

import {
  makeSelectCurrentWalletWithInfo,
  makeSelectWallets,
  makeSelectCurrentDecryptionCallback,
  makeSelectLedgerNanoSInfo,
} from './selectors';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  LOAD_WALLET_BALANCES,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  FETCH_LEDGER_ADDRESSES,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  LOAD_PRICES,
  LOAD_SUPPORTED_TOKENS,
  INIT_LEDGER,
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
  INIT_WALLETS_BALANCES,
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
  showDecryptWalletModal,
  transferSuccess,
  transferError,
  ledgerConnected,
  ledgerDisconnected,
  ledgerEthAppConnected,
  ledgerEthAppDisconnected,
  ledgerError,
  fetchedLedgerAddress,
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  hideDecryptWalletModal,
  transfer as transferAction,
} from './actions';
import { createEthTransportActivity } from '../../utils/ledger/comms';
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

export function* initWalletsBalances() {
  const wallets = yield select(makeSelectWallets());
  for (let i = 0; i < wallets.size; i += 1) {
    yield put(loadWalletBalances(wallets.getIn([i, 'address'])));
  }
  yield put(loadSupportedTokensAction());
  yield put(loadPricesAction());
}

export function* loadWalletBalancesSaga({ address }) {
  const requestPath = `ethereum/wallets/${address}/balances`;
  try {
    const returnData = yield call(requestWalletAPI, requestPath);

    yield put(loadWalletBalancesSuccess(address, returnData));
  } catch (err) {
    yield put(loadWalletBalancesError(address, err));
  } finally {
    const FIVE_SEC_IN_MS = 1000 * 5;
    yield delay(FIVE_SEC_IN_MS);
    yield put(loadWalletBalances(address));
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

    if (walletDetails.type === 'lns') {
      transaction = yield call(sendTransactionByLedger, { toAddress, amount, gasPrice, gasLimit });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
      etherWallet.provider = EthNetworkProvider;
      transaction = yield call((...args) => etherWallet.send(...args), toAddress, amount, options);
    }
    yield put(transferSuccess(transaction, 'ETH'));
    yield put(notify('success', 'Transaction sent'));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', `Failed to send transaction: ${error}`));
  }
}

export function* transferERC20({ token, contractAddress, toAddress, amount, gasPrice, gasLimit }) {
  const contractAbiFragment = ERC20ABI;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  let transaction;
  try {
    const options = { gasPrice, gasLimit };
    if (walletDetails.type === 'lns') {
      const tx = yield call(generateERC20Transaction, {
        contractAddress,
        walletAddress: walletDetails.address,
        toAddress,
        amount,
      }, options);
      transaction = yield call(sendTransactionByLedger, { ...tx, amount: tx.value, toAddress: tx.to });
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
    yield put(notify('error', `Failed to send transaction: ${error}`));
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

// export function* waitTransactionHash({ transaction }) {
//   const provider = providers.getDefaultProvider(process.env.NETWORK || 'ropsten');
//   const confirmedTxn = yield call((...args) => provider.waitForTransaction(...args), transaction.hash);
//   yield put(transactionConfirmed(confirmedTxn));
//   yield put(notify('success', 'Transaction confirmed'));
// }

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


// Creates an eventChannel to listen to Ledger events
export const ledgerChannel = () => eventChannel((listener) => {
  const sub = LedgerTransport.listen({
    next: (e) => listener(e),
    error: (e) => listener(e),
    complete: (e) => listener(e),
  });
  return () => { sub.unsubscribe(); };
});

const ethChannels = {};
export const addEthChannel = (descriptor, channel) => {
  removeEthChannel(descriptor);
  ethChannels[descriptor] = channel;
};

export const removeEthChannel = (descriptor) => {
  const channel = ethChannels[descriptor];
  if (channel) {
    channel.close();
    delete ethChannels[descriptor];
  }
};

export const ledgerEthChannel = (descriptor) => eventChannel((listener) => {
  const iv = setInterval(() => {
    createEthTransportActivity(descriptor, (ethTransport) => ethTransport.getAddress('m/44\'/60\'/0\'/0')).then((address) => {
      listener({ connected: true, address });
    }).catch((err) => {
      listener({ connected: false, error: err });
    });
  }, 2000);
  return () => {
    clearInterval(iv);
  };
});

export function* pollEthApp({ descriptor }) {
  const channel = yield call(ledgerEthChannel, descriptor);
  addEthChannel(descriptor, channel);
  while (true) { // eslint-disable-line no-constant-condition
    const status = yield take(channel);
    try {
      if (status.connected) {
        removeEthChannel(descriptor);
        yield put(ledgerEthAppConnected(descriptor, status.address.publicKey));
      } else {
        yield put(ledgerEthAppDisconnected(descriptor));
        yield put(ledgerError(status.error));
      }
    } catch (error) {
      removeEthChannel(descriptor);
    }
  }
}

export function* hookLedgerDisconnected({ descriptor }) {
  removeEthChannel(descriptor);
  yield put(ledgerError({ message: 'Disconnected' }));
}

export function* initLedger() {
  const supported = yield call(LedgerTransport.isSupported);
  if (!supported) {
    yield put(ledgerError(Error('NoSupport')));
    return;
  }

  const chan = yield call(ledgerChannel);

  // Changing of the physical ledger state (changing app, toggling browser support etc)
  // emits a 'remove', then shortly after 'add' event. If 'remove' is emited and no 'add'
  // afterwards we know the device is disconnected. Every change of the ledger state,
  // try to look into it's Eth state. If it fails, we dispatch the appropriate error
  // message
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const msg = yield take(chan);
      if (msg.type === 'remove') {
        const { timeout } = yield race({
          msg: take(chan),
          timeout: call(delay, 1000),
        });
        if (timeout) {
          yield put(ledgerDisconnected(msg.descriptor));
          continue; // eslint-disable-line no-continue
        }
      }

      yield put(ledgerConnected(msg.descriptor));
    } catch (e) {
      yield put(ledgerError(e));
    }
  }
}

// Dispatches the address for every derivation path in the input
export function* fetchLedgerAddresses({ derivationPaths }) {
  try {
    const ledgerStatus = yield select(makeSelectLedgerNanoSInfo());
    if (!ledgerStatus.get('descriptor')) {
      throw new Error('no descriptor available');
    }
    const descriptor = ledgerStatus.get('descriptor');
    for (let i = 0; i < derivationPaths.length; i += 1) {
      const path = derivationPaths[i];
      const publicAddressKeyPair = yield tryCreateEthTransportActivity(descriptor, async (ethTransport) => ethTransport.getAddress(path));
      yield put(fetchedLedgerAddress(path, publicAddressKeyPair.address));
    }
  } catch (error) {
    yield put(ledgerError(error));
  }
}

export function* tryCreateEthTransportActivity(descriptor, func) {
  try {
    return yield call(createEthTransportActivity, descriptor, func);
  } catch (error) {
    yield spawn(pollEthApp, { descriptor });
    throw error;
  }
}

export function* sendTransactionByLedger({ toAddress, amount, data, nonce, gasPrice, gasLimit }) {
  const currentWalletWithInfo = yield select(makeSelectCurrentWalletWithInfo());
  const walletDetails = currentWalletWithInfo.toJS();
  const ledgerNanoSInfo = yield select(makeSelectLedgerNanoSInfo());
  let nonceValue = nonce;
  if (!nonceValue) {
    nonceValue = yield call(getTransactionCount, walletDetails.address, 'pending');
  }
  const amountHex = amount ? amount.toHexString() : '0x00';

  // generate raw tx for ledger nano to sign
  const rawTx = generateRawTx({
    toAddress,
    amount: amountHex,
    gasPrice: gasPrice.toHexString(),
    gasLimit,
    nonce: nonceValue,
    data,
    chainId: EthNetworkProvider.chainId,
  });
  // changes to the raw tx before signing by ledger nano
  rawTx.raw[6] = Buffer.from([EthNetworkProvider.chainId]);
  rawTx.raw[7] = Buffer.from([]);
  rawTx.raw[8] = Buffer.from([]);
  const rawTxHex = rawTx.serialize().toString('hex');

  let signedTx;
  try {
    const descriptor = ledgerNanoSInfo.get('descriptor');

    // check if the eth app is opened
    yield call(
      tryCreateEthTransportActivity,
      descriptor,
      async (ethTransport) => ethTransport.getAddress(walletDetails.derivationPath)
    );
    yield put(notify('info', 'Verify transaction details on your Ledger'));

    signedTx = yield call(
      tryCreateEthTransportActivity,
      descriptor,
      (ethTransport) => ethTransport.signTransaction(walletDetails.derivationPath, rawTxHex)
    );
  } catch (e) {
    const refinedError = ledgerError(e);
    yield put(refinedError);
    throw new Error(refinedError.error);
  }

  // update raw tx with signed data
  rawTx.v = Buffer.from(signedTx.v, 'hex');
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
  yield takeEvery(INIT_WALLETS_BALANCES, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeLatest(FETCH_LEDGER_ADDRESSES, fetchLedgerAddresses);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);

  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);

  yield takeLatest(LOAD_PRICES, loadPrices);
  yield takeLatest(LOAD_SUPPORTED_TOKENS, loadSupportedTokens);
  yield takeEvery(INIT_LEDGER, initLedger);
  yield takeEvery(LEDGER_CONNECTED, pollEthApp);
  yield takeEvery(LEDGER_DISCONNECTED, hookLedgerDisconnected);
}
