import {
  SET_SELECTED_WALLET_CURRENCY,
  LOAD_NAHMII_BALANCES,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  START_PAYMENT_CHALLENGE,
  START_PAYMENT_CHALLENGE_SUCCESS,
  START_PAYMENT_CHALLENGE_ERROR,
  LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST,
  SETTLE_PAYMENT_DRIIP,
  SETTLE_PAYMENT_DRIIP_SUCCESS,
  SETTLE_PAYMENT_DRIIP_ERROR,
  LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_CURRENT_PAYMENT_CHALLENGE,
  LOAD_ONGOING_CHALLENGES_SUCCESS,
  LOAD_ONGOING_CHALLENGES_ERROR,
  LOAD_SETTLEABLE_CHALLENGES_SUCCESS,
  LOAD_SETTLEABLE_CHALLENGES_ERROR,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
  LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
  LOAD_SETTLEMENT,
  LOAD_SETTLEMENT_SUCCESS,
  LOAD_SETTLEMENT_ERROR,
  LOAD_RECEIPTS,
  LOAD_RECEIPTS_SUCCESS,
  LOAD_RECEIPTS_ERROR,
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
} from './constants';

export function setSelectedWalletCurrency(currencyAddress) {
  return {
    type: SET_SELECTED_WALLET_CURRENCY,
    currencyAddress,
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

export function startPaymentChallenge(receipt, stageAmount, currency) {
  return {
    type: START_PAYMENT_CHALLENGE,
    receipt,
    stageAmount,
    currency,
  };
}

export function startPaymentChallengeSuccess(address, txReceipt, currency) {
  return {
    type: START_PAYMENT_CHALLENGE_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function startPaymentChallengeError(address, txReceipt, currency) {
  return {
    type: START_PAYMENT_CHALLENGE_ERROR,
    address,
    txReceipt,
    currency,
  };
}

export function loadTxRequestForPaymentChallenge(address, txRequest, currency, networkName) {
  return {
    type: LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function settlePaymentDriip(receipt, currency) {
  return {
    type: SETTLE_PAYMENT_DRIIP,
    receipt,
    currency,
  };
}

export function settlePaymentDriipSuccess(address, txReceipt, currency) {
  return {
    type: SETTLE_PAYMENT_DRIIP_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function settlePaymentDriipError(address, txReceipt, currency) {
  return {
    type: SETTLE_PAYMENT_DRIIP_ERROR,
    address,
    txReceipt,
    currency,
  };
}

export function loadTxRequestForSettlePaymentDriip(address, txRequest, currency, networkName) {
  return {
    type: LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function withdraw(amount, currency) {
  return {
    type: WITHDRAW,
    amount,
    currency,
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

export function withdrawError(address, txReceipt, currency) {
  return {
    type: WITHDRAW_ERROR,
    address,
    txReceipt,
    currency,
  };
}

export function loadTxRequestForWithdraw(address, txRequest, currency, networkName) {
  return {
    type: LOAD_WITHDRAW_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function loadCurrentPaymentChallenge(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE,
    address,
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

export function loadCurrentPaymentChallengePhase(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE,
    address,
  };
}

export function loadCurrentPaymentChallengePhaseSuccess(address, phase) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
    address,
    phase,
  };
}

export function loadCurrentPaymentChallengePhaseError(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
    address,
  };
}

export function loadCurrentPaymentChallengeStatus(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS,
    address,
  };
}

export function loadCurrentPaymentChallengeStatusSuccess(address, status) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
    address,
    status,
  };
}

export function loadCurrentPaymentChallengeStatusError(address) {
  return {
    type: LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
    address,
  };
}

export function loadSettlement(address) {
  return {
    type: LOAD_SETTLEMENT,
    address,
  };
}

export function loadSettlementSuccess(address, settlement) {
  return {
    type: LOAD_SETTLEMENT_SUCCESS,
    address,
    settlement,
  };
}

export function loadSettlementError(address) {
  return {
    type: LOAD_SETTLEMENT_ERROR,
    address,
  };
}

export function loadReceipts(address) {
  return {
    type: LOAD_RECEIPTS,
    address,
  };
}

export function loadReceiptsSuccess(address, receipts) {
  return {
    type: LOAD_RECEIPTS_SUCCESS,
    address,
    receipts,
  };
}

export function loadReceiptsError(address) {
  return {
    type: LOAD_RECEIPTS_ERROR,
    address,
  };
}
