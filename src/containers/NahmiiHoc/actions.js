import {
  SET_SELECTED_WALLET_CURRENCY,
  LOAD_NAHMII_BALANCES,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_BALANCES_ERROR,
  LOAD_NAHMII_STAGED_BALANCES,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES_ERROR,
  LOAD_NAHMII_STAGING_BALANCES,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  START_CHALLENGE,
  START_CHALLENGE_SUCCESS,
  START_CHALLENGE_ERROR,
  START_REQUIRED_CHALLENGES_SUCCESS,
  UPDATE_START_CHALLENGE_BLOCK_HEIGHT,
  LOAD_START_CHALLENGE_TX_REQUEST,
  LOAD_START_CHALLENGE_TX_RECEIPT_SUCCESS,
  SETTLE,
  SETTLE_SUCCESS,
  SETTLE_ERROR,
  LOAD_SETTLE_TX_REQUEST,
  LOAD_SETTLE_TX_RECEIPT_SUCCESS,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_WITHDRAW_TX_RECEIPT_SUCCESS,
  LOAD_ONGOING_CHALLENGES_SUCCESS,
  LOAD_ONGOING_CHALLENGES_ERROR,
  LOAD_SETTLEABLE_CHALLENGES_SUCCESS,
  LOAD_SETTLEABLE_CHALLENGES_ERROR,
  LOAD_NAHMII_STAGING_BALANCES_ERROR,
  NAHMII_DEPOSIT,
  NAHMII_DEPOSIT_ETH_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  NAHMII_DEPOSIT_ETH,
  NAHMII_DEPOSIT_FAILED,
  MAKE_NAHMII_PAYMENT,
  MAKE_NAHMII_PAYMENT_ERROR,
  MAKE_NAHMII_PAYMENT_SUCCESS,
  LOAD_NAHMII_RECEIPTS,
  LOAD_NAHMII_RECEIPTS_SUCCESS,
  LOAD_NAHMII_RECEIPTS_ERROR,
  SETTLE_ALL_CHALLENGES_SUCCESS,
} from './constants';

export function setSelectedWalletCurrency(currencyAddress) {
  return {
    type: SET_SELECTED_WALLET_CURRENCY,
    currencyAddress: currencyAddress === 'ETH' ? '0x0000000000000000000000000000000000000000' : currencyAddress,
  };
}

export function nahmiiDeposit(address, symbol, amount, options) {
  return {
    type: NAHMII_DEPOSIT,
    address,
    symbol,
    amount,
    options,
  };
}

export function nahmiiApproveTokenDeposit(address, symbol, amount, options) {
  return {
    type: NAHMII_APPROVE_TOKEN_DEPOSIT,
    symbol,
    address,
    amount,
    options,
  };
}

export function nahmiiCompleteTokenDeposit(address, symbol, amount, options) {
  return {
    type: NAHMII_COMPLETE_TOKEN_DEPOSIT,
    symbol,
    address,
    amount,
    options,
  };
}

export function nahmiiDepositEth(address, amount, options) {
  return {
    type: NAHMII_DEPOSIT_ETH,
    address,
    amount,
    options,
  };
}

export function nahmiiDepositEthSuccess() {
  return {
    type: NAHMII_DEPOSIT_ETH_SUCCESS,
  };
}

export function nahmiiApproveTokenDepositSuccess() {
  return {
    type: NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  };
}

export function nahmiiCompleteTokenDepositSuccess() {
  return {
    type: NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  };
}

export function nahmiiDepositFailed(errorMessage) {
  return {
    type: NAHMII_DEPOSIT_FAILED,
    error: errorMessage,
  };
}

export function makeNahmiiPayment(monetaryAmount, recipient, walletOverride = null) {
  return {
    type: MAKE_NAHMII_PAYMENT,
    monetaryAmount,
    recipient,
    walletOverride,
  };
}

export function nahmiiPaymentError(error) {
  return {
    type: MAKE_NAHMII_PAYMENT_ERROR,
    error,
  };
}

export function nahmiiPaymentSuccess() {
  return {
    type: MAKE_NAHMII_PAYMENT_SUCCESS,
  };
}

export function loadBalances(address) {
  return {
    type: LOAD_NAHMII_BALANCES,
    address,
  };
}

export function loadBalancesSuccess(address, balances) {
  return {
    type: LOAD_NAHMII_BALANCES_SUCCESS,
    address,
    balances,
  };
}

export function loadBalancesError(address) {
  return {
    type: LOAD_NAHMII_BALANCES_ERROR,
    address,
  };
}

export function loadStagedBalances(address) {
  return {
    type: LOAD_NAHMII_STAGED_BALANCES,
    address,
  };
}

