import { expectSaga } from 'redux-saga-test-plan';
import nahmii from 'nahmii-sdk';
import { storeMock } from 'mocks/store';
import { getIntl } from 'utils/localisation';
import { showDecryptWalletModal } from 'containers/WalletHoc/actions';
import { notify } from 'containers/App/actions';
import * as actions from '../actions';
import {
  makePayment,
  getSdkWalletSigner,
} from '../saga';

describe('nahmiiHocSaga', () => {
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
      monetaryAmount = new nahmii.MonetaryAmount('1000', '0x0000000000000000000000000000000000000000');
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
  });
});
