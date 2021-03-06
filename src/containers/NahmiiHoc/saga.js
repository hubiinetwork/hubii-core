import nahmii from 'nahmii-sdk';
import BalanceTrackerContract from 'nahmii-sdk/lib/wallet/balance-tracker-contract';
import DriipSettlementChallengeContract from 'nahmii-sdk/lib/settlement/driip-settlement-challenge-contract';
import { utils } from 'ethers';
import { all, fork, takeEvery, takeLatest, select, put, call, take, cancel, race } from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import BigNumber from 'bignumber.js';
import { requestHardwareWalletAPI } from 'utils/request';
import rpcRequest from 'utils/rpcRequest';
import { isAddressMatch } from 'utils/wallet';
import { logErrorMsg } from 'utils/friendlyErrors';
import { getIntl } from 'utils/localisation';
import {
  makeSelectWallets,
  makeSelectCurrentWallet,
} from 'containers/WalletHoc/selectors';
import { notify } from 'containers/App/actions';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { makeSelectSupportedAssets } from 'containers/HubiiApiHoc/selectors';
import {
  makeSelectWalletCurrency,
  makeSelectSettlementsForCurrentWalletCurrency,
} from 'containers/NahmiiHoc/selectors';
import { makeSelectCurrentWalletWithInfo } from 'containers/NahmiiHoc/combined-selectors';
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
  MAKE_NAHMII_PAYMENT_SUCCESS,
  SETTLE,
  SETTLE_SUCCESS,
  STAGE,
  STAGE_SUCCESS,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  RELOAD_SETTLEMENT_STATES,
  LOAD_CLAIMABLE_FEES,
  CLAIM_FEES_FOR_ACCRUALS,
  LOAD_WITHDRAWABLE_FEES,
  WITHDRAW_FEES,
} from './constants';

