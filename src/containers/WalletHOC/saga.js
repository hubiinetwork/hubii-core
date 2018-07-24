import { eventChannel, delay } from 'redux-saga';
import { takeLatest, takeEvery, put, call, select, race, take } from 'redux-saga/effects';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
// import Web3 from 'web3';
import { Wallet, utils, providers, Contract } from 'ethers';

import { notify } from 'containers/App/actions';

import {
  makeSelectWalletList,
  makeSelectCurrentWalletDetails,
  makeSelectWallets,
  makeSelectLedgerNanoSInfo,
} from './selectors';
import { requestWalletAPI } from '../../utils/request';
import { ERC20ABI, EthNetworkProvider, getTransaction, getTransactionCount, sendTransaction } from '../../utils/wallet';

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
  FETCH_LEDGER_ADDRESSES,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  INIT_LEDGER,
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
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
  ledgerConnected,
  ledgerDisconnected,
  ledgerEthAppConnected,
  ledgerEthAppDisconnected,
  ledgerError,
  fetchedLedgerAddress,
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  transactionConfirmed,
  hideDecryptWalletModal,
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
  const requestPath = `ethereum/wallets/${address}/balances`;
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
    yield put(updateBalancesAction(address, { currency: 'ETH', balance: updates.newBalance.toString() }));
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
  let transaction;
  const options = { gasPrice, gasLimit };
  const walletDetails = yield select(makeSelectCurrentWalletDetails());

  try {
    if (walletDetails.type === 'lns') {
      transaction = yield call(sendTransactionByLedger, { toAddress, amount, gasPrice, gasLimit });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey);
      etherWallet.provider = EthNetworkProvider;
      transaction = yield call((...args) => etherWallet.send(...args), toAddress, amount, options);
    }
    console.log('tx', transaction);
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
// export function* ledgerSignTxn({ derivationPath, rawTx }) {
//   try {
//     yield put(stopLedgerSync());
//     const transport = yield LedgerTransport.create();
//     const eth = new Eth(transport);
//     return yield eth.signTransaction(derivationPath, rawTx);
//   } catch (e) {
//     yield put(ledgerError('Error signing transaction: ', e));
//     return -1;
//   } finally {
//     yield put(startLedgerSync());
//   }
// }

