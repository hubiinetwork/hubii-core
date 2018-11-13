import nahmii from 'nahmii-sdk';
// import { utils } from 'ethers';
import { all, fork, takeEvery, select, put, call, take, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getNahmiiProvider } from 'containers/HubiiApiHoc/saga';
import {requestWalletAPI} from 'utils/request'
// import { notify } from 'containers/App/actions';
import {
  makeSelectCurrentWalletWithInfo,
  // makeSelectSupportedAssets,
} from 'containers/WalletHoc/selectors';
import * as actionTypes from './constants';
import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';

import { showDecryptWalletModal } from 'containers/WalletHoc/actions';
import * as actions from './actions';
import { makeSelectLastPaymentChallengeByAddress } from './selectors';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import {makeSelectWallets} from 'containers/WalletHoc/selectors';
import { getIntl } from 'utils/localisation';
import { notify } from 'containers/App/actions';

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

export function* loadBalances({ address }, network) {
  try {
    const path = `trading/wallets/${address}/balances`
    const balances = yield call((...args) => requestWalletAPI(...args), path, network);
    yield put(actions.loadBalancesSuccess(address, balances));
  } catch (err) {
    console.log(err)
  }
}

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
  if (walletDetails.encrypted && !walletDetails.decrypted) {
    yield put(showDecryptWalletModal(actions.startPaymentChallenge(receipt, stageAmount)));
    return;
  }
  const network = yield select(makeSelectCurrentNetwork());
  // const nahmiiProvider = yield getNahmiiProvider();
  const nahmiiProvider = network.provider
  // const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
  const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider)

  const receiptObj = nahmii.Receipt.from(nahmiiProvider, receipt);
  const _stageAmount = new nahmii.MonetaryAmount(stageAmount, '0X0000000000000000000000000000000000000000', 0)
  // console.log(receiptObj.toJSON(), _stageAmount.toJSON(), wallet.address, wallet.provider)
  const tx = yield call((...args) => settlementChallenge.startChallengeFromPayment(...args), receiptObj, _stageAmount, wallet);
  console.log('tx', tx)
  yield processTx('start-challenge', nahmiiProvider, tx, wallet.address);
}

export function* settlePaymentDriip({ receipt }) {
  // const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  // const nahmiiProvider = yield getNahmiiProvider();
  // const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);

  const walletDetails = (yield select(makeSelectCurrentWalletWithInfo())).toJS();
  if (walletDetails.encrypted && !walletDetails.decrypted) {
    yield put(showDecryptWalletModal(actions.settlePaymentDriip(receipt)));
    return;
  }
  const network = yield select(makeSelectCurrentNetwork());
  // const nahmiiProvider = yield getNahmiiProvider();
  const nahmiiProvider = network.provider
  // const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
  const wallet = new nahmii.Wallet(walletDetails.decrypted.privateKey, nahmiiProvider);
  const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider)

  const receiptObj = nahmii.Receipt.from(nahmiiProvider, receipt);
  const tx = yield call((...args) => settlementChallenge.settleDriipAsPayment(...args), receiptObj, wallet, {gasLimit: 6e6});
  console.log('tx', tx)

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
    yield put(notify('info', getIntl().formatMessage({ id: 'settling_payment' })));
  }

  if (type === 'start-challenge') {
    actionTargets.success = actions.startPaymentChallengeSuccess;
    actionTargets.error = actions.startPaymentChallengeError;
    actionTargets.loadTxRequest = actions.loadTxRequestForPaymentChallenge;
    yield put(notify('info', getIntl().formatMessage({ id: 'starting_payment_challenge' })));
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
    yield put(notify('success', getIntl().formatMessage({ id: 'tx_mined_success' })));
    yield put(actionTargets.success(address, txReceipt));
  } else {
    yield put(notify('error', getIntl().formatMessage({ id: 'tx_mined_error' })));
    yield put(actionTargets.error(address, txReceipt));
  }
}

export function* loadCurrentPaymentChallenge({ address }, network) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      // const nahmiiProvider = yield getNahmiiProvider();
      const nahmiiProvider = network.provider;
      const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
      const currentChallenge = yield call(() => settlementChallenge.getCurrentPaymentChallenge(address));
      yield put(actions.loadCurrentPaymentChallengeSuccess(address, currentChallenge));
    } catch (err) {
      yield put(actions.loadCurrentPaymentChallengeError(address));
    } finally {
      const TWENTY_SEC_IN_MS = 1000 * 20;
      yield delay(TWENTY_SEC_IN_MS);
    }
  }
}