function waitForTransaction(provider, ...args) { return provider.waitForTransaction(...args); }
function getTransactionReceipt(provider, ...args) { return provider.getTransactionReceipt(...args); }

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
        approvalSuccess: take((action) =>
          action.type === NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS &&
          action.address === address &&
          action.symbol === symbol
        ),
        approvalFailed: take((action) =>
          action.type === NAHMII_DEPOSIT_FAILED &&
          action.address === address &&
          action.symbol === symbol
        ),
      });
      if (approvalSuccess) {
        yield put(actions.nahmiiCompleteTokenDeposit(address, symbol, amount, options));
      }
    }
  } catch (e) {
    yield put(actions.nahmiiDepositFailed(address, symbol, `An error occured: ${e.message}`));
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
    const { hash } = yield call(nahmiiWallet.depositEth.bind(nahmiiWallet), amount.toFixed(), options);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call(nahmiiProvider.getTransactionConfirmation.bind(nahmiiProvider), hash);
    yield put(actions.nahmiiDepositEthSuccess(address));
    yield put(notify('success', getIntl().formatMessage({ id: 'deposit_success' })));
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    yield put(actions.nahmiiDepositFailed(address, 'ETH', `An error occured: ${e.message}`));
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
    const { hash } = yield call(nahmiiWallet.approveTokenDeposit.bind(nahmiiWallet), amount.toFixed(), symbol, options);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call(nahmiiProvider.getTransactionConfirmation.bind(nahmiiProvider), hash);
    yield put(actions.nahmiiApproveTokenDepositSuccess(address, symbol));
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    yield put(actions.nahmiiDepositFailed(address, symbol, `An error occured: ${e.message}`));
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
    const { hash } = yield call(nahmiiWallet.completeTokenDeposit.bind(nahmiiWallet), amount.toFixed(), symbol, options);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call(nahmiiProvider.getTransactionConfirmation.bind(nahmiiProvider), hash);
    yield put(actions.nahmiiCompleteTokenDepositSuccess(address, symbol));
    yield put(notify('success', getIntl().formatMessage({ id: 'deposit_success' })));
  } catch (e) {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    yield put(actions.nahmiiDepositFailed(address, symbol, `An error occured: ${e.message}`));
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

    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());

    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, wallet);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    const payment = new nahmii.Payment(monetaryAmount, wallet.address, recipient, nahmiiWallet);
    if (confOnDevice) yield put(confOnDevice);
    yield call([payment, 'sign']);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call([payment, 'register']);
    yield put(actions.nahmiiPaymentSuccess());
    yield put(notify('success', getIntl().formatMessage({ id: 'sent_transaction_success' })));
  } catch (e) {
    logErrorMsg(e);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield put(actions.nahmiiPaymentError(e));
    if (e instanceof nahmii.InsufficientFundsError) {
      yield put(notify('error', getIntl().formatMessage({ id: 'nahmii_transfer_insufficient_funds_error' }, { minimumBalance: e.minimumBalance })));
    } else {
      yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: e.message })));
    }
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
    if (!isAddressMatch(nahmii.utils.prefix0x(publicAddressKeyPair.address), wallet.address)) {
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
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const { nahmiiProvider } = network;
      const balances = yield call((...args) => nahmiiProvider.getNahmiiBalances(...args), address);

      const availableBalances = balances.map((bal) => ({
        balance: bal.amountAvailable,
        currency: bal.currency.ct,
      }));
      const stagingBalances = balances.map((bal) => {
        const officialBalanceBN = new BigNumber(bal.amount);
        const availableBalanceBN = new BigNumber(bal.amountAvailable);
        const stagingBalanceBN = officialBalanceBN.minus(availableBalanceBN);
        return {
          balance: stagingBalanceBN.toString(),
          currency: bal.currency.ct,
        };
      });

      yield put(actions.loadBalancesSuccess(address, availableBalances));
      yield put(actions.loadStagingBalancesSuccess(address, stagingBalances));
    } catch (err) {
      yield put(actions.loadBalancesError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadStagingBalances({ address }, network) {
  if (network.provider._network.chainId === 1 || network.provider._network.chainId === 3) {
    yield put(actions.loadStagingBalancesSuccess(address, []));
    return;
  }
  let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  if (supportedAssets.loading) {
    yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
    supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  }

  const { nahmiiProvider } = network;
  const driipSettlementChallengeContract = new DriipSettlementChallengeContract(nahmiiProvider);

  while (true) { // eslint-disable-line no-constant-condition
    try {
      const driipSettlementChallengeContractAddress = driipSettlementChallengeContract.address;

      // derive function selector
      const funcBytes = utils.solidityKeccak256(['string'], ['proposalStageAmount(address,address,uint256)']);
      const funcSelector = funcBytes.slice(0, 10);

      // send a batch of RPC requests asking for all staging balances
      // https://www.jsonrpc.org/specification#batch
      const currencyCtList = supportedAssets.assets.map((a) => a.currency);
      const requestBatch = currencyCtList.map((ct) => {
        // encode arguments, prepare them for being sent
        const encodedArgs = utils.defaultAbiCoder.encode(['address', 'address', 'int256'], [address, ct, 0]);
        const dataArr = utils.concat([funcSelector, encodedArgs]);
        const data = utils.hexlify(dataArr);
        const params = [{ from: address, to: driipSettlementChallengeContractAddress, data }, 'latest'];
        return {
          method: 'eth_call',
          params,
          id: 42,
          jsonrpc: '2.0',
        };
      });
      // send all requests at once
      const response = yield rpcRequest(nahmiiProvider.connection.url, JSON.stringify(requestBatch));

      // process the response
      const formattedBalances = response.reduce((acc, { result }, i) => {
        // result is the hex balance. if the response comes back as '0x', it actually means 0.
        if (result === '0x') return acc;
        const { currency, symbol } = supportedAssets.assets[i];
        return [...acc, { address, currency, symbol, balance: new BigNumber(result || 0) }];
      }, []);
      yield put(actions.loadStagingBalancesSuccess(address, formattedBalances));
    } catch (err) {
      yield put(actions.loadStagingBalancesError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

// https://stackoverflow.com/questions/48228662/get-token-balance-with-ethereum-rpc
export function* loadStagedBalances({ address }, network, noPoll) {
  let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  if (supportedAssets.loading) {
    yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
    supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  }

  const { nahmiiProvider } = network;

  while (true) { // eslint-disable-line no-constant-condition
    try {
      const balanceTrackerContract = new BalanceTrackerContract(nahmiiProvider);
      const balanceTrackerContractAddress = balanceTrackerContract.address;
      // derive function selector
      const balanceType = yield balanceTrackerContract.stagedBalanceType();
      const funcBytes = utils.solidityKeccak256(['string'], ['get(address,bytes32,address,uint256)']);
      const funcSelector = funcBytes.slice(0, 10);

      // send a batch of RPC requests asking for all staged balances
      // https://www.jsonrpc.org/specification#batch
      const currencyCtList = supportedAssets.assets.map((a) => a.currency);
      const requestBatch = currencyCtList.map((ct) => {
        // encode arguments, prepare them for being sent
        const encodedArgs = utils.defaultAbiCoder.encode(['address', 'bytes32', 'address', 'int256'], [address, balanceType, ct, 0]);
        // const encodedArgs = utils.defaultAbiCoder.encode(['address', 'int256', 'int256'], [address, currencyId, 0]);
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
      const response = yield rpcRequest(nahmiiProvider.connection.url, JSON.stringify(requestBatch));
      // process the response
      const tokenBals = response.map((item) => new BigNumber(item.result));
      const formattedBalances = tokenBals.reduce((acc, bal, i) => {
        if (!bal.gt('0')) return acc;
        const { currency, symbol } = supportedAssets.assets[i];
        return [...acc, { address, currency, symbol, balance: bal }];
      }, []);
      yield put(actions.loadStagedBalancesSuccess(address, formattedBalances));
    } catch (err) {
      yield put(actions.loadStagedBalancesError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
    if (noPoll) {
      return;
    }
  }
}

export function* settle({ stageAmount, currency, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  const { gasLimit, gasPrice } = options;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  try {
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.settle(walletDetails.address, currency, stageAmount, options)));
      yield put(actions.settleError(walletDetails.address, currency));
      return;
    }

    const network = yield select(makeSelectCurrentNetwork());
    const { nahmiiProvider } = network;

    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    const _stageAmount = nahmii.MonetaryAmount.from(stageAmount.toFixed(), currency, 0);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    const settlementFactory = new nahmii.SettlementFactory(nahmiiProvider);
    yield put(notify('info', getIntl().formatMessage({ id: 'checks_before_settling' })));

    const requiredSettlements = yield call(settlementFactory.calculateRequiredSettlements.bind(settlementFactory), nahmiiWallet.address, _stageAmount);

    if (!requiredSettlements.length) {
      yield put(notify('error', getIntl().formatMessage({ id: 'unable_start_challenges' })));
      yield put(actions.settleError(walletDetails.address, currency));
      return;
    }

    yield put(notify('info', getIntl().formatMessage({ id: 'requesting_settle' })));
    for (let i = 0; i < requiredSettlements.length; i += 1) {
      const requiredSettlement = requiredSettlements[i];
      if (confOnDevice) yield put(confOnDevice);
      const tx = yield call(requiredSettlement.start.bind(requiredSettlement), nahmiiWallet, { gasLimit, gasPrice });
      if (confOnDeviceDone) yield put(confOnDeviceDone);
      yield processTx('settle', nahmiiProvider, tx, nahmiiWallet.address, currency);
    }

    yield put(actions.startRequiredSettlementsSuccess(nahmiiWallet.address, currency));
  } catch (e) {
    let errorMessage = logErrorMsg(e);
    [
      [/gas.*required.*exceeds/i, 'gas_limit_too_low'],
      [/out.*of.*gas/i, 'gas_limit_too_low'],
      [/cover.*full.*amount/i, 'unable_settle'],
      [/settlements.*currently.*disabled/i, 'settlements_disabled'],
    ].forEach(([regex, messageId]) => {
      if (logErrorMsg(e).match(regex)) {
        errorMessage = getIntl().formatMessage({ id: messageId });
      }
    });

    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: errorMessage })));
    yield put(actions.settleError(walletDetails.address, currency));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
  }
}

export function* stage({ address, currency, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  const { gasLimit, gasPrice } = options;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  try {
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.stage(address, currency, options)));
      yield put(actions.stageError(walletDetails.address, currency));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const { nahmiiProvider } = network;
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    const settlementFactory = new nahmii.SettlementFactory(nahmiiProvider);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);

    yield put(notify('info', getIntl().formatMessage({ id: 'checks_before_confirming_settle' })));
    const settlements = yield call(settlementFactory.getAllSettlements.bind(settlementFactory), nahmiiWallet.address, currency);
    const stageableSettlements = settlements.filter((s) => s.isStageable);

    for (let i = 0; i < stageableSettlements.length; i += 1) {
      if (confOnDevice) yield put(confOnDevice);
      const stageableSettlement = stageableSettlements[i];
      const tx = yield call(stageableSettlement.stage.bind(stageableSettlement), nahmiiWallet, { gasLimit, gasPrice });
      if (confOnDeviceDone) yield put(confOnDeviceDone);
      yield processTx('stage', nahmiiProvider, tx, walletDetails.address, currency);
    }

    yield put(actions.stageAllSettlementsSuccess(nahmiiWallet.address, currency));
  } catch (e) {
    let errorMessage = logErrorMsg(e);
    if (errorMessage.match(/gas.*required.*exceeds/i) || errorMessage.match(/out.*of.*gas/i)) {
      errorMessage = getIntl().formatMessage({ id: 'gas_limit_too_low' });
    } else if (errorMessage.match(/insufficient.*funds/i)) {
      errorMessage = getIntl().formatMessage({ id: 'insufficient_ether_fund' });
    } else {
      errorMessage = getIntl().formatMessage({ id: errorMessage });
    }
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: errorMessage })));
    yield put(actions.stageError(walletDetails.address, currency));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
  }
}

