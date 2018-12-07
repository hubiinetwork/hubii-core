import ClientFundContract from 'nahmii-sdk/lib/client-fund-contract';
import nahmii from 'nahmii-sdk';
// import { getIntl } from 'utils/localisation';
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
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_DEPOSIT_FAILED,
  NAHMII_DEPOSIT,
  NAHMII_DEPOSIT_ETH,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  MAKE_NAHMII_PAYMENT,
} from './constants';

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
  try {
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    const nahmiiWallet = new nahmii.Wallet(wallet.decrypted.privateKey, nahmiiProvider);
    const { hash } = yield call(() => nahmiiWallet.depositEth(amount, options));
    yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
    yield put(actions.nahmiiDepositEthSuccess());
  } catch (e) {
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}

export function* approveTokenDeposit({ address, symbol, amount, options }) {
  try {
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    const nahmiiWallet = new nahmii.Wallet(wallet.decrypted.privateKey, nahmiiProvider);
    const { hash } = yield call(() => nahmiiWallet.approveTokenDeposit(amount, symbol, options));
    yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
    yield put(actions.nahmiiApproveTokenDepositSuccess());
  } catch (e) {
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}

export function* completeTokenDeposit({ address, symbol, amount, options }) {
  try {
    const { nahmiiProvider } = yield select(makeSelectCurrentNetwork());
    const wallet = (yield select(makeSelectWallets())).toJS().find((w) => w.address === address);
    const nahmiiWallet = new nahmii.Wallet(wallet.decrypted.privateKey, nahmiiProvider);
    const { hash } = yield call(() => nahmiiWallet.completeTokenDeposit(amount, symbol, options));
    yield call(() => nahmiiProvider.getTransactionConfirmation(hash));
    yield put(actions.nahmiiCompleteTokenDepositSuccess());
  } catch (e) {
    yield put(actions.nahmiiDepositFailed(`An error occured: ${e.message}`));
  }
}

export function* makePayment({ monetaryAmount, recipient, walletOverride }) {
  try {
    const wallet = walletOverride || (yield (select(makeSelectCurrentWalletWithInfo()))).toJS();
    if (wallet.encrypted && !wallet.decrypted) {
      yield put(showDecryptWalletModal(actions.makeNahmiiPayment(monetaryAmount, recipient, walletOverride)));
      yield put(actions.nahmiiPaymentError(new Error(getIntl().formatMessage({ id: 'wallet_encrypted_error' }))));
      return;
    }
    const network = yield select(makeSelectCurrentNetwork());
    const nahmiiProvider = network.nahmiiProvider;
    const { signer, confOnDevice, confOnDeviceDone } = yield call(getSdkWalletSigner, wallet);
    const nahmiiWallet = new nahmii.Wallet(signer, nahmiiProvider);
    const payment = new nahmii.Payment(nahmiiWallet, monetaryAmount, wallet.address, recipient);
    if (confOnDevice) yield put(confOnDevice);
    yield call([payment, 'sign']);
    if (confOnDeviceDone) yield put(confOnDeviceDone);
    yield call([payment, 'register']);
    yield put(actions.nahmiiPaymentSuccess());
    yield put(notify('success', getIntl().formatMessage({ id: 'sent_transaction_success' })));
  } catch (e) {
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
      signTransaction: async () => {},
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
      signTransaction: () => {},
      address: wallet.address,
    };
    confOnDevice = trezorConfirmTxOnDevice();
    confOnDeviceDone = trezorConfirmTxOnDeviceDone();
  } else {
    signer = wallet.decrypted.privateKey;
  }
  return { signer, confOnDevice, confOnDeviceDone };
}

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

export function* loadBalances({ address }, network) {
  if (network.provider.name === 'homestead') {
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
export function* loadStagedBalances({ address }, network) {
  if (network.provider.name === 'homestead') {
    yield put(actions.loadStagedBalancesSuccess(address, []));
    return;
  }
  let supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  if (supportedAssets.loading) {
    yield take(LOAD_SUPPORTED_TOKENS_SUCCESS);
    supportedAssets = (yield select(makeSelectSupportedAssets())).toJS();
  }

  const provider = network.provider;
  const clientFundContract = new ClientFundContract(network.nahmiiProvider);

  while (true) { // eslint-disable-line no-constant-condition
    try {
      // the first provider in network.provider.providers in an Infura node, which supports RPC calls
      const jsonRpcProvider = provider.providers ? provider.providers[0] : provider;

      const clientFundContractAddress = clientFundContract.address;

      // derive function selector
      const funcBytes = utils.solidityKeccak256(['string'], ['stagedBalance(address,address,uint256)']);
      const funcSelector = funcBytes.slice(0, 10);

      // send a batch of RPC requests asking for all staged balances
      // https://www.jsonrpc.org/specification#batch
      const currencyCtList = supportedAssets.assets.map((a) => a.currency);
      const requestBatch = currencyCtList.map((ct) => {
        const currencyId = ct === 'ETH' ? '0x0000000000000000000000000000000000000000' : ct;
        // encode arguments, prepare them for being sent
        const encodedArgs = utils.defaultAbiCoder.encode(['address', 'int256', 'int256'], [address, currencyId, 0]);
        const dataArr = utils.concat([funcSelector, encodedArgs]);
        const data = utils.hexlify(dataArr);
        const params = [{ from: address, to: clientFundContractAddress, data }, 'latest'];
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

export default function* listen() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, challengeStatusOrcestrator);
  yield takeLatest(NAHMII_DEPOSIT, deposit);
  yield takeLatest(NAHMII_DEPOSIT_ETH, depositEth);
  yield takeLatest(NAHMII_APPROVE_TOKEN_DEPOSIT, approveTokenDeposit);
  yield takeLatest(NAHMII_COMPLETE_TOKEN_DEPOSIT, completeTokenDeposit);
  yield takeEvery(MAKE_NAHMII_PAYMENT, makePayment);
}
