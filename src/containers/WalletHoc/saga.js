import {
  takeEvery,
  put,
  call,
  select,
} from 'redux-saga/effects';
import { Wallet, Signer, utils, Contract } from 'ethers';
import { fromRpcSig } from 'ethereumjs-util';

import { notify } from 'containers/App/actions';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { getIntl } from 'utils/localisation';
import {
  ERC20ABI,
  isHardwareWallet,
  isAddressMatch,
  prependHexToAddress,
} from 'utils/wallet';
import generateRawTx from 'utils/generateRawTx';

import {
  signTxByLedger,
  signPersonalMessageByLedger,
} from 'containers/LedgerHoc/saga';

import {
  signTxByTrezor,
  signPersonalMessageByTrezor,
} from 'containers/TrezorHoc/saga';

import {
  makeSelectCurrentWalletWithInfo,
  makeSelectWallets,
  makeSelectCurrentDecryptionCallback,
} from './selectors';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  TRANSFER,
  TRANSFER_ETHER,
  TRANSFER_ERC20,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  CREATE_WALLET_FROM_KEYSTORE,
  DECRYPT_WALLET_SUCCESS,
  DECRYPT_WALLET_FAILURE,
  LOCK_WALLET,
} from './constants';

import {
  addNewWallet,
  createWalletFailed,
  createWalletSuccess,
  decryptWalletFailed,
  decryptWalletSuccess,
  showDecryptWalletModal,
  transferSuccess,
  transferError,
  transferEther as transferEtherAction,
  transferERC20 as transferERC20Action,
  hideDecryptWalletModal,
  transfer as transferAction,
} from './actions';


// Creates a new software wallet
export function* createWalletFromMnemonic({ name, mnemonic, derivationPath, password }) {
  try {
    if (!name || !derivationPath || !password || !mnemonic) throw new Error(getIntl().formatMessage({ id: 'invalid_param_error' }));
    const decryptedWallet = Wallet.fromMnemonic(mnemonic, derivationPath);
    const encryptedWallet = yield call((...args) => decryptedWallet.encrypt(...args), password);
    yield put(createWalletSuccess(name, encryptedWallet, decryptedWallet));
  } catch (e) {
    yield put(notify('error', getIntl().formatMessage({ id: 'import_wallet_failed_error' }, { message: getIntl().formatMessage({ id: e.message }) })));
    yield put(createWalletFailed(e));
  }
}

export function* createWalletFromPrivateKey({ privateKey, name, password }) {
  try {
    if (!name || !privateKey || !password) throw new Error(getIntl().formatMessage({ id: 'invalid_param_error' }));
    let prefixedPrivateKey = privateKey;
    if (!prefixedPrivateKey.startsWith('0x')) prefixedPrivateKey = `0x${privateKey}`;
    const decryptedWallet = new Wallet(prefixedPrivateKey);
    const encryptedWallet = yield call((...args) => decryptedWallet.encrypt(...args), password);
    yield put(createWalletSuccess(name, encryptedWallet, decryptedWallet));
    yield put(notify('warning', getIntl().formatMessage({ id: 'wallet_private_key_warning' })));
  } catch (e) {
    yield put(notify('error', getIntl().formatMessage({ id: 'import_wallet_failed_error' }, { message: getIntl().formatMessage({ id: e.message }) })));
    yield put(createWalletFailed(e));
  }
}

export function* createWalletFromKeystore({ name, keystore }) {
  try {
    if (!name || !keystore) throw new Error(getIntl().formatMessage({ id: 'invalid_param_error' }));
    const json = JSON.parse(keystore);
    if (!json.address || !json.id || !json.version) {
      throw new Error(getIntl().formatMessage({ id: 'invalid_keystore_error' }));
    }
    const address = json.address;
    yield put(createWalletSuccess(name, keystore, null, prependHexToAddress(address)));
  } catch (e) {
    yield put(notify('error', getIntl().formatMessage({ id: 'import_keystore_failed_error' })));
    yield put(createWalletFailed(e));
  }
}