export function* withdraw({ amount, address, currency, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  const { gasLimit, gasPrice } = options;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  try {
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.withdraw(amount, address, currency, options)));
      yield put(actions.withdrawError(walletDetails.address, currency));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const { nahmiiProvider } = network;
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    const _amount = nahmii.MonetaryAmount.from(amount.toFixed(), currency, 0);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    if (confOnDevice) yield put(confOnDevice);
    const tx = yield call(nahmiiWallet.withdraw.bind(nahmiiWallet), _amount, { gasLimit, gasPrice });
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield processTx('withdraw', nahmiiProvider, tx, walletDetails.address, currency);
  } catch (e) {
    let errorMessage = logErrorMsg(e);

    if (errorMessage.match(/gas.*required.*exceeds/i) || errorMessage.match(/out.*of.*gas/i)) {
      errorMessage = getIntl().formatMessage({ id: 'gas_limit_too_low' });
    } else {
      errorMessage = getIntl().formatMessage({ id: errorMessage });
    }
    yield put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: errorMessage })));
    yield put(actions.withdrawError(walletDetails.address, currency));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
  }
}

export function* processTx(type, provider, tx, address, currency) {
  const actionTargets = {
    success: () => {},
    loadTxRequestSuccess: () => {},
  };

  if (type === 'settle') {
    actionTargets.success = actions.settleSuccess;
    actionTargets.error = actions.loadTxReceiptForSettlementError;
    actionTargets.loadTxRequestSuccess = actions.loadTxRequestForSettlingSuccess;
    actionTargets.loadTxReceiptSuccess = actions.loadTxReceiptForSettlingSuccess;
    yield put(notify('info', getIntl().formatMessage({ id: 'starting_payment_challenge' })));
  }

  if (type === 'stage') {
    actionTargets.success = actions.stageSuccess;
    actionTargets.loadTxRequestSuccess = actions.loadTxRequestForStagingSuccess;
    actionTargets.loadTxReceiptSuccess = actions.loadTxReceiptForStagingSuccess;
    yield put(notify('info', getIntl().formatMessage({ id: 'settling_payment' })));
  }

  if (type === 'withdraw') {
    actionTargets.success = actions.withdrawSuccess;
    actionTargets.loadTxRequestSuccess = actions.loadTxRequestForWithdrawSuccess;
    actionTargets.loadTxReceiptSuccess = actions.loadTxReceiptForWithdrawSuccess;
    yield put(notify('info', getIntl().formatMessage({ id: 'withdrawing' })));
  }

  if (type === 'claimFees') {
    actionTargets.success = actions.claimFeesForAccrualsSuccess;
    actionTargets.loadTxRequestSuccess = actions.loadTxRequestForClaimingFeesSuccess;
    actionTargets.loadTxReceiptSuccess = actions.loadTxReceiptForClaimingFeesSuccess;
    yield put(notify('info', getIntl().formatMessage({ id: 'claiming_fees' })));
  }

  if (type === 'withdrawFees') {
    actionTargets.success = actions.withdrawFeesSuccess;
    actionTargets.loadTxRequestSuccess = actions.loadTxRequestForWithdrawingFeesSuccess;
    actionTargets.loadTxReceiptSuccess = actions.loadTxReceiptForWithdrawingFeesSuccess;
    yield put(notify('info', getIntl().formatMessage({ id: 'withdrawing_fees' })));
  }

  yield put(actionTargets.loadTxRequestSuccess(address, tx, currency, provider.name));
  const txRes = yield call(waitForTransaction, provider, tx.hash);
  const txReceipt = yield call(getTransactionReceipt, provider, txRes.transactionHash);
  yield put(actionTargets.loadTxReceiptSuccess(address, txReceipt, currency));
  if (txReceipt.status === 1) {
    yield put(notify('success', getIntl().formatMessage({ id: 'tx_mined_success' })));
    yield put(actionTargets.success(address, txReceipt, currency));
  } else {
    const errorId = 'tx_mined_error';
    const errorMsg = getIntl().formatMessage({ id: errorId });
    yield put(notify('error', errorMsg));

    if (actionTargets.error) {
      yield put(actionTargets.error(address, currency, txReceipt));
    }

    throw new Error(errorId);
  }
}

