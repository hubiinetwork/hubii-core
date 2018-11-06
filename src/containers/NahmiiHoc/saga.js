import nahmii from 'nahmii-sdk';
import { utils } from 'ethers';
import { takeEvery, select, put, call } from 'redux-saga/effects';
import {getNahmiiProvider} from 'containers/HubiiApiHoc/saga'
import { notify } from 'containers/App/actions';
import * as actionTypes from './constants';
import {
  makeSelectCurrentWalletWithInfo,
  makeSelectSupportedAssets,
} from 'containers/WalletHoc/selectors';
import {
  makeSelectCurrentNetwork,
} from 'containers/App/selectors';
import * as actions from './actions';

const config = {
  apiRoot: 'api2.dev.hubii.net',
  appId: '5b83a6e97f327e00101b54a8',
  appSecret: '$2a$10$Wu8ibI.MMbqAJcf0xUpsCeT3xl4Cj2dvTzc2Hu9.VjJq.fBzxAoJa',
};

const provider = new nahmii.NahmiiProvider(config.apiRoot, config.appId, config.appSecret);

export function* deposit({ address, currency, amount }) {
  const ethAmount = utils.formatEther(amount.toString());
  if (currency === 'ETH') {
    yield put(actions.depositEth(address, ethAmount));
  } else {
    yield put(actions.depositToken(currency, ethAmount));
  }
}

export function* depositEth({ address, amount }) {
  try {
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
    const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, provider);

    const receipt = yield call((...args) => wallet.depositEth(...args), amount, { gasLimit: 1500000 });
    const currency = 'ETH';
    yield put(actions.depositSuccess(address, receipt, currency));
    yield put(notify('success', 'Deposited'));
  } catch (error) {
    console.log('err', error);
    // yield put(depositError(error));
    // yield put(notify('error', `Failed to send transaction: ${error.message}`));
  }
}

export function* depositToken({ currency, amount }) {
  try {
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();

    const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, provider);

    const receipt = yield call((...args) => wallet.depositToken(...args), amount, currency, { gasLimit: 1500000 });
    yield put(actions.depositSuccess(walletDetails.address, receipt, currency));
    yield put(notify('success', 'Deposited'));
  } catch (error) {
    console.log('err', error);
    // yield put(depositError(error));
    // yield put(notify('error', `Failed to send transaction: ${error.message}`));
  }
}

export function* loadBalances({ address }) {
  try {
    const balances = yield call((...args) => provider.getNahmiiBalances(...args), address);
    yield put(actions.loadBalancesSuccess(address, balances));
  } catch (err) {
    console.log('err', err);
  }
}

export function* pay({ currency, amount, recipient }) {
  let currencyAddress;
  try {
    const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
    if (currency === 'ETH') {
      currencyAddress = '0x0000000000000000000000000000000000000000';
    } else {
      const supportedAssets = yield select(makeSelectSupportedAssets());
      console.log(supportedAssets.toJS(), currency);
      const tokenInfo = supportedAssets.get('assets').find((asset) => asset.get('symbol') === currency);
      if (!tokenInfo) {
        throw new Error(`token ${currency} is not supported yet`);
      }
      currencyAddress = tokenInfo.get('currency');
    }
    const sender = walletDetails.address;
    const payment = new nahmii.Payment(provider, amount, currencyAddress, sender, recipient);

    payment.sign(walletDetails.decrypted.privateKey);
    const receipt = yield call(() => payment.register());
    yield put(actions.paySuccess(sender, receipt, payment.toJSON()));
  } catch (error) {
    console.log('err', error);
  }
}

export function* startPaymentChallenge({receipt, stageAmount}) {
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  const nahmiiProvider = yield getNahmiiProvider()
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);

  receipt = nahmii.Receipt.from(nahmiiProvider, receipt)
  const tx = yield call((...args) => wallet.startChallengeFromPayment(...args), receipt, stageAmount);
  yield put(actions.loadTxRequestForPaymentChallenge(wallet.address, tx))
  const txRes = yield call((...args) => nahmiiProvider.waitForTransaction(...args), tx.hash);
  const txReceipt = yield call((...args) => nahmiiProvider.getTransactionReceipt(...args), txRes.hash);
  if (txReceipt.status === 1) {
    yield put(actions.startPaymentChallengeSuccess(wallet.address, txReceipt))
  } else {
    yield put(actions.startPaymentChallengeError(wallet.address, txReceipt))
  }
}

export function* settlePaymentDriip({receipt}) {
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  const nahmiiProvider = yield getNahmiiProvider()
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);

  receipt = nahmii.Receipt.from(nahmiiProvider, receipt)
  const tx = yield call((...args) => wallet.settleDriipAsPayment(...args), receipt);
  yield put(actions.loadTxRequestForSettlePaymentDriip(wallet.address, tx))
  const txRes = yield call((...args) => nahmiiProvider.waitForTransaction(...args), tx.hash);
  const txReceipt = yield call((...args) => nahmiiProvider.getTransactionReceipt(...args), txRes.hash);
  if (txReceipt.status === 1) {
    yield put(actions.settlePaymentDriipSuccess(wallet.address, txReceipt))
  } else {
    yield put(actions.settlePaymentDriipError(wallet.address, txReceipt))
  }
}

export function* listen() {
  yield takeEvery(actionTypes.DEPOSIT, deposit);
  yield takeEvery(actionTypes.DEPOSIT_ETH, depositEth);
  yield takeEvery(actionTypes.DEPOSIT_TOKEN, depositToken);
  yield takeEvery(actionTypes.LOAD_NAHMII_BALANCES, loadBalances);
  yield takeEvery(actionTypes.START_PAYMENT_CHALLENGE, startPaymentChallenge);
  yield takeEvery(actionTypes.SETTLE_PAYMENT_DRIIP, settlePaymentDriip);
}