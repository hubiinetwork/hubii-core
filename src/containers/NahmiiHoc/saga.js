import BalanceTrackerContract from 'nahmii-sdk/lib/balance-tracker-contract';
import nahmii from 'nahmii-sdk';
import { utils } from 'ethers';
import { all, fork, takeEvery, takeLatest, select, put, call, take, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import BigNumber from 'bignumber.js';
import { requestWalletAPI, requestHardwareWalletAPI } from 'utils/request';
import rpcRequest from 'utils/rpcRequest';
import { isAddressMatch } from 'utils/wallet';
import { getIntl } from 'utils/localisation';
import {
  makeSelectWallets,
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import { notify } from 'containers/App/actions';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { makeSelectSupportedAssets } from 'containers/HubiiApiHoc/selectors';
import { makeSelectWalletCurrency, makeSelectLastPaymentChallengeByAddress } from 'containers/NahmiiHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { LOAD_SUPPORTED_TOKENS_SUCCESS } from 'containers/HubiiApiHoc/constants';
import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';
import { ADD_NEW_WALLET } from 'containers/WalletHoc/constants';
import { showDecryptWalletModal } from 'containers/WalletHoc/actions';
import { requestToken } from 'containers/HubiiApiHoc/saga';
import {
  trezorConfirmTxOnDevice,
  trezorConfirmTxOnDeviceDone,
} from 'containers/TrezorHoc/actions';
import {
  ledgerConfirmTxOnDevice,
  ledgerConfirmTxOnDeviceDone,
} from 'containers/LedgerHoc/actions';
import { requestEthTransportActivity } from 'containers/LedgerHoc/saga';
import * as actions from './actions';
import {
  SET_SELECTED_WALLET_CURRENCY,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_DEPOSIT_FAILED,
  NAHMII_DEPOSIT,
  NAHMII_DEPOSIT_ETH,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  MAKE_NAHMII_PAYMENT,
  START_CHALLENGE,
  START_CHALLENGE_SUCCESS,
  SETTLE,
  SETTLE_SUCCESS,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
} from './constants';
import { makeSelectCurrentWallet } from '../WalletHoc/selectors';

export function* deposit({ address, symbol, amount, options }) {
  try {
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    if (wallet.encrypted && !wallet.decrypted) {
      yield put(showDecryptWalletModal(actions.nahmiiDeposit(address, symbol, amount, options)));
      return;
    }
    if (symbol === 'ETH') {
      yield put(actions.nahmiiDepositEth(address, amount, options));
    } else {
      yield put(actions.nahmiiApproveTokenDeposit(address, symbol, amount, options));
      const { approvalSuccess } = yield race({
        approvalSuccess: take(NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS),
        approvalFailed: take(NAHMII_DEPOSIT_FAILED),
      });
      if (approvalSuccess) {
        yield put(actions.nahmiiCompleteTokenDeposit(address, symbol, amount, options));
      }
    }
  } catch (e) {
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}

export function* depositEth({ address, amount, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  try {
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, wallet);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    if (confOnDevice) yield put(confOnDevice);
    console.log(amount.toString(), options, nahmiiWallet.address, nahmiiProvider);
    const { hash } = yield call(() => nahmiiWallet.depositEth(amount, options));
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
    yield put(actions.nahmiiDepositEthSuccess());
    yield put(notify('success', getIntl().formatMessage({ id: 'deposit_success' })));
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}

export function* approveTokenDeposit({ address, symbol, amount, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  try {
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, wallet);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    if (confOnDevice) yield put(confOnDevice);
    const { hash } = yield call(() => nahmiiWallet.approveTokenDeposit(amount, symbol, options));
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
    yield put(actions.nahmiiApproveTokenDepositSuccess());
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}

export function* completeTokenDeposit({ address, symbol, amount, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  try {
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, wallet);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    if (confOnDevice) yield put(confOnDevice);
    const { hash } = yield call(() => nahmiiWallet.completeTokenDeposit(amount, symbol, options));
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
    yield put(actions.nahmiiCompleteTokenDepositSuccess());
    yield put(notify('success', getIntl().formatMessage({ id: 'deposit_success' })));
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}


export function* makePayment({ monetaryAmount, recipient, walletOverride }) {
  let signer;
  let confOnDevice;
  let confOnDeviceDone;
  try {
    const wallet = walletOverride || (yield (select(makeSelectCurrentWalletWithInfo()))).toJS();
    if (wallet.encrypted && !wallet.decrypted) {
      yield put(showDecryptWalletModal(actions.makeNahmiiPayment(monetaryAmount, recipient, walletOverride)));
      yield put(actions.nahmiiPaymentError(new Error(getIntl().formatMessage({ id: 'wallet_encrypted_error' }))));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const nahmiiProvider = network.nahmiiProvider;
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, wallet);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    const payment = new nahmii.Payment(nahmiiWallet, monetaryAmount, wallet.address, recipient);
    if (confOnDevice) yield put(confOnDevice);
    yield call([payment, 'sign']);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call([payment, 'register']);
    yield put(actions.nahmiiPaymentSuccess());
    yield put(notify('success', getIntl().formatMessage({ id: 'deposit_success' })));
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(actions.nahmiiPaymentError(e));
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
  }
}

/*
 * returns object containing an SDK signer, and device confirmation actions to be dispatched
 * if applicable
 */
export function* getSdkWalletSigner(wallet) {
  let signer;
  let confOnDevice;
  let confOnDeviceDone;
  if (wallet.type === 'lns') {
    const ledgerNanoSInfo = yield select(makeSelectLedgerHoc());
    signer = {
      signMessage: async (message) => ledgerSignerSignMessage(message, wallet.derivationPath, ledgerNanoSInfo.get('descriptor')),
      signTransaction: async (message) => ledgerSignerSignTransaction(message, wallet.derivationPath, ledgerNanoSInfo.get('descriptor')),
      address: wallet.address,
    };
    confOnDevice = ledgerConfirmTxOnDevice();
    confOnDeviceDone = ledgerConfirmTxOnDeviceDone();
  } else if (wallet.type === 'trezor') {
    const trezorInfo = yield select(makeSelectTrezorHoc());
    const deviceId = trezorInfo.get('id');
    const path = wallet.derivationPath;
    const publicAddressKeyPair = yield call(requestHardwareWalletAPI, 'getaddress', { id: deviceId, path });
    if (!isAddressMatch(`0x${publicAddressKeyPair.address}`, wallet.address)) {
      throw new Error('PASSPHRASE_MISMATCH');
    }
    signer = {
      signMessage: async (message) => trezorSignerSignMessage(message, deviceId, path),
      signTransaction: async (unresolvedTx) => trezorSignerSignTransaction(unresolvedTx, deviceId, path),
      address: wallet.address,
    };
    confOnDevice = trezorConfirmTxOnDevice();
    confOnDeviceDone = trezorConfirmTxOnDeviceDone();
  } else {
    signer = wallet.decrypted.privateKey;
  }
  return [signer, confOnDevice, confOnDeviceDone];
}

export const trezorSignerSignTransaction = async (unresolvedTx, deviceId, path) => {
  const tx = await utils.resolveProperties(unresolvedTx);
  const trezorTx = { ...tx };
  Object.keys(tx).forEach((k) => {
    let val = tx[k];
    if (k === 'chainId') return;
    val = utils.hexlify(val); // transform into hex
    val = val.substring(2); // remove 0x prefix
    val = (val.length % 2) ? `0${val}` : val; // pad with a leading 0 if uneven
    trezorTx[k] = val;
  });
  trezorTx.toAddress = trezorTx.to;
  const signature = await requestHardwareWalletAPI(
    'signtx',
    {
      id: deviceId,
      path,
      tx: trezorTx,
    }
  );
  const prefixedSig = {
    r: `0x${signature.r}`,
    s: `0x${signature.s}`,
    v: signature.v,
  };
  return utils.serializeTransaction(tx, prefixedSig);
};

export const trezorSignerSignMessage = async (_message, deviceId, path) => {
  let message = _message;
  if (typeof message === 'string') {
    message = await utils.toUtf8Bytes(_message);
  }
  const messageHex = await utils.hexlify(message).substring(2);
  const signedTx = await requestHardwareWalletAPI(
    'signpersonalmessage',
    {
      id: deviceId,
      path,
      message: messageHex,
    }
  );
  return `0x${signedTx.message.signature}`;
};

export const ledgerSignerSignMessage = async (message, path, descriptor) => {
  const signature = await requestEthTransportActivity({
    method: 'signpersonalmessage',
    params: { descriptor, path: path.toString(), message: Buffer.from(message).toString('hex') },
  });
  return utils.joinSignature({
    r: `0x${signature.r}`,
    s: `0x${signature.s}`,
    v: signature.v,
  });
};

export const ledgerSignerSignTransaction = async (unresolvedTx, path, descriptor) => {
  const tx = await utils.resolveProperties(unresolvedTx);
  const serializedTx = utils.serializeTransaction(tx);
  const signature = await requestEthTransportActivity({
    method: 'signtx',
    params: { descriptor, path: path.toString(), rawTxHex: serializedTx.substring(2) },
  });
  const prefixedSig = {
    r: `0x${signature.r}`,
    s: `0x${signature.s}`,
    v: signature.v,
  };
  return utils.serializeTransaction(tx, prefixedSig);
};

export function* loadBalances({ address }, network) {
  if (network.provider._network.name === 'homestead') {
    yield put(actions.loadBalancesSuccess(address, []));
    return;
  }
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const path = `trading/wallets/${address}/balances`;
      const balances = yield call((...args) => requestWalletAPI(...args), path, network);
      // remove currency id to be consistent with the rest of the data in the app.
      // should do an app-wide change once the backend becomes consistent
      const formattedBalances = balances.map((bal) => ({
        balance: bal.amount,
        currency: bal.currency.ct === '0x0000000000000000000000000000000000000000' ? 'ETH' : bal.currency.ct,
      }));
      yield put(actions.loadBalancesSuccess(address, formattedBalances));
    } catch (err) {
      console.log(err); // eslint-disable-line
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadStagingBalances({ address }) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const emptyResponse = [];
      yield put(actions.loadStagingBalancesSuccess(address, emptyResponse));
    } catch (err) {
      console.log(err); // eslint-disable-line
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

// https://stackoverflow.com/questions/48228662/get-token-balance-with-ethereum-rpc
export function* loadStagedBalances({ address }, network, noPoll) {
  if (network.provider._network.name === 'homestead') {
    yield put(actions.loadStagedBalancesSuccess(address, []));
    return;
  }
  let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  if (supportedAssets.loading) {
    yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
    supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  }

  const provider = network.provider;
  const balanceTrackerContract = new BalanceTrackerContract(provider);

  while (true) { // eslint-disable-line no-constant-condition
    try {
      // the first provider in network.provider.providers in an Infura node, which supports RPC calls
      const jsonRpcProvider = provider.providers ? provider.providers[0] : provider;

      const balanceTrackerContractAddress = balanceTrackerContract.address;
      // derive function selector
      const balanceType = yield balanceTrackerContract.stagedBalanceType();
      const funcBytes = utils.solidityKeccak256(['string'], ['get(address,bytes32,address,uint256)']);
      const funcSelector = funcBytes.slice(0, 10);

      // send a batch of RPC requests asking for all staged balances
      // https://www.jsonrpc.org/specification#batch
      const currencyCtList = supportedAssets.assets.map((a) => a.currency);
      const requestBatch = currencyCtList.map((ct) => {
        const currencyAddress = ct === 'ETH' ? '0x0000000000000000000000000000000000000000' : ct;
        // encode arguments, prepare them for being sent
        const encodedArgs = utils.defaultAbiCoder.encode(['address', 'bytes32', 'address', 'int256'], [address, balanceType, currencyAddress, 0]);
        const dataArr = utils.concat([funcSelector, encodedArgs]);
        const data = utils.hexlify(dataArr);
        const params = [{ from: address, to: balanceTrackerContractAddress, data }, 'latest'];
        return {
          method: 'eth_call',
          params,
          id: 42,
          jsonrpc: '2.0',
        };
      });
      // send all requests at once
      const response = yield rpcRequest(jsonRpcProvider.connection.url, JSON.stringify(requestBatch));
      // process the response
      const tokenBals = response.map((item) => new BigNumber(item.result));
      const formattedBalances = tokenBals.reduce((acc, bal, i) => {
        if (!bal.gt('0')) return acc;
        const { currency, symbol } = supportedAssets.assets[i];
        return [...acc, { address, currency, symbol, balance: bal }];
      }, []);
      yield put(actions.loadStagedBalancesSuccess(address, formattedBalances));
    } catch (err) {
      console.log(err); // eslint-disable-line
    } finally {
      if (noPoll) {
        return;
      }
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

//   let confOnDeviceDone;
//   let confOnDevice;
//   let signer;
//   try {
//     const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
//     const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
//     [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, wallet);
//     const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
//     if (confOnDevice) yield put(confOnDevice);
//     const { hash } = yield call(() => nahmiiWallet.approveTokenDeposit(amount, symbol, options));
//     if (confOnDeviceDone) yield put(confOnDeviceDone);
//     yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
//     yield put(actions.nahmiiApproveTokenDepositSuccess());
//   } catch (e) {
//     if (confOnDeviceDone) yield put(confOnDeviceDone);
//     yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
//     yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
//   }

export function* startChallenge({ stageAmount, currency, gasLimit, gasPrice }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;

  try {
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.startChallenge(stageAmount, currency)));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const {nahmiiProvider} = network;
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    const _stageAmount = new nahmii.MonetaryAmount(stageAmount, currency, 0);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    const settlement = new nahmii.Settlement(nahmiiProvider);
    if (confOnDevice) yield put(confOnDevice);
    yield put(notify('info', getIntl().formatMessage({ id: 'checks_before_settling' })));
    const {requiredChallenges} = yield call((...args) => settlement.getRequiredChallengesForIntendedStageAmount(...args), _stageAmount, nahmiiWallet.address);
    yield put(notify('info', getIntl().formatMessage({ id: 'requesting_settle' })));
    if (!requiredChallenges.length) {
      yield put(notify('error', getIntl().formatMessage({ id: 'unable_start_challenges' })));
    }
    for (let requiredChallenge of requiredChallenges) {
        const tx = yield call((...args) => settlement.startByRequiredChallenge(...args), requiredChallenge, nahmiiWallet, {gasLimit, gasPrice});
        yield processTx('start-challenge', nahmiiProvider, tx, nahmiiWallet.address, currency);
    }
  } catch (e) {
    let errorMessage = e.message;
    if (e.asStringified) {
      const nestedErrorMsg = e.asStringified();
      console.error(nestedErrorMsg)
      const isGasExceeded = nestedErrorMsg.match(/gas.*required.*exceeds/i);
      if (isGasExceeded) {
        errorMessage = getIntl().formatMessage({ id: 'gas_limit_too_low' });
      }
    }
    
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: errorMessage })));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
  }
}

export function* settle({ currency, gasLimit, gasPrice }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;

  try {
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.settle(currency)));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const {nahmiiProvider} = network;
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    const settlement = new nahmii.Settlement(nahmiiProvider);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
  
    if (confOnDevice) yield put(confOnDevice);
    yield put(notify('info', getIntl().formatMessage({ id: 'update_settle_stage_balance' })));
    const {settleableChallenges} = yield call((...args) => settlement.getSettleableChallenges(...args), nahmiiWallet.address, currency, 0);
    for (let settleableChallenge of settleableChallenges) {
      const tx = yield call((...args) => settlement.settleBySettleableChallenge(...args), settleableChallenge, nahmiiWallet, {gasLimit, gasPrice});
      yield processTx('settle-payment', nahmiiProvider, tx, walletDetails.address, currency);
    }
  } catch (e) {
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
  }
}

export function* withdraw({ amount, currency }) {
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  if (walletDetails.encrypted && !walletDetails.decrypted) {
    yield put(showDecryptWalletModal(actions.withdraw(amount, currency)));
    return;
  }
  const network = yield select(makeSelectCurrentNetwork());
  const nahmiiProvider = network.provider;
  const _amount = new nahmii.MonetaryAmount(amount, currency, 0);
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
  const tx = yield call((...args) => wallet.withdraw(...args), _amount);

  yield processTx('withdraw', nahmiiProvider, tx, walletDetails.address, currency);
}

export function* processTx(type, provider, tx, address, currency) {
  const actionTargets = {
    success: () => {},
    error: () => {},
    loadTxRequest: () => {},
  };

  if (type === 'settle-payment') {
    actionTargets.success = actions.settleSuccess;
    actionTargets.error = actions.settleError;
    actionTargets.loadTxRequest = actions.loadTxRequestForSettlePaymentDriip;
    yield put(notify('info', getIntl().formatMessage({ id: 'settling_payment' })));
  }

  if (type === 'start-challenge') {
    actionTargets.success = actions.startChallengeSuccess;
    actionTargets.error = actions.startChallengeError;
    actionTargets.loadTxRequest = actions.loadTxRequestForPaymentChallenge;
    yield put(notify('info', getIntl().formatMessage({ id: 'starting_payment_challenge' })));
  }

  if (type === 'withdraw') {
    actionTargets.success = actions.withdrawSuccess;
    actionTargets.error = actions.withdrawError;
    actionTargets.loadTxRequest = actions.loadTxRequestForWithdraw;
    yield put(notify('info', getIntl().formatMessage({ id: 'withdrawing' })));
  }

  yield put(actionTargets.loadTxRequest(address, tx, currency, provider.name));
  const txRes = yield call((...args) => provider.waitForTransaction(...args), tx.hash);
  const txReceipt = yield call((...args) => provider.getTransactionReceipt(...args), txRes.transactionHash);
  if (txReceipt.status === 1) {
    yield put(notify('success', getIntl().formatMessage({ id: 'tx_mined_success' })));
    yield put(actionTargets.success(address, txReceipt, currency));
  } else {
    yield put(notify('error', getIntl().formatMessage({ id: 'tx_mined_error' })));
    yield put(actionTargets.error(address, txReceipt, currency));
  }
}

export function* loadOngoingChallenges({ address }, network, noPoll) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const provider = network.provider;
      const settlement = new nahmii.Settlement(provider);
      const currencyAddress = yield select(makeSelectWalletCurrency());
      const ongoingChallenges = yield call(() => settlement.getOngoingChallenges(address, currencyAddress, 0));
      yield put(actions.loadOngoingChallengesSuccess(address, currencyAddress, ongoingChallenges));
    } catch (err) {
      yield put(actions.loadOngoingChallengesError(address, currencyAddress));
    } finally {
      if (noPoll) {
        return;
      }
      const TWENTY_SEC_IN_MS = 1000 * 59;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadSettleableChallenges({ address }, network, noPoll) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const provider = network.provider;
      const settlement = new nahmii.Settlement(provider);
      const currencyAddress = yield select(makeSelectWalletCurrency());
      const {settleableChallenges} = yield call(() => settlement.getSettleableChallenges(address, currencyAddress, 0));
      yield put(actions.loadSettleableChallengesSuccess(address, currencyAddress, settleableChallenges));
    } catch (err) {
      if (e.asStringified) {
        const nestedErrorMsg = e.asStringified();
        console.error(nestedErrorMsg)
      }
      yield put(actions.loadSettleableChallengesError(address, currencyAddress));
    } finally {
      if (noPoll) {
        return;
      }
      const TWENTY_SEC_IN_MS = 1000 * 59;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadCurrentPaymentChallenge({ address }, network) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = network.provider;
      const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
      const currentChallenge = yield call(() => settlementChallenge.getCurrentPaymentChallenge(address));
      yield put(actions.loadOngoingChallengesSuccess(address, currentChallenge));
    } catch (err) {
      yield put(actions.loadOngoingChallengesError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadCurrentPaymentChallengePhase({ address }, network) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = network.provider;
      const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
      const currentPhase = yield call(() => settlementChallenge.getCurrentPaymentChallengePhase(address));
      yield put(actions.loadCurrentPaymentChallengePhaseSuccess(address, currentPhase));
    } catch (err) {
      yield put(actions.loadCurrentPaymentChallengePhaseError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadCurrentPaymentChallengeStatus({ address }, network) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = network.provider;
      const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
      const currentStatus = yield call(() => settlementChallenge.getCurrentPaymentChallengeStatus(address));
      yield put(actions.loadCurrentPaymentChallengeStatusSuccess(address, currentStatus));
    } catch (err) {
      yield put(actions.loadCurrentPaymentChallengeStatusError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadSettlement({ address }, network) {
  const nahmiiProvider = network.provider;
  const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
  let lastNonce;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const lastSettlementChallenge = (yield select(makeSelectLastPaymentChallengeByAddress(address))).toJS();
      lastNonce = lastSettlementChallenge.challenge.nonce.toNumber();
    } catch (error) {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
      continue; // eslint-disable-line no-continue
    }

    try {
      const settlement = yield call((...args) => settlementChallenge.getSettlementByNonce(...args), lastNonce);
      yield put(actions.loadSettlementSuccess(address, settlement));
    } catch (err) {
      yield put(actions.loadSettlementError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadReceipts({ address }, network) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const path = `trading/wallets/${address}/receipts?`;
      let receipts = yield call((...args) => requestWalletAPI(...args), path, network);
      receipts = receipts.map((r) => ({ ...r, operatorId: 0 }));
      yield put(actions.loadReceiptsSuccess(address, receipts));
    } catch (err) {
      yield put(actions.loadReceiptsError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

// manages calling of complex ethOperations
export function* challengeStatusOrcestrator() {
  try {
    while (true) { // eslint-disable-line no-constant-condition
      yield requestToken();

      const network = yield select(makeSelectCurrentNetwork());
      const wallets = yield select(makeSelectWallets());
      const allTasks = yield all([
        ...wallets.map((wallet) => fork(loadBalances, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadStagedBalances, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadStagingBalances, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadOngoingChallenges, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadSettleableChallenges, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadCurrentPaymentChallenge, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadCurrentPaymentChallengePhase, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadCurrentPaymentChallengeStatus, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadReceipts, { address: wallet.get('address') }, network)),
        // ...wallets.map((wallet) => fork(loadSettlement, { address: wallet.get('address') }, network)),
      ]);

      const ONE_MINUTE_IN_MS = 60 * 1000;
      yield race({
        timer: call(delay, ONE_MINUTE_IN_MS),
        override: take([CHANGE_NETWORK, ADD_NEW_WALLET]),
      });
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

export function* hookTxSuccessOperations({address}) {
  const network = yield select(makeSelectCurrentNetwork());
  const walletAddress = address || (yield select(makeSelectCurrentWallet())).get('address');
  yield loadStagedBalances({address: walletAddress}, network, true);
  yield loadOngoingChallenges({address: walletAddress}, network, true);
  yield loadSettleableChallenges({address: walletAddress}, network, true);
}

export default function* listen() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, challengeStatusOrcestrator);
  yield takeLatest(NAHMII_DEPOSIT, deposit);
  yield takeLatest(NAHMII_DEPOSIT_ETH, depositEth);
  yield takeLatest(NAHMII_APPROVE_TOKEN_DEPOSIT, approveTokenDeposit);
  yield takeLatest(NAHMII_COMPLETE_TOKEN_DEPOSIT, completeTokenDeposit);
  yield takeEvery(MAKE_NAHMII_PAYMENT, makePayment);
  yield takeEvery(START_CHALLENGE, startChallenge);
  yield takeEvery(SETTLE, settle);
  yield takeEvery(WITHDRAW, withdraw);
  yield takeEvery(START_CHALLENGE_SUCCESS, hookTxSuccessOperations);
  yield takeEvery(SETTLE_SUCCESS, hookTxSuccessOperations);
  yield takeEvery(WITHDRAW_SUCCESS, hookTxSuccessOperations);
  yield takeEvery(SET_SELECTED_WALLET_CURRENCY, hookTxSuccessOperations);
}
