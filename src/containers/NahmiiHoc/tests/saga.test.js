import { expectSaga } from 'redux-saga-test-plan';
import { eventChannel } from 'redux-saga';
import { fromJS } from 'immutable';
import nahmii from 'nahmii-sdk';
import { storeMock } from 'mocks/store';
import { currentNetworkMock } from 'containers/App/tests/mocks/selectors';
import { getIntl } from 'utils/localisation';
import BigNumber from 'bignumber.js';
import { showDecryptWalletModal } from 'containers/WalletHoc/actions';
import { notify, changeNetwork } from 'containers/App/actions';
import * as actions from '../actions';
import {
  loadBalances,
  makePayment,
  getSdkWalletSigner,
  deposit,
  depositEth,
  approveTokenDeposit,
  completeTokenDeposit,
  settle,
  stage,
  withdraw,
  changeNahmiiCurrency,
  loadSettlements,
  reloadSettlementStatesHook,
  listenReceiptEvent,
} from '../saga';
import nahmiiHocReducer from '../reducer';

describe('nahmiiHocSaga', () => {
  const withReducer = (state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action));
  const signerMock = {
    signMessage: () => {},
    signTransaction: () => {},
    address: storeMock.getIn(['walletHoc', 'currentWallet', 'address']),
  };

  describe('loadBalances', () => {
    const ct = '0x1';
    const address = '0x2';
    const balances = [{
      amount: '100',
      amountAvailable: '90',
      currency: { ct },
    }];
    it('should trigger loadBalancesSuccess and loadStagingBalancesSuccess actions and correctly calculate the staging balance', () => expectSaga(loadBalances, { address }, { nahmiiProvider: {} })
      .provide({
        call() {
          return balances;
        },
      })
      .put(actions.loadBalancesSuccess(address, [{ balance: '90', currency: ct }]))
      .put(actions.loadStagingBalancesSuccess(address, [{ balance: '10', currency: ct }]))
      .run({ silenceTimeout: true }));
    it('should trigger loadBalancesError when error thrown', () => expectSaga(loadBalances, { address }, { nahmiiProvider: {} })
      .provide({
        call() {
          throw new Error();
        },
      })
      .put(actions.loadBalancesError(address))
      .run({ silenceTimeout: true }));
  });
  describe('#listenReceiptEvent()', () => {
    const currency = '0x0000000000000000000000000000000000000000';
    const receipt = new nahmii.Receipt(nahmii.Payment.from({
      amount: '1',
      currency: {
        ct: currency,
        id: 0,
      },
      sender: {
        wallet: storeMock.getIn(['walletHoc', 'wallets', 0, 'address']),
      },
      recipient: {
        wallet: storeMock.getIn(['walletHoc', 'wallets', 1, 'address']),
      },
    }));

    it('should trigger receivedNewReceipt action when an receipt comes from the event API', () => {
      const disposeListener = jest.fn();
      return expectSaga(listenReceiptEvent)
        .withReducer(withReducer, storeMock)
        .provide({
          call(effect) {
            if (effect.fn.name === 'receiptEventChannel') {
              return eventChannel((emitter) => {
                setTimeout(() => {
                  emitter(receipt);
                }, 100);
                return () => {
                  disposeListener();
                };
              });
            }
            return true;
          },
        })
        .put(actions.newReceiptReceived(receipt.sender, receipt.toJSON()))
        .put(actions.newReceiptReceived(receipt.recipient, receipt.toJSON()))
        .run({ silenceTimeout: true })
        .then((result) => {
          const state = result.storeState;
          const receiptsByWallet1 = state.getIn(['nahmiiHoc', 'receipts', storeMock.getIn(['walletHoc', 'wallets', 0, 'address']), 'receipts']);
          expect(receiptsByWallet1).toEqual(
            storeMock
              .getIn(['nahmiiHoc', 'receipts', storeMock.getIn(['walletHoc', 'wallets', 0, 'address']), 'receipts'])
              .unshift(fromJS({ ...receipt.toJSON(), created: new Date().toISOString(), updated: new Date().toISOString() }))
          );
          const receiptsByWallet2 = state.getIn(['nahmiiHoc', 'receipts', storeMock.getIn(['walletHoc', 'wallets', 1, 'address']), 'receipts']);
          expect(receiptsByWallet2).toEqual(fromJS([{ ...receipt.toJSON(), created: new Date().toISOString(), updated: new Date().toISOString() }]));
          expect(disposeListener.mock.calls.length).toEqual(0);
        });
    });
    it('should trigger close the event channel when CHANGE_NETWORK is triggered', () => {
      const disposeListener = jest.fn();
      return expectSaga(listenReceiptEvent)
        .withReducer(withReducer, storeMock)
        .provide({
          call(effect) {
            if (effect.fn.name === 'receiptEventChannel') {
              return eventChannel((emitter) => {
                setTimeout(() => {
                  emitter(receipt);
                }, 100);
                return () => {
                  disposeListener();
                };
              });
            }
            return true;
          },
        })
        .dispatch(changeNetwork())
        .run({ silenceTimeout: true })
        .then(() => {
          expect(disposeListener).toBeCalled();
        });
    });
  });
  describe('makePayment', () => {
    let monetaryAmount;
    let recipient;
    let walletOverride;
    beforeEach(() => {
      monetaryAmount = nahmii.MonetaryAmount.from('1000', '0x0000000000000000000000000000000000000000');
      recipient = '0x0000000000000000000000000000000000000001';
      walletOverride = null;
    });

    it('should dispatch correct actions when wallet is encrypted', () => {
      walletOverride = { encrypted: true };
      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
        .withState(storeMock)
        .put(showDecryptWalletModal(actions.makeNahmiiPayment(monetaryAmount, recipient, walletOverride)))
        .put(actions.nahmiiPaymentError(new Error(getIntl().formatMessage({ id: 'wallet_encrypted_error' }))))
        .run({ silenceTimeout: true });
    });

    it('should dispatch correct actions on successful payment and registration', () => expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
      .withState(storeMock)
      .provide({
        call(effect, next) {
          if (effect.fn === getSdkWalletSigner) {
            return [
              signerMock,
              { type: 'ACTION1' },
              { type: 'ACTION2' },
            ];
          }
          if (effect.fn === nahmii.Payment.prototype.sign) {
            return true;
          }
          if (effect.fn === nahmii.Payment.prototype.register) {
            return true;
          }
          return next();
        },
      })
      .put({ type: 'ACTION1' })
      .put({ type: 'ACTION2' })
      .put(actions.nahmiiPaymentSuccess())
      .run({ silenceTimeout: true })
    );

    it('should dispatch correct actions on failed payment signing', () => {
      const errorMock = new Error('some error');

      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
        .withState(storeMock)
        .provide({
          call(effect, next) {
            if (effect.fn === getSdkWalletSigner) {
              return [
                signerMock,
                { type: 'ACTION1' },
                { type: 'ACTION2' },
              ];
            }
            if (effect.fn === nahmii.Payment.prototype.sign) {
              throw errorMock;
            }
            return next();
          },
        })
        .put({ type: 'ACTION1' })
        .put({ type: 'ACTION2' })
        .put(actions.nahmiiPaymentError(errorMock))
        .put(notify('error', 'send_transaction_failed_message_error,message:some error'))
        .run({ silenceTimeout: true });
    });
    it('should dispatch correct actions on failed payment registration', () => {
      const errorMock = new Error('some error registering payment');

      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
        .withState(storeMock)
        .provide({
          call(effect, next) {
            if (effect.fn === getSdkWalletSigner) {
              return [
                signerMock,
                { type: 'ACTION1' },
                { type: 'ACTION2' },
              ];
            }
            if (effect.fn === nahmii.Payment.prototype.sign) {
              return true;
            }
            if (effect.fn === nahmii.Payment.prototype.register) {
              throw errorMock;
            }
            return next();
          },
        })
        .put({ type: 'ACTION1' })
        .put({ type: 'ACTION2' })
        .put(actions.nahmiiPaymentError(errorMock))
        .put(notify('error', 'send_transaction_failed_message_error,message:some error registering payment'))
        .run({ silenceTimeout: true });
    });
    it('should dispatch correct actions on insufficient funds error', () => {
      const errorMock = new nahmii.InsufficientFundsError({ message: 'Insufficient funds: The minimum balance of this token is 0.01.' });

      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
        .withState(storeMock)
        .provide({
          call(effect, next) {
            if (effect.fn === getSdkWalletSigner) {
              return [
                signerMock,
                { type: 'ACTION1' },
                { type: 'ACTION2' },
              ];
            }
            if (effect.fn === nahmii.Payment.prototype.sign) {
              return true;
            }
            if (effect.fn === nahmii.Payment.prototype.register) {
              throw errorMock;
            }
            return next();
          },
        })
        .put({ type: 'ACTION1' })
        .put({ type: 'ACTION2' })
        .put(actions.nahmiiPaymentError(errorMock))
        .put(notify('error', 'nahmii_transfer_insufficient_funds_error,minimumBalance:0.01'))
        .run({ silenceTimeout: true });
    });
  });
  describe('deposit', () => {
    const amount = 1;
    const address = storeMock.getIn(['walletHoc', 'currentWallet', 'address']);
    const options = {};
    describe('ETH', () => {
      const symbol = 'ETH';
      describe('#deposit()', () => {
        it('should update ETH deposit status to true when NAHMII_DEPOSIT_ETH action is triggered', () => expectSaga(deposit, { address, symbol, amount, options })
          .withReducer(withReducer, storeMock)
          .put(actions.nahmiiDepositEth(address, amount, options))
          .run({ silenceTimeout: true })
          .then((result) => {
            const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, 'ETH']);
            expect(depositStatus.get('depositing')).toEqual(true);
            expect(depositStatus.get('error')).toEqual(null);
          })
        );
      });

      describe('#depositEth()', () => {
        it('should update ETH deposit status to true when NAHMII_DEPOSIT_ETH_SUCCESS action is triggered', () => expectSaga(depositEth, { address, amount, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect) {
              if (effect.fn === getSdkWalletSigner) {
                return [
                  signerMock,
                  { type: 'ACTION1' },
                  { type: 'ACTION2' },
                ];
              }
              if (effect.fn.name === 'bound depositEth') {
                return 'hash';
              }
              return null;
            },
          })
          .put(actions.nahmiiDepositEthSuccess(address))
          .run({ silenceTimeout: true })
          .then((result) => {
            const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, 'ETH']);
            expect(depositStatus.get('depositing')).toEqual(false);
            expect(depositStatus.get('error')).toEqual(null);
          })
        );
        it('should update error status when NAHMII_DEPOSIT_FAILED action is triggered', () => {
          const err = new Error('err');
          return expectSaga(depositEth, { address, amount, options })
            .withReducer(withReducer, storeMock)
            .provide({
              call(effect) {
                if (effect.fn === getSdkWalletSigner) {
                  throw err;
                }
              },
            })
            .put(actions.nahmiiDepositFailed(address, 'ETH', `An error occured: ${err.message}`))
            .run({ silenceTimeout: true })
            .then((result) => {
              const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, 'ETH']);
              expect(depositStatus.get('depositing')).toEqual(false);
              expect(depositStatus.get('error')).toEqual(`An error occured: ${err.message}`);
            });
        }
        );
      });
    });
    describe('token', () => {
      const symbol = 'TTT';
      describe('#deposit()', () => {
        it('should update approvingTokenDeposit to true when NAHMII_APPROVE_TOKEN_DEPOSIT action is triggered', () => expectSaga(deposit, { address, symbol, amount, options })
          .withReducer(withReducer, storeMock)
          .put(actions.nahmiiApproveTokenDeposit(address, symbol, amount, options))
          .run({ silenceTimeout: true })
          .then((result) => {
            const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
            expect(depositStatus.get('approvingTokenDeposit')).toEqual(true);
            expect(depositStatus.get('error')).toEqual(null);
          })
        );
        it('should update completingTokenDeposit to true when NAHMII_COMPLETE_TOKEN_DEPOSIT action is triggered', () => expectSaga(deposit, { address, symbol, amount, options })
          .withReducer(withReducer, storeMock)
          .put(actions.nahmiiApproveTokenDeposit(address, symbol, amount, options))
          .put(actions.nahmiiCompleteTokenDeposit(address, symbol, amount, options))
          .dispatch(actions.nahmiiApproveTokenDepositSuccess(address, symbol))
          .run({ silenceTimeout: true })
          .then((result) => {
            const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
            expect(depositStatus.get('approvingTokenDeposit')).toEqual(false);
            expect(depositStatus.get('completingTokenDeposit')).toEqual(true);
            expect(depositStatus.get('error')).toEqual(null);
          })
        );
        it('should update error when NAHMII_DEPOSIT_FAILED action is triggered', () => {
          const error = new Error();
          return expectSaga(deposit, { address, symbol, amount, options })
            .withReducer(withReducer, storeMock)
            .put(actions.nahmiiApproveTokenDeposit(address, symbol, amount, options))
            .not.put(actions.nahmiiCompleteTokenDeposit(address, symbol, amount, options))
            .dispatch(actions.nahmiiDepositFailed(address, symbol, error))
            .run(false)
            .then((result) => {
              const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
              expect(depositStatus.get('depositing')).toEqual(false);
              expect(depositStatus.get('approvingTokenDeposit')).toEqual(false);
              expect(depositStatus.get('completingTokenDeposit')).toEqual(false);
              expect(depositStatus.get('error')).toEqual(error);
            });
        }
        );
      });
      describe('#approveTokenDeposit()', () => {
        it('should update token deposit status to true when NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS action is triggered', () => expectSaga(approveTokenDeposit, { address, symbol, amount, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect) {
              if (effect.fn === getSdkWalletSigner) {
                return [
                  signerMock,
                  { type: 'ACTION1' },
                  { type: 'ACTION2' },
                ];
              }
              if (effect.fn.name === 'bound approveTokenDeposit') {
                return 'hash';
              }
              return null;
            },
          })
          .put(actions.nahmiiApproveTokenDepositSuccess(address, symbol))
          .run({ silenceTimeout: true })
          .then((result) => {
            const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
            expect(depositStatus.get('approvingTokenDeposit')).toEqual(false);
            expect(depositStatus.get('error')).toEqual(null);
          })
        );
        it('should update error status when NAHMII_DEPOSIT_FAILED action is triggered', () => {
          const err = new Error('err');
          return expectSaga(approveTokenDeposit, { address, symbol, amount, options })
            .withReducer(withReducer, storeMock)
            .provide({
              call(effect) {
                if (effect.fn === getSdkWalletSigner) {
                  throw err;
                }
              },
            })
            .put(actions.nahmiiDepositFailed(address, symbol, `An error occured: ${err.message}`))
            .run({ silenceTimeout: true })
            .then((result) => {
              const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
              expect(depositStatus.get('approvingTokenDeposit')).toEqual(false);
              expect(depositStatus.get('completingTokenDeposit')).toEqual(false);
              expect(depositStatus.get('error')).toEqual(`An error occured: ${err.message}`);
            });
        }
        );
      });
      describe('#completeTokenDeposit()', () => {
        it('should update token deposit status to true when NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS action is triggered', () => expectSaga(completeTokenDeposit, { address, symbol, amount, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect) {
              if (effect.fn === getSdkWalletSigner) {
                return [
                  signerMock,
                  { type: 'ACTION1' },
                  { type: 'ACTION2' },
                ];
              }
              if (effect.fn.name === 'bound completeTokenDeposit') {
                return 'hash';
              }
              return null;
            },
          })
          .put(actions.nahmiiCompleteTokenDepositSuccess(address, symbol))
          .run({ silenceTimeout: true })
          .then((result) => {
            const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
            expect(depositStatus.get('completingTokenDeposit')).toEqual(false);
            expect(depositStatus.get('error')).toEqual(null);
          })
        );
        it('should update error status when NAHMII_DEPOSIT_FAILED action is triggered', () => {
          const err = new Error('err');
          return expectSaga(completeTokenDeposit, { address, symbol, amount, options })
            .withReducer(withReducer, storeMock)
            .provide({
              call(effect) {
                if (effect.fn === getSdkWalletSigner) {
                  throw err;
                }
              },
            })
            .put(actions.nahmiiDepositFailed(address, symbol, `An error occured: ${err.message}`))
            .run({ silenceTimeout: true })
            .then((result) => {
              const depositStatus = result.storeState.getIn(['nahmiiHoc', 'depositStatus', address, symbol]);
              expect(depositStatus.get('approvingTokenDeposit')).toEqual(false);
              expect(depositStatus.get('completingTokenDeposit')).toEqual(false);
              expect(depositStatus.get('error')).toEqual(`An error occured: ${err.message}`);
            });
        }
        );
      });
    });
  });
  describe('settlement operations', () => {
    const options = { gasLimit: 1, gasPrice: 1 };
    const currency = '0x0000000000000000000000000000000000000001';
    const stageAmount = new BigNumber(10000000000000000000000);
    const fakeTxs = [{ chainId: 3, hash: 'hash1', nonce: 1 }, { chainId: 3, hash: 'hash2', nonce: 2 }];
    const fakeTxReceipts = [{ transactionHash: 'hash1', status: 1 }, { transactionHash: 'hash2', status: 1 }];

    describe('load settlement states', () => {
      describe('#loadSettlements', () => {
        describe('when loads successfully', () => {
          const expectedResponse = [{ toJSON: () => ({ stageAmount: '1' }) }];
          it('dispatches loadSettleableChallengesSuccess and update store correctly', () => expectSaga(loadSettlements, { address: signerMock.address, currency }, currentNetworkMock)
            .withReducer(withReducer, storeMock.setIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading'], true))
            .provide({
              call() {
                return expectedResponse;
              },
            })
            .put(actions.loadSettlementsSuccess(signerMock.address, currency, expectedResponse))
            .run({ silenceTimeout: true })
            .then((result) => {
              const loading = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading']);
              expect(loading).toEqual(false);
              const settlements = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'details']);
              expect(settlements).toEqual(fromJS(expectedResponse.map((s) => s.toJSON())));
            })
          );
        });
        describe('when failed', () => {
          const error = new Error();
          it('dispatches loadSettlementsError and update store correctly', () => expectSaga(loadSettlements, { address: signerMock.address, currency }, currentNetworkMock)
            .withReducer(withReducer, storeMock.setIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading'], true))
            .provide({
              call() {
                throw error;
              },
            })
            .put(actions.loadSettlementsError(signerMock.address, currency, error))
            .run({ silenceTimeout: true })
            .then((result) => {
              const loading = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading']);
              expect(loading).toEqual(true);
              const settlements = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'details']);
              expect(settlements).toEqual(null);
            })
          );
        });
      });
      describe('#reloadSettlementStatesHook', () => {
        it('dispatches loadSettlements and update store correctly', () => expectSaga(reloadSettlementStatesHook, {})
          .withReducer(withReducer,
            storeMock
              .setIn(['nahmiiHoc', 'selectedCurrency'], currency)
              .setIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading'], false)
          )
          .put(actions.reloadSettlementStates(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const loading = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading']);
            expect(loading).toEqual(true);
          })
        );
      });
      describe('#changeNahmiiCurrency', () => {
        it('should dispatch reloadSettlementStates when loading challenge status has not been initialised yet', () => expectSaga(changeNahmiiCurrency, {})
          .withReducer(withReducer,
            storeMock
              .setIn(['nahmiiHoc', 'selectedCurrency'], currency)
              .setIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading'], undefined)
          )
          .put(actions.reloadSettlementStates(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const loading = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading']);
            expect(loading).toEqual(true);
          })
        );
        [
          true,
          false,
        ].forEach((loading) => {
          it('should not dispatch reloadSettlementStates when loading challenge status has been initialised', () => expectSaga(changeNahmiiCurrency, {})
            .withReducer(withReducer,
              storeMock
                .setIn(['nahmiiHoc', 'selectedCurrency'], currency)
                .setIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'loading'], loading)
            )
            .not.put(actions.reloadSettlementStates(signerMock.address, currency))
            .run({ silenceTimeout: true })
          );
        });
      });
    });

    describe('#settle()', () => {
      let requiredSettlements;
      it('should dispatch correct actions when wallet is encrypted', () => expectSaga(settle, { stageAmount, currency, options })
        .withState(storeMock)
        .provide({
          select() {
            return fromJS({ address: signerMock.address, encrypted: {}, decrypted: null });
          },
        })
        .put(showDecryptWalletModal(actions.settle(signerMock.address, currency, stageAmount, options)))
        .put(actions.settleError(signerMock.address, currency))
        .not.put(actions.startRequiredSettlementsSuccess(signerMock.address, currency))
        .run({ silenceTimeout: true }));

      describe('when successful', () => {
        describe('when starts one new settlement', () => {
          beforeEach(() => {
            requiredSettlements = [{ toJSON: () => ({ type: 'payment' }), start: () => {} }];
          });
          it('updates store', () => expectSaga(settle, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
            .withReducer(withReducer, storeMock)
            .provide({
              call(effect, next) {
                if (effect.fn.name.includes('calculateRequiredSettlements')) {
                  const { amount } = effect.args[1].toJSON();
                  expect(amount).toEqual(stageAmount.toFixed());
                  return requiredSettlements;
                }
                if (effect.fn.name.includes('start')) {
                  return fakeTxs[0];
                }
                if (effect.fn.name === 'waitForTransaction') {
                  return fakeTxs[0];
                }
                if (effect.fn.name === 'getTransactionReceipt') {
                  return fakeTxReceipts[0];
                }
                if (effect.fn === getSdkWalletSigner) {
                  return [
                    signerMock,
                    { type: 'ACTION1' },
                    { type: 'ACTION2' },
                  ];
                }
                return next();
              },
            })
            .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[0], currency))
            .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[0], currency))
            .put(actions.startRequiredSettlementsSuccess(signerMock.address, currency))
            .run({ silenceTimeout: true })
            .then((result) => {
              const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'settling', 'status']);
              expect(status).toEqual('success');
            })
          );
        });
        describe('when starts more than one settlement', () => {
          beforeEach(() => {
            requiredSettlements = [
              { toJSON: () => ({ type: 'payment' }), start: () => {} },
              { toJSON: () => ({ type: 'onchain-balance' }), start: () => {} },
            ];
          });
          it('updates store', () => {
            let startedChallenges = 0;
            return expectSaga(settle, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name.includes('calculateRequiredSettlements')) {
                    return requiredSettlements;
                  }
                  if (effect.fn.name.includes('start')) {
                    return fakeTxs[startedChallenges];
                  }
                  if (effect.fn.name === 'waitForTransaction') {
                    return fakeTxs[startedChallenges];
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    const receipt = fakeTxReceipts[startedChallenges];
                    startedChallenges += 1;
                    return receipt;
                  }
                  if (effect.fn === getSdkWalletSigner) {
                    return [
                      signerMock,
                      { type: 'ACTION1' },
                      { type: 'ACTION2' },
                    ];
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[0], currency))
              .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[1], currency))
              .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[0], currency))
              .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[1], currency))
              .put(actions.startRequiredSettlementsSuccess(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'settling', 'status']);
                expect(status).toEqual('success');
              });
          }
          );
        });
      });

      describe('when failed', () => {
        let failedTxReceipt;
        describe('when failed one of the required settlement', () => {
          beforeEach(() => {
            requiredSettlements = [
              { toJSON: () => ({ type: 'payment' }), start: () => {} },
              { toJSON: () => ({ type: 'onchain-balance' }), start: () => {} },
            ];
            failedTxReceipt = { transactionHash: 'hash2', status: 0 };
          });
          it('should correctly update store after failed to start one of the required challenges', () => {
            let startedChallenges = 0;
            return expectSaga(settle, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name.includes('calculateRequiredSettlements')) {
                    return requiredSettlements;
                  }
                  if (effect.fn.name.includes('start')) {
                    return fakeTxs[startedChallenges];
                  }
                  if (effect.fn.name === 'waitForTransaction') {
                    return fakeTxs[startedChallenges];
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    const receipt = fakeTxReceipts[startedChallenges];
                    if (startedChallenges === 1) {
                      return failedTxReceipt;
                    }
                    startedChallenges += 1;
                    return receipt;
                  }
                  if (effect.fn === getSdkWalletSigner) {
                    return [
                      signerMock,
                      { type: 'ACTION1' },
                      { type: 'ACTION2' },
                    ];
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[0], currency))
              .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[1], currency))
              .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[0], currency))
              .put(actions.settleError(signerMock.address, currency))
              .not.put(actions.startRequiredSettlementsSuccess(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'settling', 'status']);
                expect(status).toEqual('failed');
              });
          }
          );
          it('should correctly update store when failed to mine transaction', () => {
            const failedTx = { status: 0, transactionHash: fakeTxReceipts[0].transactionHash };

            return expectSaga(settle, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name.includes('calculateRequiredSettlements')) {
                    return requiredSettlements;
                  }
                  if (effect.fn.name.includes('start')) {
                    return fakeTxs[0];
                  }
                  if (effect.fn.name === 'waitForTransaction') {
                    return fakeTxs[0];
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    return failedTx;
                  }
                  if (effect.fn === getSdkWalletSigner) {
                    return [
                      signerMock,
                      { type: 'ACTION1' },
                      { type: 'ACTION2' },
                    ];
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[0], currency))
              .put(actions.settleError(signerMock.address, currency))
              .not.put(actions.startRequiredSettlementsSuccess(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'settling', 'status']);
                expect(status).toEqual('failed');
              });
          }
          );
        });
      });
    });
    describe('#stage()', () => {
      let stageableSettlements;
      it('dispatches correct actions when wallet is encrypted', () => expectSaga(stage, { address: signerMock.address, currency, options })
        .withState(storeMock)
        .provide({
          select() {
            return fromJS({ address: signerMock.address, encrypted: {}, decrypted: null });
          },
        })
        .put(showDecryptWalletModal(actions.stage(signerMock.address, currency, options)))
        .put(actions.stageError(signerMock.address, currency))
        .not.put(actions.stageAllSettlementsSuccess(signerMock.address, currency))
        .run({ silenceTimeout: true }));

      describe('when successful', () => {
        describe('when stages one settlement', () => {
          beforeEach(() => {
            stageableSettlements = [{ type: 'payment', isStageable: true, stage: () => {} }];
          });
          it('updates store', () => expectSaga(stage, { currency, options })
            .withReducer(withReducer, storeMock)
            .provide({
              call(effect, next) {
                if (effect.fn.name.includes('getAllSettlements')) {
                  return stageableSettlements;
                }
                if (effect.fn.name.includes('stage')) {
                  return fakeTxs[0];
                }
                if (effect.fn.name === 'waitForTransaction') {
                  return fakeTxs[0];
                }
                if (effect.fn.name === 'getTransactionReceipt') {
                  return fakeTxReceipts[0];
                }
                if (effect.fn === getSdkWalletSigner) {
                  return [
                    signerMock,
                    { type: 'ACTION1' },
                    { type: 'ACTION2' },
                  ];
                }
                return next();
              },
            })
            .put(actions.loadTxRequestForStagingSuccess(signerMock.address, fakeTxs[0], currency))
            .put(actions.stageSuccess(signerMock.address, fakeTxReceipts[0], currency))
            .put(actions.stageAllSettlementsSuccess(signerMock.address, currency))
            .run({ silenceTimeout: true })
            .then((result) => {
              const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'staging', 'status']);
              expect(status).toEqual('success');
            })
          );
        });
        describe('when stages more than one settlement', () => {
          beforeEach(() => {
            stageableSettlements = [
              { type: 'payment', isStageable: true, stage: () => {} },
              { type: 'onchain-balance', isStageable: true, stage: () => {} },
            ];
          });
          it('updates store', () => {
            let settledChallenges = 0;
            return expectSaga(stage, { currency, options })
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name.includes('getAllSettlements')) {
                    return stageableSettlements;
                  }
                  if (effect.fn.name.includes('stage')) {
                    return fakeTxs[settledChallenges];
                  }
                  if (effect.fn.name === 'waitForTransaction') {
                    return fakeTxs[settledChallenges];
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    const receipt = fakeTxReceipts[settledChallenges];
                    settledChallenges += 1;
                    return receipt;
                  }
                  if (effect.fn === getSdkWalletSigner) {
                    return [
                      signerMock,
                      { type: 'ACTION1' },
                      { type: 'ACTION2' },
                    ];
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForStagingSuccess(signerMock.address, fakeTxs[0], currency))
              .put(actions.loadTxRequestForStagingSuccess(signerMock.address, fakeTxs[1], currency))
              .put(actions.stageSuccess(signerMock.address, fakeTxReceipts[0], currency))
              .put(actions.stageSuccess(signerMock.address, fakeTxReceipts[1], currency))
              .put(actions.stageAllSettlementsSuccess(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'staging', 'status']);
                expect(status).toEqual('success');
              });
          }
          );
        });
      });

      describe('when failed', () => {
        describe('failed to stage one of the settlements', () => {
          beforeEach(() => {
            stageableSettlements = [
              { type: 'payment', isStageable: true, stage: () => {} },
              { type: 'onchain-balance', isStageable: true, stage: () => {} },
            ];
          });
          it('updates store', () => {
            const failedTxReceipt = { transactionHash: 'hash2', status: 0 };
            let settledChallenges = 0;
            return expectSaga(stage, { currency, options })
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name.includes('getAllSettlements')) {
                    return stageableSettlements;
                  }
                  if (effect.fn.name.includes('stage')) {
                    return fakeTxs[settledChallenges];
                  }
                  if (effect.fn.name === 'waitForTransaction') {
                    return fakeTxs[settledChallenges];
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    if (settledChallenges === 1) {
                      return failedTxReceipt;
                    }
                    const receipt = fakeTxReceipts[settledChallenges];
                    settledChallenges += 1;
                    return receipt;
                  }
                  if (effect.fn === getSdkWalletSigner) {
                    return [
                      signerMock,
                      { type: 'ACTION1' },
                      { type: 'ACTION2' },
                    ];
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForStagingSuccess(signerMock.address, fakeTxs[0], currency))
              .put(actions.loadTxRequestForStagingSuccess(signerMock.address, fakeTxs[1], currency))
              .put(actions.stageSuccess(signerMock.address, fakeTxReceipts[0], currency))
              .put(actions.stageError(signerMock.address, currency))
              .not.put(actions.stageAllSettlementsSuccess(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'staging', 'status']);
                expect(status).toEqual('failed');
              });
          }
          );
        });
        describe('when transaction failed', () => {
          const failedTxReceipt = { status: 0, transactionHash: fakeTxReceipts[0].transactionHash };
          it('updates store', () => {
            stageableSettlements = [
              { type: 'payment', isStageable: true, stage: () => {} },
            ];
            return expectSaga(stage, { currency, options })
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name.includes('getAllSettlements')) {
                    return stageableSettlements;
                  }
                  if (effect.fn.name.includes('stage')) {
                    return fakeTxs[0];
                  }
                  if (effect.fn.name === 'waitForTransaction') {
                    return fakeTxs[0];
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    return failedTxReceipt;
                  }
                  if (effect.fn === getSdkWalletSigner) {
                    return [
                      signerMock,
                      { type: 'ACTION1' },
                      { type: 'ACTION2' },
                    ];
                  }
                  return next();
                },
              })
              .put(actions.stageError(signerMock.address, currency))
              .not.put(actions.stageAllSettlementsSuccess(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'settlements', signerMock.address, currency, 'staging', 'status']);
                expect(status).toEqual('failed');
              });
          }
          );
        });
      });
    });

    describe('#withdraw', () => {
      const amount = stageAmount;
      it('should dispatch correct actions when wallet is encrypted', () => expectSaga(withdraw, { amount, address: signerMock.address, currency, options })
        .withState(storeMock)
        .provide({
          select() {
            return fromJS({ address: signerMock.address, encrypted: {}, decrypted: null });
          },
        })
        .put(showDecryptWalletModal(actions.withdraw(amount, signerMock.address, currency, options)))
        .put(actions.withdrawError(signerMock.address, currency))
        .run({ silenceTimeout: true }));

      it('should correctly update store after a success withdrawal', () => expectSaga(withdraw, { amount, currency, options })
        .withReducer(withReducer, storeMock)
        .provide({
          call(effect, next) {
            if (effect.fn.name.includes('withdraw')) {
              const _amount = effect.args[0].toJSON().amount;
              expect(_amount).toEqual(amount.toFixed());
              return fakeTxs[0];
            }
            if (effect.fn.name === 'waitForTransaction') {
              return fakeTxs[0];
            }
            if (effect.fn.name === 'getTransactionReceipt') {
              return fakeTxReceipts[0];
            }
            if (effect.fn === getSdkWalletSigner) {
              return [
                signerMock,
                { type: 'ACTION1' },
                { type: 'ACTION2' },
              ];
            }
            return next();
          },
        })
        .put(actions.loadTxRequestForWithdrawSuccess(signerMock.address, fakeTxs[0], currency))
        .put(actions.withdrawSuccess(signerMock.address, fakeTxReceipts[0], currency))
        .run({ silenceTimeout: true })
        .then((result) => {
          const status = result.storeState.getIn(['nahmiiHoc', 'withdrawals', signerMock.address, currency, 'status']);
          expect(status).toEqual('success');
          const tx = result.storeState.getIn(['nahmiiHoc', 'withdrawals', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
          expect(tx).toEqual(fakeTxReceipts[0]);
        })
      );

      it('should correctly update store after failed to mine the transaction', () => {
        const failedTxReceipt = { status: 0, transactionHash: fakeTxReceipts[0].transactionHash };
        return expectSaga(withdraw, { amount, currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('withdraw')) {
                return fakeTxs[0];
              }
              if (effect.fn.name === 'waitForTransaction') {
                return fakeTxs[0];
              }
              if (effect.fn.name === 'getTransactionReceipt') {
                return failedTxReceipt;
              }
              if (effect.fn === getSdkWalletSigner) {
                return [
                  signerMock,
                  { type: 'ACTION1' },
                  { type: 'ACTION2' },
                ];
              }
              return next();
            },
          })
          .put(actions.loadTxRequestForWithdrawSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.withdrawError(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'withdrawals', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
            const tx = result.storeState.getIn(['nahmiiHoc', 'withdrawals', signerMock.address, currency, 'transactions', failedTxReceipt.transactionHash]);
            expect(tx).toEqual(failedTxReceipt);
          });
      });

      it('should correctly update store when wallet.withdraw throws exception', () => {
        const fakeError = new Error('error');

        return expectSaga(withdraw, { amount, currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('withdraw')) {
                throw fakeError;
              }
              if (effect.fn === getSdkWalletSigner) {
                return [
                  signerMock,
                  { type: 'ACTION1' },
                  { type: 'ACTION2' },
                ];
              }
              return next();
            },
          })
          .put(actions.withdrawError(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'withdrawals', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
          });
      }
      );
    });
  });
});
