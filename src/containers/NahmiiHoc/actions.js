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
  SETTLE,
  SETTLE_SUCCESS,
  SETTLE_ERROR,
  START_REQUIRED_SETTLEMENTS_SUCCESS,
  LOAD_SETTLE_TX_REQUEST,
  LOAD_SETTLE_RECEIPT_SUCCESS,
  LOAD_SETTLE_TX_RECEIPT_ERROR,
  STAGE,
  STAGE_SUCCESS,
  STAGE_ERROR,
  LOAD_STAGE_TX_REQUEST,
  LOAD_STAGE_TX_RECEIPT_SUCCESS,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_WITHDRAW_TX_RECEIPT_SUCCESS,
  LOAD_SETTLEMENTS,
  LOAD_SETTLEMENTS_SUCCESS,
  LOAD_SETTLEMENTS_ERROR,
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
  STAGE_ALL_SETTLEMENTS_SUCCESS,
  RELOAD_SETTLEMENT_STATES,
  NEW_RECEIPT_RECEIVED,
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

export function nahmiiDepositEthSuccess(address) {
  return {
    type: NAHMII_DEPOSIT_ETH_SUCCESS,
    address,
  };
}

export function nahmiiApproveTokenDepositSuccess(address, symbol) {
  return {
    type: NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
    address,
    symbol,
  };
}

export function nahmiiCompleteTokenDepositSuccess(address, symbol) {
  return {
    type: NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
    address,
    symbol,
  };
}

export function nahmiiDepositFailed(address, symbol, errorMessage) {
  return {
    type: NAHMII_DEPOSIT_FAILED,
    error: errorMessage,
    address,
    symbol,
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

export function settle(address, currency, stageAmount, options) {
  return {
    type: SETTLE,
    address,
    stageAmount,
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

export function startRequiredSettlementsSuccess(address, currency) {
  return {
    type: START_REQUIRED_SETTLEMENTS_SUCCESS,
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
    type: LOAD_SETTLE_RECEIPT_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function loadTxReceiptForSettlementError(address, currency, txReceipt) {
  return {
    type: LOAD_SETTLE_TX_RECEIPT_ERROR,
    address,
    currency,
    txReceipt,
  };
}

export function stage(address, currency, options) {
  return {
    type: STAGE,
    address,
    currency,
    options,
  };
}

export function stageSuccess(address, txReceipt, currency) {
  return {
    type: STAGE_SUCCESS,
    address,
    txReceipt,
    currency,
  };
}

export function stageError(address, currency) {
  return {
    type: STAGE_ERROR,
    address,
    currency,
  };
}

export function stageAllSettlementsSuccess(address, currency) {
  return {
    type: STAGE_ALL_SETTLEMENTS_SUCCESS,
    address,
    currency,
  };
}

export function loadTxRequestForStagingSuccess(address, txRequest, currency, networkName) {
  return {
    type: LOAD_STAGE_TX_REQUEST,
    address,
    txRequest,
    currency,
    networkName,
  };
}

export function loadTxReceiptForStagingSuccess(address, txReceipt, currency) {
  return {
    type: LOAD_STAGE_TX_RECEIPT_SUCCESS,
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


export function loadSettlements(address, currencyAddress) {
  return {
    type: LOAD_SETTLEMENTS,
    address,
    currencyAddress,
  };
}

export function loadSettlementsSuccess(address, currencyAddress, settlements) {
  return {
    type: LOAD_SETTLEMENTS_SUCCESS,
    address,
    currencyAddress,
    settlements,
  };
}

export function loadSettlementsError(address, currencyAddress, error) {
  return {
    type: LOAD_SETTLEMENTS_ERROR,
    address,
    currencyAddress,
    error,
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

export function newReceiptReceived(address, receipt) {
  return {
    type: NEW_RECEIPT_RECEIVED,
    address,
    receipt: {
      ...receipt,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    },
  };
}

export function reloadSettlementStates(address, currency) {
  return {
    type: RELOAD_SETTLEMENT_STATES,
    address,
    currency,
  };
}