export function* loadSettlements({ address, currency }, network, noPoll) {
  while (true) { // eslint-disable-line no-constant-condition
    const { nahmiiProvider } = network;
    try {
      const settlementFactory = new nahmii.SettlementFactory(nahmiiProvider);
      const settlements = yield call(() => settlementFactory.getAllSettlements(address, currency));
      yield put(actions.loadSettlementsSuccess(address, currency, settlements));
    } catch (err) {
      if (err.asStringified) {
        const nestedErrorMsg = err.asStringified();
        console.error(nestedErrorMsg);//eslint-disable-line
      }
      yield put(actions.loadSettlementsError(address, currency, err));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 59;
      yield delay(TWENTY_SEC_IN_MS);
    }
    if (noPoll) {
      return;
    }
  }
}

export const receiptEventChannel = (nahmiiEventProvider) => eventChannel((emit) => {
  nahmiiEventProvider.onNewReceipt((receipt) => {
    emit(receipt);
  });
  return () => {
    nahmiiEventProvider.dispose();
  };
});

export function* listenReceiptEvent() {
  const network = yield select(makeSelectCurrentNetwork());
  const nahmiiEventProvider = yield nahmii.NahmiiEventProvider.from(network.nahmiiProvider);
  const channel = yield call(receiptEventChannel, nahmiiEventProvider);
  while (true) {
    const [receipt, changedNetwork] = yield race([
      take(channel),
      take(CHANGE_NETWORK),
    ]);

    if (changedNetwork) {
      channel.close();
      return;
    }

    const wallets = yield select(makeSelectWallets());
    for (const wallet of wallets) {
      if (
        isAddressMatch(receipt.sender, wallet.get('address')) ||
        isAddressMatch(receipt.recipient, wallet.get('address'))
      ) {
        yield put(actions.newReceiptReceived(wallet.get('address'), receipt.toJSON()));
      }
    }
  }
}

