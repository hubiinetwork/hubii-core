import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';
import nahmii from 'nahmii-sdk';
import { storeMock } from 'mocks/store';
import { getIntl } from 'utils/localisation';
import BigNumber from 'bignumber.js';
import { showDecryptWalletModal } from 'containers/WalletHoc/actions';
import { notify } from 'containers/App/actions';
import * as actions from '../actions';
import {
  makePayment,
  getSdkWalletSigner,
  startChallenge,
  settle,
  withdraw,
} from '../saga';
import nahmiiHocReducer from '../reducer';

describe('nahmiiHocSaga', () => {
  const withReducer = (state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action));

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
    it('should dispatch correct actions on payment lock errors', () => {
      const error = new Error('Payment is locked for 5 block height');
      const walletAddress = storeMock.getIn(['walletHoc', 'currentWallet', 'address']);
      const { currency } = monetaryAmount.toJSON();
      return expectSaga(makePayment, { monetaryAmount, recipient, walletOverride })
      .withState(
        storeMock
          .setIn(['ethOperationsHoc', 'blockHeight', 'height'], 5)
          .setIn(['nahmiiHoc', 'ongoingChallenges', walletAddress, currency.ct, 'attemptedAtBlockHeight'], 1)
      )
      .put(actions.nahmiiPaymentError(error))
      .put(notify('error', getIntl().formatMessage({ id: 'nahmii_settlement_lock_transfer' })))
      .run({ silenceTimeout: true });
    });
  });
  describe('settlement operations', () => {
    const options = { gasLimit: 1, gasPrice: 1 };
    const currency = '0x0000000000000000000000000000000000000001';
    const stageAmount = new BigNumber(10000000000000000000000);
    const fakeTxs = [{ hash: 'hash1' }, { hash: 'hash2' }];
    const fakeTxReceipts = [{ transactionHash: 'hash1', status: 1 }, { transactionHash: 'hash2', status: 1 }];
    const signerMock = {
      signMessage: () => {},
      signTransaction: () => {},
      address: storeMock.getIn(['walletHoc', 'currentWallet', 'address']),
    };

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

      it('should correctly update block height after initialized the saga function', () => {
        const mockedBlockHeight = 1;
        return expectSaga(startChallenge, { stageAmount, address: signerMock.address, currency, txReceipt: fakeTxReceipts[0], options })
          .withReducer(withReducer, storeMock.setIn(['ethOperationsHoc', 'blockHeight', 'height'], mockedBlockHeight))
          .provide({
            call(effect, next) {
              if (effect.fn.name.includes('getRequiredChallengesForIntendedStageAmount')) {
                return [];
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
          .put(actions.updateChallengeBlockHeight(signerMock.address, currency, mockedBlockHeight))
          .run({ silenceTimeout: true })
          .then((result) => {
            const lastattemptedAtBlockHeight = result.storeState.getIn(['nahmiiHoc', 'ongoingChallenges', signerMock.address, currency, 'attemptedAtBlockHeight']);
            expect(lastattemptedAtBlockHeight).toEqual(mockedBlockHeight);
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
  });
});
