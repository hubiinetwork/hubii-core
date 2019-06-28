import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';
import nahmii from 'nahmii-sdk';
import { storeMock } from 'mocks/store';
import { currentNetworkMock } from 'containers/App/tests/mocks/selectors';
import { getIntl } from 'utils/localisation';
import BigNumber from 'bignumber.js';
import { showDecryptWalletModal } from 'containers/WalletHoc/actions';
import { notify } from 'containers/App/actions';
import * as actions from '../actions';
import {
  loadBalances,
  makePayment,
  getSdkWalletSigner,
  startChallenge,
  settle,
  withdraw,
  changeNahmiiCurrency,
  loadOngoingChallenges,
  loadSettleableChallenges,
  reloadSettlementStatesHook,
  processTx,
  processPendingSettlementTransactions,
} from '../saga';
import nahmiiHocReducer from '../reducer';

describe('nahmiiHocSaga', () => {
  const withReducer = (state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action));

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
  describe('makePayment', () => {
    let monetaryAmount;
    let recipient;
    let walletOverride;
    const signerMock = {
      signMessage: () => {},
      signTransaction: () => {},
      address: '0x0000000000000000000000000000000000000001',
    };
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
          if (effect.fn === nahmii.Settlement.prototype.hasOffchainSynchronised) {
            return true;
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
          if (effect.fn === nahmii.Settlement.prototype.hasOffchainSynchronised) {
            return true;
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
      .put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: errorMock.message })))
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
          if (effect.fn === nahmii.Settlement.prototype.hasOffchainSynchronised) {
            return true;
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
      .put(notify('error', getIntl().formatMessage({ id: 'send_transaction_failed_message_error' }, { message: errorMock.message })))
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
          if (effect.fn === nahmii.Settlement.prototype.hasOffchainSynchronised) {
            return true;
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
      .put(notify('error', getIntl().formatMessage({ id: 'nahmii_transfer_insufficient_funds_error' }, { minimumBalance: errorMock.minimumBalance })))
      .run({ silenceTimeout: true });
    });
    it('should dispatch correct actions on payment lock errors when the transaction is in requesting status', () => {
      const error = new Error('Payment is locked until the settlement transaction is confirmed.');
      const walletAddress = storeMock.getIn(['walletHoc', 'currentWallet', 'address']);
      const { currency } = monetaryAmount.toJSON();
      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
      .withState(
        storeMock
          .setIn(['nahmiiHoc', 'ongoingChallenges', walletAddress, currency.ct, 'status'], 'requesting')
      )
      .put(actions.nahmiiPaymentError(error))
      .put(notify('error', getIntl().formatMessage({ id: 'nahmii_settlement_lock_transfer' })))
      .run({ silenceTimeout: true });
    });
    it('should dispatch correct actions on payment lock errors when the transaction is in mining status', () => {
      const error = new Error('Payment is locked until the settlement transaction is confirmed.');
      const walletAddress = storeMock.getIn(['walletHoc', 'currentWallet', 'address']);
      const { currency } = monetaryAmount.toJSON();
      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
      .withState(
        storeMock
          .setIn(['nahmiiHoc', 'ongoingChallenges', walletAddress, currency.ct, 'status'], 'mining')
      )
      .put(actions.nahmiiPaymentError(error))
      .put(notify('error', getIntl().formatMessage({ id: 'nahmii_settlement_lock_transfer' })))
      .run({ silenceTimeout: true });
    });
    it('should dispatch correct actions on payment lock errors when off-chain balance is not yet synchronised with the contracts', () => {
      const error = new Error('Payment is locked until off-chain balance is synchronised.');
      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
      .withState(storeMock)
      .provide({
        call(effect, next) {
          if (effect.fn === nahmii.Settlement.prototype.hasOffchainSynchronised) {
            return false;
          }
          return next();
        },
      })
      .put(actions.nahmiiPaymentError(error))
      .put(notify('error', getIntl().formatMessage({ id: 'nahmii_settlement_lock_transfer' })))
      .run({ silenceTimeout: true });
    });
  });
  describe('settlement operations', () => {
    const options = { gasLimit: 1, gasPrice: 1 };
    const currency = '0x0000000000000000000000000000000000000001';
    const stageAmount = new BigNumber(10000000000000000000000);
    const fakeTxs = [{ chainId: 3, hash: 'hash1' }, { chainId: 3, hash: 'hash2' }];
    const fakeTxReceipts = [{ transactionHash: 'hash1', status: 1 }, { transactionHash: 'hash2', status: 1 }];
    const signerMock = {
      signMessage: () => {},
      signTransaction: () => {},
      address: storeMock.getIn(['walletHoc', 'currentWallet', 'address']),
    };

    describe('load settlement states', () => {
      describe('#loadOngoingChallenges', () => {
        const expectedOngoingChallenges = [{}, {}];
        it('when succeeded, should dispatch loadOngoingChallengesSuccess and update store correctly', () => expectSaga(loadOngoingChallenges, { address: signerMock.address, currency }, currentNetworkMock)
            .withReducer(withReducer, storeMock.setIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading'], true))
            .provide({
              call() {
                return expectedOngoingChallenges;
              },
            })
            .put(actions.loadOngoingChallengesSuccess(signerMock.address, currency, expectedOngoingChallenges))
            .run({ silenceTimeout: true })
            .then((result) => {
              const loading = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading']);
              expect(loading).toEqual(false);
              const ongoingChallenges = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'details']);
              expect(ongoingChallenges).toEqual(expectedOngoingChallenges);
            })
        );
        it('when failed, should dispatch loadOngoingChallengesError and update store correctly', () => expectSaga(loadOngoingChallenges, { address: signerMock.address, currency }, currentNetworkMock)
            .withReducer(withReducer, storeMock.setIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading'], true))
            .provide({
              call() {
                throw new Error();
              },
            })
            .put(actions.loadOngoingChallengesError(signerMock.address, currency))
            .run({ silenceTimeout: true })
            .then((result) => {
              const loading = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading']);
              expect(loading).toEqual(true);
              const ongoingChallenges = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'details']);
              expect(ongoingChallenges).toEqual(null);
            })
        );
      });
      describe('#loadSettleableChallenges', () => {
        const expectedResponse = { settleableChallenges: [{}, {}], invalidReasons: [] };

        it('when succeeded, should dispatch loadSettleableChallengesSuccess and update store correctly', () => expectSaga(loadSettleableChallenges, { address: signerMock.address, currency }, currentNetworkMock)
            .withReducer(withReducer, storeMock.setIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading'], true))
            .provide({
              call() {
                return expectedResponse;
              },
            })
            .put(actions.loadSettleableChallengesSuccess(signerMock.address, currency, expectedResponse.settleableChallenges, expectedResponse.invalidReasons))
            .run({ silenceTimeout: true })
            .then((result) => {
              const loading = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading']);
              expect(loading).toEqual(false);
              const settleableChallenges = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'details']);
              const invalidReasons = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'invalidReasons']);
              expect(settleableChallenges).toEqual(expectedResponse.settleableChallenges);
              expect(invalidReasons).toEqual(expectedResponse.invalidReasons);
            })
        );
        it('when failed, should dispatch loadSettleableChallengesError and update store correctly', () => expectSaga(loadSettleableChallenges, { address: signerMock.address, currency }, currentNetworkMock)
            .withReducer(withReducer, storeMock.setIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading'], true))
            .provide({
              call() {
                throw new Error();
              },
            })
            .put(actions.loadSettleableChallengesError(signerMock.address, currency))
            .run({ silenceTimeout: true })
            .then((result) => {
              const loading = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading']);
              expect(loading).toEqual(true);
              const settleableChallenges = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'details']);
              expect(settleableChallenges).toEqual(null);
            })
        );
      });
      describe('#reloadSettlementStates', () => {
        it('when succeeded, should dispatch loadSettleableChallengesSuccess and update store correctly', () => expectSaga(reloadSettlementStatesHook, {})
            .withReducer(withReducer,
              storeMock
                .setIn(['nahmiiHoc', 'selectedCurrency'], currency)
                .setIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading'], false)
                .setIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading'], false)
            )
            .put(actions.reloadSettlementStates(signerMock.address, currency))
            .run({ silenceTimeout: true })
            .then((result) => {
              ['settleableChallenges', 'ongoingChallenges'].forEach((type) => {
                const loading = result.storeState.getIn(['nahmiiHoc', type, signerMock.address, currency, 'loading']);
                expect(loading).toEqual(true);
              });
            })
        );
      });
      describe('#changeNahmiiCurrency', () => {
        [
          [undefined, undefined],
          [false, undefined],
          [undefined, false],
          [true, undefined],
          [undefined, true],
        ].forEach(([loadingOngoingChallenges, loadingSettleableChallenges]) => {
          it(`should dispatch reloadSettlementStates when loading challenge status has not been initialised yet; loadingOngoingChallenges: ${loadingOngoingChallenges}, loadingSettleableChallenges: ${loadingSettleableChallenges}`, () => expectSaga(changeNahmiiCurrency, {})
              .withReducer(withReducer,
                storeMock
                  .setIn(['nahmiiHoc', 'selectedCurrency'], currency)
                  .setIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading'], loadingOngoingChallenges)
                  .setIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading'], loadingSettleableChallenges)
              )
              .put(actions.reloadSettlementStates(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                ['settleableChallenges', 'ongoingChallenges'].forEach((type) => {
                  const loading = result.storeState.getIn(['nahmiiHoc', type, signerMock.address, currency, 'loading']);
                  expect(loading).toEqual(true);
                });
              })
          );
        });
        [
          [false, false],
          [true, true],
          [false, true],
          [true, false],
        ].forEach(([loadingOngoingChallenges, loadingSettleableChallenges]) => {
          it(`should not dispatch reloadSettlementStates when loading challenge status has been initialised; loadingOngoingChallenges: ${loadingOngoingChallenges}, loadingSettleableChallenges: ${loadingSettleableChallenges}`, () => expectSaga(changeNahmiiCurrency, {})
              .withReducer(withReducer,
                storeMock
                  .setIn(['nahmiiHoc', 'selectedCurrency'], currency)
                  .setIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'loading'], loadingOngoingChallenges)
                  .setIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'loading'], loadingSettleableChallenges)
              )
              .not.put(actions.reloadSettlementStates(signerMock.address, currency))
              .run({ silenceTimeout: true })
          );
        });
      });
    });

    describe('#startChallenge', () => {
      it('should dispatch correct actions when wallet is encrypted', () => expectSaga(startChallenge, { stageAmount, currency, options })
          .withState(storeMock)
          .provide({
            select() {
              return fromJS({ address: signerMock.address, encrypted: {}, decrypted: null });
            },
          })
          .put(showDecryptWalletModal(actions.startChallenge(signerMock.address, currency, stageAmount, options)))
          .put(actions.startChallengeError(signerMock.address, currency))
          .not.put(actions.startRequiredChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true }));

      it('should correctly update store after successfully started a new challenge', () => {
        const requiredChallenges = [{ type: 'payment-driip' }];
        return expectSaga(startChallenge, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getRequiredChallengesForIntendedStageAmount')) {
                const { amount } = effect.args[0].toJSON();
                expect(amount).toEqual(stageAmount.toFixed());
                return { requiredChallenges };
              }
              if (effect.fn.name.includes('startByRequiredChallenge')) {
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
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.startChallengeSuccess(signerMock.address, fakeTxReceipts[0], currency))
          .put(actions.startRequiredChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
            const tx = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
            expect(status).toEqual('success');
            expect(tx).toEqual(fakeTxReceipts[0]);
          });
      }
      );

      it('should correctly update store after successfully started more than one challenge', () => {
        const requiredChallenges = [{ type: 'payment-driip' }, { type: 'null' }];
        let startedChallenges = 0;
        return expectSaga(startChallenge, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getRequiredChallengesForIntendedStageAmount')) {
                return { requiredChallenges };
              }
              if (effect.fn.name.includes('startByRequiredChallenge')) {
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
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[1], currency))
          .put(actions.startChallengeSuccess(signerMock.address, fakeTxReceipts[0], currency))
          .put(actions.startChallengeSuccess(signerMock.address, fakeTxReceipts[1], currency))
          .put(actions.startRequiredChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('success');
            const tx1 = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
            const tx2 = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[1].transactionHash]);
            expect(tx1).toEqual(fakeTxReceipts[0]);
            expect(tx2).toEqual(fakeTxReceipts[1]);
          });
      }
      );

      it('should correctly update store after failed to start one of the required challenges', () => {
        const requiredChallenges = [{ type: 'payment-driip' }, { type: 'null' }];
        const failedTxReceipt = { transactionHash: 'hash2', status: 0 };
        let startedChallenges = 0;
        return expectSaga(startChallenge, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getRequiredChallengesForIntendedStageAmount')) {
                return { requiredChallenges };
              }
              if (effect.fn.name.includes('startByRequiredChallenge')) {
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
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[1], currency))
          .put(actions.startChallengeSuccess(signerMock.address, fakeTxReceipts[0], currency))
          .put(actions.startChallengeError(signerMock.address, currency))
          .not.put(actions.startRequiredChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
            const tx1 = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
            const tx2 = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'transactions', failedTxReceipt.transactionHash]);
            expect(tx1).toEqual(fakeTxReceipts[0]);
            expect(tx2).toEqual(failedTxReceipt);
          });
      }
      );

      it('should correctly update store when failed to get required challenges', () => {
        const fakeError = new Error('error');

        return expectSaga(startChallenge, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getRequiredChallengesForIntendedStageAmount')) {
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
          .put(actions.startChallengeError(signerMock.address, currency))
          .not.put(actions.startRequiredChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
          });
      }
      );

      it('should correctly update store when failed to mine transaction', () => {
        const requiredChallenges = [{ type: 'payment-driip' }];
        const failedTx = { status: 0, transactionHash: fakeTxReceipts[0].transactionHash };

        return expectSaga(startChallenge, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getRequiredChallengesForIntendedStageAmount')) {
                return { requiredChallenges };
              }
              if (effect.fn.name.includes('startByRequiredChallenge')) {
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
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.startChallengeError(signerMock.address, currency))
          .not.put(actions.startRequiredChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
            const tx1 = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'transactions', failedTx.transactionHash]);
            expect(tx1).toEqual(failedTx);
          });
      }
      );
    });
    describe('#settle', () => {
      it('should dispatch correct actions when wallet is encrypted', () => expectSaga(settle, { address: signerMock.address, currency, options })
          .withState(storeMock)
          .provide({
            select() {
              return fromJS({ address: signerMock.address, encrypted: {}, decrypted: null });
            },
          })
          .put(showDecryptWalletModal(actions.settle(signerMock.address, currency, options)))
          .put(actions.settleError(signerMock.address, currency))
          .not.put(actions.settleAllChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true }));

      it('should correctly update store after successfully settle a challenge', () => {
        const settleableChallenges = [{ type: 'payment-driip' }];
        return expectSaga(settle, { currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getSettleableChallenges')) {
                return { settleableChallenges };
              }
              if (effect.fn.name.includes('settleBySettleableChallenge')) {
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
          .put(actions.settleAllChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'status']);
            const tx = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
            expect(status).toEqual('success');
            expect(tx).toEqual(fakeTxReceipts[0]);
          });
      }
      );

      it('should correctly update store after successfully started more than one challenge', () => {
        const settleableChallenges = [{ type: 'payment-driip' }, { type: 'null' }];
        let settledChallenges = 0;
        return expectSaga(settle, { currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getSettleableChallenges')) {
                return { settleableChallenges };
              }
              if (effect.fn.name.includes('settleBySettleableChallenge')) {
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
          .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[1], currency))
          .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[0], currency))
          .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[1], currency))
          .put(actions.settleAllChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('success');
            const tx1 = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
            const tx2 = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[1].transactionHash]);
            expect(tx1).toEqual(fakeTxReceipts[0]);
            expect(tx2).toEqual(fakeTxReceipts[1]);
          });
      }
      );

      it('should correctly update store after failed to settle one of the required challenges', () => {
        const settleableChallenges = [{ type: 'payment-driip' }, { type: 'null' }];
        const failedTxReceipt = { transactionHash: 'hash2', status: 0 };
        let settledChallenges = 0;
        return expectSaga(settle, { currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getSettleableChallenges')) {
                return { settleableChallenges };
              }
              if (effect.fn.name.includes('settleBySettleableChallenge')) {
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
          .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.loadTxRequestForSettlingSuccess(signerMock.address, fakeTxs[1], currency))
          .put(actions.settleSuccess(signerMock.address, fakeTxReceipts[0], currency))
          .put(actions.settleError(signerMock.address, currency))
          .not.put(actions.settleAllChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
            const tx1 = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'transactions', fakeTxReceipts[0].transactionHash]);
            const tx2 = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'transactions', failedTxReceipt.transactionHash]);
            expect(tx1).toEqual(fakeTxReceipts[0]);
            expect(tx2).toEqual(failedTxReceipt);
          });
      }
      );

      it('should correctly update store when failed to get required challenges', () => {
        const fakeError = new Error('error');

        return expectSaga(settle, { currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getSettleableChallenges')) {
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
          .put(actions.settleError(signerMock.address, currency))
          .not.put(actions.settleAllChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
          });
      }
      );

      it('should correctly update store when failed to mine transaction', () => {
        const settleableChallenges = [{ type: 'payment-driip' }];
        const failedTxReceipt = { status: 0, transactionHash: fakeTxReceipts[0].transactionHash };

        return expectSaga(settle, { currency, options })
          .withReducer(withReducer, storeMock)
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getSettleableChallenges')) {
                return { settleableChallenges };
              }
              if (effect.fn.name.includes('settleBySettleableChallenge')) {
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
          .put(actions.settleError(signerMock.address, currency))
          .not.put(actions.settleAllChallengesSuccess(signerMock.address, currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'status']);
            expect(status).toEqual('failed');
            const tx = result.storeState.getIn(['nahmiiHoc', 'settleableChallenges', signerMock.address, currency, 'transactions', failedTxReceipt.transactionHash]);
            expect(tx).toEqual(failedTxReceipt);
          });
      }
      );
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
    describe('#processPendingSettlementTransactions', () => {
      const fakeTxsWithTimestamp = [
        { ...fakeTxs[0], timestamp: 1 },
        { ...fakeTxs[1], timestamp: 1 },
      ];
      describe('when network chain id does not match', () => {
        it('should not update store', () => expectSaga(processPendingSettlementTransactions)
            .withReducer(
              withReducer,
              storeMock.setIn(
                ['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency], { ...fakeTxsWithTimestamp[0], chainId: 1 })
            )
            .provide({
              call(effect, next) {
                if (effect.fn.name === 'waitForTransaction') {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                    }, 1000);
                  });
                }
                return next();
              },
            })
            .run({ silenceTimeout: true })
            .then((result) => {
              const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
              const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
              expect(status).toEqual(undefined);
              expect(tx).toEqual({ ...fakeTxsWithTimestamp[0], chainId: 1 });
            })
        );
      });
      describe('when network chain id matches with the current network', () => {
        it('should update status when waiting for transaction confirmation', () => expectSaga(processPendingSettlementTransactions)
              .withReducer(
                withReducer,
                storeMock.setIn(
                  ['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency], fakeTxsWithTimestamp[0])
              )
              .provide({
                call(effect, next) {
                  if (effect.fn.name === 'waitForTransaction') {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                      }, 1000);
                    });
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxsWithTimestamp[0], currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
                const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
                expect(status).toEqual('mining');
                expect(tx).toEqual(fakeTxsWithTimestamp[0]);
              })
          );
        it('should update store accordingly when existing multiple pending transations', () => {
          const otherCurrency = '0x2';
          return expectSaga(processPendingSettlementTransactions)
              .withReducer(
                withReducer,
                storeMock
                  .setIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency], fakeTxsWithTimestamp[0])
                  .setIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, otherCurrency], fakeTxsWithTimestamp[1])
              )
              .provide({
                call(effect, next) {
                  if (effect.fn.name === 'waitForTransaction') {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                      }, 1000);
                    });
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxsWithTimestamp[0], currency))
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxsWithTimestamp[1], otherCurrency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const expects = [[fakeTxsWithTimestamp[0], currency], [fakeTxsWithTimestamp[1], otherCurrency]];
                for (const [fakeTx, ct] of expects) {
                  const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, ct, 'status']);
                  const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, ct]);
                  expect(status).toEqual('mining');
                  expect(tx).toEqual(fakeTx);
                }
              });
        });
        it('should remove pending tx from store when failed to mine the transaction', () => expectSaga(processPendingSettlementTransactions)
              .withReducer(
                withReducer,
                storeMock.setIn(
                  ['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency], fakeTxsWithTimestamp[0])
              )
              .provide({
                call(effect, next) {
                  if (effect.fn.name === 'waitForTransaction') {
                    return { transactionHash: fakeTxsWithTimestamp[0].hash };
                  }
                  if (effect.fn.name === 'getTransactionReceipt') {
                    return { transactionHash: fakeTxsWithTimestamp[0].hash, status: 0 };
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxsWithTimestamp[0], currency))
              .put(actions.startChallengeError(signerMock.address, currency))
              .put(actions.loadTxReceiptForPaymentChallengeError(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
                const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
                expect(status).toEqual('failed');
                expect(tx).toEqual(undefined);
              })
          );
        it('should not remove pending tx from store when the error is not caused by mining failure', () => expectSaga(processPendingSettlementTransactions)
              .withReducer(
                withReducer,
                storeMock.setIn(
                  ['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency], fakeTxsWithTimestamp[0])
              )
              .provide({
                call(effect, next) {
                  if (effect.fn.name === 'waitForTransaction') {
                    throw new Error();
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxsWithTimestamp[0], currency))
              .put(actions.startChallengeError(signerMock.address, currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
                const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
                expect(status).toEqual('failed');
                expect(tx).toEqual(fakeTxsWithTimestamp[0]);
              })
          );
      });
      describe('#processTx', () => {
        describe('when waiting transaction to be confirmed', () => {
          it('should update store with a timestamp when the tx object does not contain a timestamp', () => expectSaga(processTx, 'start-challenge', { chainId: 3 }, fakeTxs[0], signerMock.address, currency)
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name === 'waitForTransaction') {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                      }, 1000);
                    });
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[0], currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
                const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
                expect(status).toEqual('mining');
                expect(tx).toEqual({ ...fakeTxs[0], timestamp: new Date().getTime() });
              })
          );
          it('should not update timestamp if the tx object already contains a timestamp property', () => expectSaga(processTx, 'start-challenge', { chainId: 3 }, fakeTxsWithTimestamp[0], signerMock.address, currency)
              .withReducer(withReducer, storeMock)
              .provide({
                call(effect, next) {
                  if (effect.fn.name === 'waitForTransaction') {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                      }, 1000);
                    });
                  }
                  return next();
                },
              })
              .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxsWithTimestamp[0], currency))
              .run({ silenceTimeout: true })
              .then((result) => {
                const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
                const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
                expect(status).toEqual('mining');
                expect(tx).toEqual(fakeTxsWithTimestamp[0]);
              }));
        });
        it('should update store when confirmed the transaction', () => expectSaga(processTx, 'start-challenge', { chainId: 3 }, fakeTxs[0], signerMock.address, currency)
          .withReducer(
            withReducer,
            storeMock.setIn(
              ['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency], fakeTxs[0])
          )
          .provide({
            call(effect, next) {
              if (effect.fn.name === 'waitForTransaction') {
                return { transactionHash: fakeTxs[0].hash };
              }
              if (effect.fn.name === 'getTransactionReceipt') {
                return fakeTxReceipts[0];
              }
              return next();
            },
          })
          .put(actions.loadTxRequestForPaymentChallengeSuccess(signerMock.address, fakeTxs[0], currency))
          .put(actions.startChallengeSuccess(signerMock.address, fakeTxReceipts[0], currency))
          .run({ silenceTimeout: true })
          .then((result) => {
            const status = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'status']);
            const tx = result.storeState.getIn(['nahmiiHoc', 'newSettlementPendingTxs', signerMock.address, currency]);
            expect(status).toEqual('success');
            expect(tx).toEqual(undefined);
          })
      );
      });
    });
  });
});