export function* loadWalletReceipts({ address }, network) {
  try {
    const receipts = yield call(network.nahmiiProvider.getWalletReceipts.bind(network.nahmiiProvider), address, null, 1000);
    yield put(actions.loadReceiptsSuccess(address, receipts));
  } catch (e) {
    yield put(actions.loadReceiptsError(address, e));
  }
}

export function* loadAllWalletReceipts() {
  const network = yield select(makeSelectCurrentNetwork());
  const wallets = yield select(makeSelectWallets());
  for (const wallet of wallets) {
    yield fork(loadWalletReceipts, { address: wallet.get('address') }, network);
  }
}

export function* loadClaimableFees({ address, currency, startPeriod, endPeriod }) {
  const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
  const { FeesClaimant } = nahmii;
  const feesClaimant = new FeesClaimant(nahmiiProvider);

  let _startPeriod = startPeriod;
  let _endPeriod = endPeriod;
  try {
    if (!Number.isInteger(startPeriod) || !Number.isInteger(endPeriod)) {
      const periods = yield call(
        feesClaimant.claimableAccruals.bind(feesClaimant),
        { address },
        { ct: currency, id: 0 }
      );

      _startPeriod = periods[0];
      _endPeriod = periods[periods.length - 1];
    }

    const claimableAmount = yield call(
      feesClaimant.claimableFeesForAccruals.bind(feesClaimant),
      { address },
      { ct: currency, id: 0 },
      _startPeriod,
      _endPeriod
    );
    yield put(actions.loadClaimableFeesSuccess(address, currency, _startPeriod, _endPeriod, claimableAmount));
  } catch (error) {
    yield put(actions.loadClaimableFeesError(address, currency, _startPeriod, _endPeriod, error));
  }
}