// Decrypt a software wallet using a password
export function* decryptWallet({ address, encryptedWallet, password }) {
  let callbackAction = yield select(makeSelectCurrentDecryptionCallback());
  try {
    if (!address) throw new Error(getIntl().formatMessage({ id: 'address_undefined_error' }));
    const res = yield call([Wallet, 'fromEncryptedJson'], encryptedWallet, password);
    if (!res.privateKey) throw res;
    const decryptedWallet = res;
    yield put(decryptWalletSuccess(address, decryptedWallet));
    yield put(hideDecryptWalletModal());
    if (callbackAction) {
      callbackAction = callbackAction.toJS();
      // the transfer saga recieves the wallet via an action. if the callback action
      // had a wallet property, add the decrypted field.
      // ideally instead of this, the wallet property should be taken from the store
      // via a selector, instead of through the callback.
      if (callbackAction.wallet) {
        callbackAction.wallet.decrypted = decryptedWallet;
      }
      yield put(callbackAction);
    }
  } catch (e) {
    const intlErr = e.message === 'invalid password'
      ? new Error(getIntl().formatMessage({ id: 'invalid_password' }))
      : new Error(e.message);
    yield put(decryptWalletFailed(intlErr));
  }
}

export function* transfer({ token, wallet, toAddress, amount, gasPrice, gasLimit, contractAddress }) {
  if (wallet.encrypted && !wallet.decrypted) {
    yield put(showDecryptWalletModal(transferAction({ wallet, token, toAddress, amount, gasPrice, gasLimit, contractAddress })));
    yield put(transferError(new Error(getIntl().formatMessage({ id: 'wallet_encrypted_error' }))));
    return;
  }

  try {
    // convert BigNumbers to the etherjs version of BigNumber here so the toHexString() method
    // can be used later
    const amountConverted = utils.bigNumberify(amount.toFixed());
    const gasPriceConverted = utils.bigNumberify(gasPrice.toString());

    yield put(notify('info', getIntl().formatMessage({ id: 'send_transaction_info' })));
    if (token === 'ETH') {
      yield put(transferEtherAction({ toAddress, amount: amountConverted, gasPrice: gasPriceConverted, gasLimit }));
    } else if (contractAddress) {
      yield put(transferERC20Action({ token, toAddress, amount: amountConverted, gasPrice: gasPriceConverted, gasLimit, contractAddress }));
    }
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: getIntl().formatMessage({ id: error.message }) })));
  }
}

export function* transferEther({ toAddress, amount, gasPrice, gasLimit }) {
  try {
    let transaction;
    const options = { gasPrice, gasLimit };
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());

    if (isHardwareWallet(walletDetails.type)) {
      transaction = yield call(sendTransactionForHardwareWallet, { toAddress, amount, gasPrice, gasLimit });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
      transaction = yield call((...args) => etherWallet.sendTransaction(...args), { to: toAddress, value: amount, ...options });
    }
    yield call(() => nahmiiProvider.getTransactionConfirmation(transaction.hash));
    yield put(transferSuccess(transaction, 'ETH'));
    yield put(notify('success', getIntl().formatMessage({ id: 'sent_transaction_success' })));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: getIntl().formatMessage({ id: error.message }) })));
  }
}

export function* transferERC20({ token, contractAddress, toAddress, amount, gasPrice, gasLimit }) {
  const contractAbiFragment = ERC20ABI;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
  let transaction;
  try {
    const options = { gasPrice, gasLimit };
    if (isHardwareWallet(walletDetails.type)) {
      const tx = yield call(generateContractTransaction, {
        contractAddress,
        abi: ERC20ABI,
        execute: ['transfer', [toAddress, amount, options]],
        provider: nahmiiProvider,
      });
      transaction = yield call(sendTransactionForHardwareWallet, { ...tx, amount: tx.value, toAddress: tx.to });
    } else {
      const etherWallet = new Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
      const contract = new Contract(contractAddress, contractAbiFragment, etherWallet);
      transaction = yield call((...args) => contract.transfer(...args), toAddress, amount, options);
    }

    if (!transaction) {
      throw new Error(getIntl().formatMessage({ id: 'send_transaction_failed_error' }));
    }
    yield call(function getTransactionConfirmation() { return nahmiiProvider.getTransactionConfirmation(transaction.hash); });// eslint-disable-line prefer-arrow-callback
    yield put(transferSuccess(transaction, token));
    yield put(notify('success', getIntl().formatMessage({ id: 'sent_transaction_success' })));
  } catch (error) {
    yield put(transferError(error));
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: getIntl().formatMessage({ id: error.message }) })));
  }
}