export function* loadCurrentPaymentChallengePhase({ address }, network) {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      // const nahmiiProvider = yield getNahmiiProvider();
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
      // const nahmiiProvider = yield getNahmiiProvider();
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
  // const nahmiiProvider = yield getNahmiiProvider();
  const nahmiiProvider = network.provider;
  const settlementChallenge = new nahmii.SettlementChallenge(nahmiiProvider);
  let lastNonce
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const lastSettlementChallenge = (yield select(makeSelectLastPaymentChallengeByAddress(address))).toJS();
      lastNonce = lastSettlementChallenge.challenge.nonce.toNumber()
    } catch (error) {
      const FIVE_SEC_IN_MS = 1000 * 5;
      yield delay(FIVE_SEC_IN_MS);
      continue
    }

    try {
      const settlement = yield call((...args) => settlementChallenge.getSettlementByNonce(...args), lastNonce);
      yield put(actions.loadSettlementSuccess(address, settlement));
    } catch (err) {
      console.log(err)
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
      // const nahmiiProvider = yield getNahmiiProvider();
      const nahmiiProvider = network.provider;
      const limit = 1000;
      // const receipts = yield call((...args) => nahmiiProvider.getWalletReceipts(...args), address, null, limit);
      const receipts = [{
        "nonce": 1,
        "amount": "5000000000000000000",
        "currency": {
          "ct": "0x0000000000000000000000000000000000000000",
          "id": "0"
        },
        "sender": {
          "wallet": "0x97026a8157f39101aefc4A81496C161a6b1Ce46A",
          "nonce": 1,
          "balances": {
            "current": "4800000000000000000",
            "previous": "10000000000000000000"
          },
          "fees": {
            "single": {
              "amount": "200000000000000000",
              "currency": {
                "ct": "0x0000000000000000000000000000000000000000",
                "id": "0"
              }
            },
            "total": [
              {
                "amount": "200000000000000000",
                "currency": {
                  "ct": "0x0000000000000000000000000000000000000000",
                  "id": "0"
                }
              }
            ]
          }
        },
        "recipient": {
          "wallet": "0xBB97f342884eD086dd83a192c8a7e649E095DB7b",
          "nonce": 1,
          "balances": {
            "current": "5000000000000000000",
            "previous": "0"
          },
          "fees": {
            "total": []
          }
        },
        "transfers": {
          "single": "5000000000000000000",
          "total": "10000000000000000000"
        },
        "blockNumber": "0",
        "operatorId": "1",
        "seals": {
          "wallet": {
            "hash": "0x424f956befa5a84763afe5202876bc15cd0fc0c448ead6efa35fa4d8a93e728c",
            "signature": {
              "v": 27,
              "r": "0x3c2ae3eb67ad66db58cbbc263eba3d6507cd437109ea70af5de7c88ae7651c28",
              "s": "0x5e5b343ea4176bd408f1e126ec4f64e3f5735e1dc2639e54544ba6d686a6924d"
            }
          },
          "operator": {
            "hash": "0x7aa30cb4577403d15743776ee664956b8005766dc7a5c59b1e97b672fec4be19",
            "signature": {
              "v": 27,
              "r": "0x9f272b1232165eea0914e5ed496f992592acc58b8620e7083446f8c9dc025783",
              "s": "0x23af84569bae8e03d39020663786536d0f57aa8f49d0f0adc4dff56ffba122c6"
            }
          }
        }
      }]
      yield put(actions.loadReceiptsSuccess(address, receipts));
    } catch (err) {
      console.log(err)
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
      const network = yield select(makeSelectCurrentNetwork());
      const wallets = yield select(makeSelectWallets());
      const allTasks = yield all([
        ...wallets.map((wallet) => fork(loadCurrentPaymentChallenge, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadCurrentPaymentChallengePhase, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadCurrentPaymentChallengeStatus, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadReceipts, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadSettlement, { address: wallet.get('address') }, network)),
        ...wallets.map((wallet) => fork(loadBalances, { address: wallet.get('address') }, network)),
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

export default function* listen() {
  yield takeEvery(INIT_NETWORK_ACTIVITY, challengeStatusOrcestrator);
  
  // yield takeEvery(actionTypes.DEPOSIT, deposit);
  // yield takeEvery(actionTypes.DEPOSIT_ETH, depositEth);
  // yield takeEvery(actionTypes.DEPOSIT_TOKEN, depositToken);
  yield takeEvery(actionTypes.LOAD_NAHMII_BALANCES, loadBalances);
  yield takeEvery(actionTypes.START_PAYMENT_CHALLENGE, startPaymentChallenge);
  yield takeEvery(actionTypes.SETTLE_PAYMENT_DRIIP, settlePaymentDriip);
  yield takeEvery(actionTypes.WITHDRAW, withdraw);
  yield takeEvery(actionTypes.LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE, loadCurrentPaymentChallengePhase);
  yield takeEvery(actionTypes.LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS, loadCurrentPaymentChallengeStatus);
  // yield takeEvery(actionTypes.LOAD_SETTLEMENT, loadSettlement);
  yield takeEvery(actionTypes.LOAD_RECEIPTS, loadReceipts);
}