export function* claimFeesForAccruals({ currency, startPeriod, endPeriod, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  try {
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.claimFeesForAccruals(walletDetails.address, currency, startPeriod, endPeriod, options)));
      yield put(actions.claimFeesForAccrualsError(walletDetails.address, currency));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const { nahmiiProvider } = network;
    const { FeesClaimant } = nahmii;
    const feesClaimant = new FeesClaimant(nahmiiProvider);
    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    if (confOnDevice) yield put(confOnDevice);
    const tx = yield call(
      feesClaimant.claimFeesForAccruals.bind(feesClaimant),
      nahmiiWallet, { ct: currency, id: 0 }, startPeriod, endPeriod, options
    );
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield processTx('claimFees', nahmiiProvider, tx, walletDetails.address, currency);
  } catch (e) {
    const errorMessage = logErrorMsg(e);
    yield put(notify('error', getIntl().formatMessage({ id: 'claim_fees_error' }, { message: errorMessage })));
    yield put(actions.claimFeesForAccrualsError(walletDetails.address, currency, e));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
  }
}

export function* loadWithdrawableFees({ address, currency }) {
  const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
  const { FeesClaimant } = nahmii;
  const feesClaimant = new FeesClaimant(nahmiiProvider);

  try {
    const withdrawableAmount = yield call(
      feesClaimant.withdrawableFees.bind(feesClaimant),
      { address },
      { ct: currency, id: 0 }
    );
    yield put(actions.loadWithdrawableFeesSuccess(address, currency, withdrawableAmount));
  } catch (error) {
    yield put(actions.loadWithdrawableFeesError(address, currency, error));
  }
}

export function* withdrawFees({ currency, amount, options }) {
  let confOnDeviceDone;
  let confOnDevice;
  let signer;
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  try {
    if (walletDetails.encrypted && !walletDetails.decrypted) {
      yield put(showDecryptWalletModal(actions.withdrawFees(currency, amount, options)));
      yield put(actions.withdrawFeesError(walletDetails.address, currency));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const { nahmiiProvider } = network;
    const { FeesClaimant } = nahmii;
    const feesClaimant = new FeesClaimant(nahmiiProvider);

    [signer, confOnDevice, confOnDeviceDone] = yield call(getSdkWalletSigner, walletDetails);
    if (confOnDevice) yield put(confOnDevice);

    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    const monetaryAmount = nahmii.MonetaryAmount.from(amount.toFixed(), currency, 0);

    const tx = yield call(
      feesClaimant.withdrawFees.bind(feesClaimant),
      nahmiiWallet, monetaryAmount, options
    );
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield processTx('withdrawFees', nahmiiProvider, tx, walletDetails.address, currency);
  } catch (e) {
    const errorMessage = logErrorMsg(e);
    yield put(notify('error', getIntl().formatMessage({ id: 'withdraw_fees_error' }, { message: errorMessage })));
    yield put(actions.withdrawFeesError(walletDetails.address, currency, e));
  } finally {
    if (confOnDeviceDone) yield put(confOnDeviceDone);
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
        // ...wallets.map((wallet) => fork(loadWalletReceipts, { address: wallet.get('address') }, network)),
      ]);

      const currentWalletAddress = (yield select(makeSelectCurrentWallet())).get('address');
      const currencyAddress = yield select(makeSelectWalletCurrency());
      if (currentWalletAddress && currencyAddress) {
        yield all([
          fork(loadSettlements, { address: currentWalletAddress, currency: currencyAddress }, network, true),
        ]);
      }

      const ONE_MINUTE_IN_MS = 60 * 1000;
      yield race({
        timer: call(delay, ONE_MINUTE_IN_MS),
        override: take([CHANGE_NETWORK, ADD_NEW_WALLET, MAKE_NAHMII_PAYMENT_SUCCESS]),
      });
      if (allTasks.length > 0) {
        yield cancel(...allTasks);
      }
    }
  } catch (e) {
    // errors in the forked processes themselves should be caught
    // and handled before they get here. if something goes wrong here
    // there was probably an error with the wallet selector, which should
    // never happen
    throw new Error(e);
  }
}