// hook into etherjs's sign function get generated erc20 transaction object for further process
export function generateContractTransaction({ contractAddress, abi, execute, provider }) {
  return new Promise((resolve) => {
    const signer = new Signer();
    signer.provider = provider;
    signer.sendTransaction = async (tx) => {
      tx.to.then((address) => {
        resolve({
          ...tx,
          to: address.toLowerCase(),
        });
      });
    };

    const contract = new Contract(contractAddress, abi, signer);
    const func = execute[0];
    const args = execute[1];

    contract[func](...args).catch(() => {});
  });
}

export function* hookNewWalletCreated({ newWallet }) {
  const wallets = yield select(makeSelectWallets());
  const existAddress = wallets.find((wallet) => isAddressMatch(wallet.get('address'), newWallet.address));
  const existName = wallets.find((wallet) => wallet.get('name') === newWallet.name);
  if (existAddress) {
    return yield put(notify('error', getIntl().formatMessage({ id: 'wallet_address_exist_error' }, { address: newWallet.address })));
  }
  if (existName) {
    return yield put(notify('error', getIntl().formatMessage({ id: 'wallet_name_exist_error' }, { name: newWallet.name })));
  }
  yield put(addNewWallet(newWallet));
  return yield put(notify('success', getIntl().formatMessage({ id: 'create_wallet_success' }, { name: newWallet.name })));
}

export function* sendTransactionForHardwareWallet({ toAddress, amount, data, nonce, gasPrice, gasLimit }) {
  const currentWalletWithInfo = yield select(makeSelectCurrentWalletWithInfo());
  const network = yield select(makeSelectCurrentNetwork());
  const provider = network.nahmiiProvider;
  const walletDetails = currentWalletWithInfo.toJS();
  let nonceValue = nonce;
  if (!nonceValue) {
    nonceValue = yield call([provider, 'getTransactionCount'], walletDetails.address, 'pending');
  }
  const amountHex = amount ? amount.toHexString() : '0x00';
  const chainId = provider.network.chainId;

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
  const { hash } = yield call([provider, 'sendTransaction'], txHex);
  // get transaction details
  return yield call([provider, 'getTransaction'], hash);
}

export function* signPersonalMessage({ message, wallet }) {
  if (wallet.type === 'software') {
    const etherWallet = new Wallet(wallet.decrypted.privateKey);
    const rpcSig = yield call([etherWallet, 'signMessage'], message);
    const bufferParams = fromRpcSig(rpcSig);
    return {
      v: bufferParams.v,
      r: `0x${bufferParams.r.toString('hex')}`,
      s: `0x${bufferParams.s.toString('hex')}`,
    };
  }
  if (wallet.type === 'lns') {
    return yield signPersonalMessageByLedger(wallet, message);
  }
  if (wallet.type === 'trezor') {
    return yield signPersonalMessageByTrezor(message, wallet);
  }
  throw new Error('invalid wallet');
}

export function* tryDecryptHook() {
  yield put(notify('info', getIntl().formatMessage({ id: 'unlock_wallet_info' })));
}

export function* decryptSuccessHook() {
  yield put(notify('success', getIntl().formatMessage({ id: 'unlock_wallet_success' })));
}

export function* decryptFailedHook({ error }) {
  yield put(notify('error', getIntl().formatMessage({ id: 'unlock_wallet_failed_error' }, { message: error.message })));
}

export function* lockHook() {
  yield put(notify('success', getIntl().formatMessage({ id: 'wallet_locked' })));
}

// Root watcher
export default function* walletHoc() {
  yield takeEvery(CREATE_WALLET_FROM_MNEMONIC, createWalletFromMnemonic);
  yield takeEvery(DECRYPT_WALLET, decryptWallet);
  yield takeEvery(TRANSFER, transfer);
  yield takeEvery(TRANSFER_ETHER, transferEther);
  yield takeEvery(TRANSFER_ERC20, transferERC20);
  yield takeEvery(CREATE_WALLET_FROM_PRIVATE_KEY, createWalletFromPrivateKey);
  yield takeEvery(CREATE_WALLET_SUCCESS, hookNewWalletCreated);
  yield takeEvery(CREATE_WALLET_FROM_KEYSTORE, createWalletFromKeystore);
  yield takeEvery(DECRYPT_WALLET_SUCCESS, decryptSuccessHook);
  yield takeEvery(DECRYPT_WALLET_FAILURE, decryptFailedHook);
  yield takeEvery(DECRYPT_WALLET, tryDecryptHook);
  yield takeEvery(LOCK_WALLET, lockHook);
}
