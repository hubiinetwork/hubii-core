import nahmii from 'nahmii-sdk';
// import { utils } from 'ethers';
import { takeEvery, select, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getNahmiiProvider } from 'containers/HubiiApiHoc/saga';
// import { notify } from 'containers/App/actions';
import {
  makeSelectCurrentWalletWithInfo,
  // makeSelectSupportedAssets,
} from 'containers/WalletHoc/selectors';
import * as actionTypes from './constants';
import * as actions from './actions';
import { makeSelectReceiptsByAddress } from './selectors';

// const config = {
//   apiRoot: 'api2.dev.hubii.net',
//   appId: '5b83a6e97f327e00101b54a8',
//   appSecret: '$2a$10$Wu8ibI.MMbqAJcf0xUpsCeT3xl4Cj2dvTzc2Hu9.VjJq.fBzxAoJa',
// };

// const provider = new nahmii.NahmiiProvider(config.apiRoot, config.appId, config.appSecret);

// export function* deposit({ address, currency, amount }) {
//   const ethAmount = utils.formatEther(amount.toString());
//   if (currency === 'ETH') {
//     yield put(actions.depositEth(address, ethAmount));
//   } else {
//     yield put(actions.depositToken(currency, ethAmount));
//   }
// }

// export function* depositEth({ address, amount }) {
//   try {
//     const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
//     const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, provider);

//     const receipt = yield call((...args) => wallet.depositEth(...args), amount, { gasLimit: 1500000 });
//     const currency = 'ETH';
//     yield put(actions.depositSuccess(address, receipt, currency));
//     yield put(notify('success', 'Deposited'));
//   } catch (error) {
//     // yield put(depositError(error));
//     // yield put(notify('error', `Failed to send transaction: ${error.message}`));
//   }
// }

// export function* depositToken({ currency, amount }) {
//   try {
//     const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();

//     const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, provider);

//     const receipt = yield call((...args) => wallet.depositToken(...args), amount, currency, { gasLimit: 1500000 });
//     yield put(actions.depositSuccess(walletDetails.address, receipt, currency));
//     yield put(notify('success', 'Deposited'));
//   } catch (error) {
//     // yield put(depositError(error));
//     // yield put(notify('error', `Failed to send transaction: ${error.message}`));
//   }
// }

// export function* loadBalances({ address }) {
//   try {
//     const balances = yield call((...args) => provider.getNahmiiBalances(...args), address);
//     yield put(actions.loadBalancesSuccess(address, balances));
//   } catch (err) {
//   }
// }

// export function* pay({ currency, amount, recipient }) {
//   let currencyAddress;
//   try {
//     const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
//     if (currency === 'ETH') {
//       currencyAddress = '0x0000000000000000000000000000000000000000';
//     } else {
//       const supportedAssets = yield select(makeSelectSupportedAssets());
//       console.log(supportedAssets.toJS(), currency);
//       const tokenInfo = supportedAssets.get('assets').find((asset) => asset.get('symbol') === currency);
//       if (!tokenInfo) {
//         throw new Error(`token ${currency} is not supported yet`);
//       }
//       currencyAddress = tokenInfo.get('currency');
//     }
//     const sender = walletDetails.address;
//     const payment = new nahmii.Payment(provider, amount, currencyAddress, sender, recipient);

//     payment.sign(walletDetails.decrypted.privateKey);
//     const receipt = yield call(() => payment.register());
//     yield put(actions.paySuccess(sender, receipt, payment.toJSON()));
//   } catch (error) {
//   }
// }

export function* startPaymentChallenge({ receipt, stageAmount }) {
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  const nahmiiProvider = yield getNahmiiProvider();
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);

  const receiptObj = nahmii.Receipt.from(nahmiiProvider, receipt);
  const tx = yield call((...args) => wallet.startChallengeFromPayment(...args), receiptObj, stageAmount);

  yield processTx('start-challenge', nahmiiProvider, tx, wallet.address);
}