// Creates an eventChannel to listen to Ledger events
export const ledgerChannel = () => eventChannel((listener) => {
  const sub = LedgerTransport.listen({
    next: (e) => {
      console.log('chan next', new Date(), e);
      return listener(e);
    },
    error: (e) => {
      console.log('chan error', new Date(), e);
      return listener(e);
    },
    complete: (e) => {
      console.log('chan complete', new Date(), e);
      return listener(e);
    },
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
  console.log('init eth channel');
  const iv = setInterval(() => {
    // check connection status from store
    // if the ledger with the descriptor disconnected, end this channel

    createEthTransportActivity(descriptor, (ethTransport) => ethTransport.getAddress('m/44\'/60\'/0\'/0')).then((address) => {
      listener({ connected: true, address });
    }).catch((err) => {
      console.log('eth act', err);
      listener({ connected: false, error: err });
    });
  }, 2000);
  return () => {
    console.log('close eth channel');
    clearInterval(iv);
  };
});

export function* pollEthApp({ descriptor }) {
  const channel = yield call(ledgerEthChannel, descriptor);
  addEthChannel(descriptor, channel);
  while (true) {
    try {
      const status = yield take(channel);
      if (status.connected) {
        removeEthChannel(descriptor);
        yield put(ledgerEthAppConnected(descriptor, status.address.publicKey));

        // const paths = [];
        // for (let i = 0; i < 20; i++) {
        //   paths.push(`m/44\'/60\'/0\'/${i}`);
        // }
        // yield put(fetchLedgerAddressesAction(paths, status.ethTransport));
      } else {
        yield put(ledgerEthAppDisconnected(descriptor));
        yield put(ledgerError(status.error));
      }
    } catch (error) {
      console.log('poll', error);
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
      console.log('msg', msg);
      if (msg.type === 'remove') {
        const { timeout } = yield race({
          msg: take(chan),
          timeout: call(delay, 1000),
        });
        if (timeout) {
          // console.log('close chan')
          // chan.close()
          yield put(ledgerDisconnected(msg.descriptor));
          continue; // eslint-disable-line no-continue
          // throw new Error('Disconnected');
        }
      }

      // const ethchan = yield call(ledgerEthChannel, msg.descriptor);
      yield put(ledgerConnected(msg.descriptor));
      // const transport = yield call(createTransport);
      // const eth = yield call(newEth, transport);
      // const address = yield call(eth.getAddress, "m/44'/60'/0'/0");
      // const id = address.publicKey;
      // yield put(ledgerEthAppConnected(id));
      // yield put(ledgerEthAppConnected());
    } catch (e) {
      console.log('error', e);
      yield put(ledgerError(e));
    }
  }
}

// Dispatches the address for every derivation path in the input
export function* fetchLedgerAddresses({ derivationPaths }) {
  try {
    // yield delay(1000); // Wait for any ongoing operations to clear
    // transport = yield call(createTransport);
    // const eth = yield call(newEth, transport);
    const ledgerStatus = yield select(makeSelectLedgerNanoSInfo());
    if (!ledgerStatus.get('descriptor')) {
      throw new Error('no descriptor available');
    }
    const descriptor = ledgerStatus.get('descriptor');
    for (let i = 0; i < derivationPaths.length; i += 1) {
      const path = derivationPaths[i];
      const publicAddressKeyPair = yield createEthTransportActivity(descriptor, async (ethTransport) => ethTransport.getAddress(path));
      console.log(path, publicAddressKeyPair.address);
      yield put(fetchedLedgerAddress(path, publicAddressKeyPair.address));
    }
  } catch (error) {
    console.log('fetch address error', error);
    put(ledgerError('Error fetching address'));
  }
}

export function* sendTransactionByLedger({ toAddress, amount, gasPrice, gasLimit }) {
  const walletDetails = yield select(makeSelectCurrentWalletDetails());

  const nonce = yield call(getTransactionCount, walletDetails.address);
  // generate raw tx for ledger nano to sign
  const rawTx = generateRawTx({
    toAddress,
    amount,
    gasPrice,
    gasLimit,
    nonce,
    chainId: EthNetworkProvider.chainId,
  });
  // changes to the raw tx before signing by ledger nano
  rawTx.raw[6] = Buffer.from([3]);
  rawTx.raw[7] = Buffer.from([]);
  rawTx.raw[8] = Buffer.from([]);
  const rawTxHex = rawTx.serialize().toString('hex');

  let signedTx;
  try {
    yield put(notify('info', 'Verify transaction details on your Ledger'));
    signedTx = yield call(
      createEthTransportActivity,
      walletDetails.ledgerNanoSInfo.descriptor,
      (ethTransport) => ethTransport.signTransaction(walletDetails.derivationPath, rawTxHex)
    );
  } catch (e) {
    console.log(e.message);
    yield put(ledgerError('Error making transaction: ', e));
    throw e;
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
  yield takeEvery(LOAD_WALLETS_SUCCESS, initWalletsBalances);
  yield takeEvery(LOAD_WALLET_BALANCES, loadWalletBalancesSaga);
  yield takeLatest(FETCH_LEDGER_ADDRESSES, fetchLedgerAddresses);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);
  yield takeEvery(TRANSFER_SUCCESS, waitTransactionHash);
  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);
  yield takeEvery(LISTEN_TOKEN_BALANCES, listenBalances);
  yield takeEvery(INIT_LEDGER, initLedger);
  yield takeEvery(LEDGER_CONNECTED, pollEthApp);
  yield takeEvery(LEDGER_DISCONNECTED, hookLedgerDisconnected);
}
