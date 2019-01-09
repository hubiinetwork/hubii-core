import { fromJS } from 'immutable';


import { changeNetwork } from 'containers/App/actions';
import nahmiiHocReducer from '../reducer';
import {
  loadBalancesSuccess,
  loadStagedBalancesSuccess,
  loadStagingBalancesSuccess,
  enableNahmiiMainnet,
  disableNahmiiMainnet,
  showDisclaimerBtn,
  hideDisclaimerBtn,
} from '../actions';

describe('nahmiiHocReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      wallets: {},
      balances: {},
      receipts: {},
      transactions: {},
      depositStatus: {
        depositingEth: false,
        approvingTokenDeposit: false,
        completingTokenDeposit: false,
        error: null,
      },
      disclaimerModal: {
        showBtn: true,
        enableMainnet: false,
      },
    });
  });

  it('returns the initial state', () => {
    expect(nahmiiHocReducer(undefined, {})).toEqual(state);
  });

  it('should handle loadNahmiiBalancesSuccess correctly', () => {
    const address = '0x0001';
    const testState = state
      .setIn(['balances', address, 'available', 'loading'], true)
      .setIn(['balances', address, 'available', 'error'], 'someerr');
    const balances = fromJS(['123', '321']);
    const expected = state
      .setIn(['balances', address, 'available', 'loading'], false)
      .setIn(['balances', address, 'available', 'error'], null)
      .setIn(['balances', address, 'available', 'assets'], balances);
    expect(nahmiiHocReducer(testState, loadBalancesSuccess(address, balances))).toEqual(expected);
  });

  it('should handle loadNahmiiStagedBalancesSuccess correctly', () => {
    const address = '0x0001';
    const testState = state
      .setIn(['balances', address, 'staged', 'loading'], true)
      .setIn(['balances', address, 'staged', 'error'], 'someerr');
    const balances = fromJS(['123', '321']);
    const expected = state
      .setIn(['balances', address, 'staged', 'loading'], false)
      .setIn(['balances', address, 'staged', 'error'], null)
      .setIn(['balances', address, 'staged', 'assets'], balances);
    expect(nahmiiHocReducer(testState, loadStagedBalancesSuccess(address, balances))).toEqual(expected);
  });

  it('should handle loadNahmiiStagingBalancesSuccess correctly', () => {
    const address = '0x0001';
    const testState = state
      .setIn(['balances', address, 'staging', 'loading'], true)
      .setIn(['balances', address, 'staging', 'error'], 'someerr');
    const balances = fromJS(['123', '321']);
    const expected = state
      .setIn(['balances', address, 'staging', 'loading'], false)
      .setIn(['balances', address, 'staging', 'error'], null)
      .setIn(['balances', address, 'staging', 'assets'], balances);
    expect(nahmiiHocReducer(testState, loadStagingBalancesSuccess(address, balances))).toEqual(expected);
  });

  it('should handle enableNahmiiMainnet action correctly', () => {
    const testState = state
      .setIn(['disclaimerModal', 'enableMainnet'], false);
    const expected = state
      .setIn(['disclaimerModal', 'enableMainnet'], true);
    expect(nahmiiHocReducer(testState, enableNahmiiMainnet())).toEqual(expected);
  });

  it('should handle disableNahmiiMainnet action correctly', () => {
    const testState = state
      .setIn(['disclaimerModal', 'enableMainnet'], true);
    const expected = state
      .setIn(['disclaimerModal', 'enableMainnet'], false);
    expect(nahmiiHocReducer(testState, disableNahmiiMainnet())).toEqual(expected);
  });

  it('should handle showDisclaimerBtn action correctly', () => {
    const testState = state
      .setIn(['disclaimerModal', 'showBtn'], false);
    const expected = state
      .setIn(['disclaimerModal', 'showBtn'], true);
    expect(nahmiiHocReducer(testState, showDisclaimerBtn())).toEqual(expected);
  });

  it('should handle hideDisclaimerBtn action correctly', () => {
    const testState = state
      .setIn(['disclaimerModal', 'showBtn'], true);
    const expected = state
      .setIn(['disclaimerModal', 'showBtn'], false);
    expect(nahmiiHocReducer(testState, hideDisclaimerBtn())).toEqual(expected);
  });

  it('should handle changeNetwork correctly', () => {
    const testState = state
      .set('balances', fromJS({ '0x001': '123' }))
      .set('transactions', fromJS({ '0x001': '123' }))
      .set('receipts', fromJS({ '0x001': '123' }));
    const expected = state
      .set('balances', fromJS({}))
      .set('transactions', fromJS({}))
      .set('receipts', fromJS({}));
    expect(nahmiiHocReducer(testState, changeNetwork())).toEqual(expected);
  });
});