export function* settlePaymentDriip({ receipt }) {
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  const nahmiiProvider = yield getNahmiiProvider();
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);

  const receiptObj = nahmii.Receipt.from(nahmiiProvider, receipt);
  const tx = yield call((...args) => wallet.settleDriipAsPayment(...args), receiptObj);

  yield processTx('settle-payment', nahmiiProvider, tx, wallet.address);
}

export function* withdraw({ amount }) {
  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  const nahmiiProvider = yield getNahmiiProvider();
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);

  const tx = yield call((...args) => wallet.withdraw(...args), amount);

  yield processTx('withdraw', nahmiiProvider, tx, wallet.address);
}

export function* processTx(type, provider, tx, address) {
  const actionTargets = {
    success: () => {},
    error: () => {},
    loadTxRequest: () => {},
  };

  if (type === 'settle-payment') {
    actionTargets.success = actions.settlePaymentDriipSuccess;
    actionTargets.error = actions.settlePaymentDriipError;
    actionTargets.loadTxRequest = actions.loadTxRequestForSettlePaymentDriip;
  }

  if (type === 'start-challenge') {
    actionTargets.success = actions.startPaymentChallengeSuccess;
    actionTargets.error = actions.startPaymentChallengeError;
    actionTargets.loadTxRequest = actions.loadTxRequestForPaymentChallenge;
  }

  if (type === 'withdraw') {
    actionTargets.success = actions.withdrawSuccess;
    actionTargets.error = actions.withdrawError;
    actionTargets.loadTxRequest = actions.loadTxRequestForWithdraw;
  }

  yield put(actionTargets.loadTxRequest(address, tx));
  const txRes = yield call((...args) => provider.waitForTransaction(...args), tx.hash);
  const txReceipt = yield call((...args) => provider.getTransactionReceipt(...args), txRes.hash);
  if (txReceipt.status === 1) {
    yield put(actionTargets.success(address, txReceipt));
  } else {
    yield put(actionTargets.error(address, txReceipt));
  }
}

export function* loadCurrentPaymentChallengePhase({ address }) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = yield getNahmiiProvider();
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

export function* loadCurrentPaymentChallengeStatus({ address }) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = yield getNahmiiProvider();
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

export function* loadSettlement({ address }) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = yield getNahmiiProvider();
      const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
      const receipts = (yield select(makeSelectReceiptsByAddress(address))).toJS();
      if (!receipts || receipts.length === 0) {
        throw new Error('No receipts');
      }
      const lastNonce = receipts.sort((a, b) => b.nonce - a.nonce)[0].nonce;
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

export function* loadReceipts({ address }) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const nahmiiProvider = yield getNahmiiProvider();
      const limit = 1000;
      const receipts = yield call((...args) => nahmiiProvider.getWalletReceipts(...args), address, null, limit);
      yield put(actions.loadReceiptsSuccess(address, receipts));
    } catch (err) {
      yield put(actions.loadReceiptsError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}


export function* listen() {
  // yield takeEvery(actionTypes.DEPOSIT, deposit);
  // yield takeEvery(actionTypes.DEPOSIT_ETH, depositEth);
  // yield takeEvery(actionTypes.DEPOSIT_TOKEN, depositToken);
  // yield takeEvery(actionTypes.LOAD_NAHMII_BALANCES, loadBalances);
  yield takeEvery(actionTypes.START_PAYMENT_CHALLENGE, startPaymentChallenge);
  yield takeEvery(actionTypes.SETTLE_PAYMENT_DRIIP, settlePaymentDriip);
  yield takeEvery(actionTypes.WITHDRAW, withdraw);
  yield takeEvery(actionTypes.LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE, loadCurrentPaymentChallengePhase);
  yield takeEvery(actionTypes.LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS, loadCurrentPaymentChallengeStatus);
  yield takeEvery(actionTypes.LOAD_SETTLEMENT, loadSettlement);
  yield takeEvery(actionTypes.LOAD_RECEIPTS, loadReceipts);
}