export function loadStagedBalancesSuccess(address, balances) {
  return {
    type: LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
    address,
    balances,
  };
}

export function loadStagedBalancesError(address) {
  return {
    type: LOAD_NAHMII_STAGED_BALANCES_ERROR,
    address,
  };
}

export function loadStagingBalances(address) {
  return {
    type: LOAD_NAHMII_STAGING_BALANCES,
    address,
  };
}

export function loadStagingBalancesSuccess(address, balances) {
  return {
    type: LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
    address,
    balances,
  };
}


export function loadStagingBalancesError(address) {
  return {
    type: LOAD_NAHMII_STAGING_BALANCES_ERROR,
    address,
  };
}

export function startChallenge(address, currency, stageAmount, options) {
  return {
    type: START_CHALLENGE,
    address,
    stageAmount,
    currency,
    options,
  };
}

export function startChallengeSuccess(address, txReceipt, currency) {
  return {
    type: START_CHALLENGE_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function startChallengeError(address, currency) {
  return {
    type: START_CHALLENGE_ERROR,
    address,
    currency,
  };
}

export function startRequiredChallengesSuccess(address, currency) {
  return {
    type: START_REQUIRED_CHALLENGES_SUCCESS,
    address,
    currency,
  };
}

export function updateChallengeBlockHeight(address, currency, blockHeight) {
  return {
    type: UPDATE_START_CHALLENGE_BLOCK_HEIGHT,
    address,
    currency,
    blockHeight,
  };
}

export function loadTxRequestForPaymentChallengeSuccess(address, txRequest, currency, networkName) {
  return {
    type: LOAD_START_CHALLENGE_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function loadTxReceiptForPaymentChallengeSuccess(address, txReceipt, currency) {
  return {
    type: LOAD_START_CHALLENGE_TX_RECEIPT_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function settle(address, currency, options) {
  return {
    type: SETTLE,
    address,
    currency,
    options,
  };
}

export function settleSuccess(address, txReceipt, currency) {
  return {
    type: SETTLE_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function settleError(address, currency) {
  return {
    type: SETTLE_ERROR,
    address,
    currency,
  };
}

export function settleAllChallengesSuccess(address, currency) {
  return {
    type: SETTLE_ALL_CHALLENGES_SUCCESS,
    address,
    currency,
  };
}

export function loadTxRequestForSettlingSuccess(address, txRequest, currency, networkName) {
  return {
    type: LOAD_SETTLE_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function loadTxReceiptForSettlingSuccess(address, txReceipt, currency) {
  return {
    type: LOAD_SETTLE_TX_RECEIPT_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function withdraw(amount, address, currency, options) {
  return {
    type: WITHDRAW,
    amount,
    address,
    currency,
    options,
  };
}

export function withdrawSuccess(address, txReceipt, currency) {
  return {
    type: WITHDRAW_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function withdrawError(address, currency) {
  return {
    type: WITHDRAW_ERROR,
    address,
    currency,
  };
}

export function loadTxRequestForWithdrawSuccess(address, txRequest, currency, networkName) {
  return {
    type: LOAD_WITHDRAW_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function loadTxReceiptForWithdrawSuccess(address, txReceipt, currency) {
  return {
    type: LOAD_WITHDRAW_TX_RECEIPT_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function loadOngoingChallengesSuccess(address, currencyAddress, challenges) {
  return {
    type: LOAD_ONGOING_CHALLENGES_SUCCESS,
    address,
    currencyAddress,
    challenges,
  };
}

export function loadOngoingChallengesError(address, currencyAddress) {
  return {
    type: LOAD_ONGOING_CHALLENGES_ERROR,
    address,
    currencyAddress,
  };
}

export function loadSettleableChallengesSuccess(address, currencyAddress, challenges) {
  return {
    type: LOAD_SETTLEABLE_CHALLENGES_SUCCESS,
    address,
    currencyAddress,
    challenges,
  };
}

export function loadSettleableChallengesError(address, currencyAddress) {
  return {
    type: LOAD_SETTLEABLE_CHALLENGES_ERROR,
    address,
    currencyAddress,
  };
}

export function loadReceipts(address) {
  return {
    type: LOAD_NAHMII_RECEIPTS,
    address,
  };
}

export function loadReceiptsSuccess(address, receipts) {
  return {
    type: LOAD_NAHMII_RECEIPTS_SUCCESS,
    address,
    receipts,
  };
}

export function loadReceiptsError(address, error) {
  return {
    type: LOAD_NAHMII_RECEIPTS_ERROR,
    address,
    error,
  };
}