export function* changeNahmiiCurrency() {
  const settlements = yield select(makeSelectSettlementsForCurrentWalletCurrency());
  if (settlements.get('loading') === undefined) {
    const walletAddress = (yield select(makeSelectCurrentWallet())).get('address');
    const currencyAddress = yield select(makeSelectWalletCurrency());
    yield put(actions.reloadSettlementStates(walletAddress, currencyAddress));
  }
}

export function* reloadSettlementStatesHook({ address }) {
  const walletAddress = address || (yield select(makeSelectCurrentWallet())).get('address');
  const currencyAddress = yield select(makeSelectWalletCurrency());
  yield put(actions.reloadSettlementStates(walletAddress, currencyAddress));
}

export function* reloadSettlementStates({ address, currency }) {
  const network = yield select(makeSelectCurrentNetwork());
  yield all([
    fork(loadStagedBalances, { address }, network, true),
    fork(loadSettlements, { address, currency }, network, true),
  ]);
}

export default function* listen() {
  yield takeLatest(INIT_NETWORK_ACTIVITY, challengeStatusOrcestrator);
  yield takeLatest(INIT_NETWORK_ACTIVITY, listenReceiptEvent);
  yield takeLatest(INIT_NETWORK_ACTIVITY, loadAllWalletReceipts);
  yield takeLatest(CHANGE_NETWORK, listenReceiptEvent);
  yield takeLatest(CHANGE_NETWORK, loadAllWalletReceipts);
  yield takeEvery(NAHMII_DEPOSIT, deposit);
  yield takeEvery(NAHMII_DEPOSIT_ETH, depositEth);
  yield takeEvery(NAHMII_APPROVE_TOKEN_DEPOSIT, approveTokenDeposit);
  yield takeEvery(NAHMII_COMPLETE_TOKEN_DEPOSIT, completeTokenDeposit);
  yield takeEvery(MAKE_NAHMII_PAYMENT, makePayment);
  yield takeEvery(SETTLE, settle);
  yield takeEvery(STAGE, stage);
  yield takeEvery(WITHDRAW, withdraw);
  yield takeEvery(SETTLE_SUCCESS, reloadSettlementStatesHook);
  yield takeEvery(STAGE_SUCCESS, reloadSettlementStatesHook);
  yield takeEvery(WITHDRAW_SUCCESS, reloadSettlementStatesHook);
  yield takeEvery(SET_SELECTED_WALLET_CURRENCY, changeNahmiiCurrency);
  yield takeEvery(RELOAD_SETTLEMENT_STATES, reloadSettlementStates);
  yield takeLatest(LOAD_CLAIMABLE_FEES, loadClaimableFees);
  yield takeLatest(LOAD_WITHDRAWABLE_FEES, loadWithdrawableFees);
  yield takeLatest(CLAIM_FEES_FOR_ACCRUALS, claimFeesForAccruals);
  yield takeLatest(WITHDRAW_FEES, withdrawFees);
}
