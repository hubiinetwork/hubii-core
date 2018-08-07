import { fromJS } from 'immutable';
import { expectSaga} from 'redux-saga-test-plan';
import walletHocReducer from 'containers/WalletHOC/reducer';
import {transferErc20ActionParamsMock} from 'mocks/wallet';
import { utils } from 'ethers';
import {
  getAddresses as getTrezorAddresses,
} from '../saga';
import { balancesMock, address1Mock, walletsMock, pricesMock, supportedAssetsMock, supportedTokensMock } from '../../../tests/mocks';

describe('hardware wallet: trezor', () => {
  xit('should trigger trezorConnectedAction when trezor usb is connected', () => {
    const storeState = {};
    const deviceId = '9986172B302004F3BEB86C3F';
    return expectSaga(walletHoc)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      // .provide({
      //   call(effect) {
      //     let result;
      //     if (effect.fn === LedgerTransport.isSupported) {
      //       result = true;
      //     }
      //     if (effect.fn === ledgerChannel) {
      //       result = eventChannel((emitter) => {
      //         setTimeout(() => {
      //           emitter({ type: 'add', deviceId });
      //         }, 100);
      //         return () => {};
      //       });
      //     }
      //     return result;
      //   },
      // })
      .put(trezorConnected(deviceId))
      .dispatch({ type: INIT_LEDGER })
      .run(10000)
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'trezorInfo', 'status'])).toEqual('connected');
        expect(state.getIn(['walletHoc', 'trezorInfo', 'deviceId'])).toEqual(deviceId);
      });
  });
  xit('should trigger trezorDisconnectedAction when trezor usb is disconnected', () => {
    const deviceId = '9986172B302004F3BEB86C3F';
    const storeState = {
      walletHoc: {
        trezorInfo: {
          status: 'connected',
          deviceId,
        },
      },
    };
    return expectSaga(walletHoc)
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      // .provide({
      //   call(effect) {
      //     let result;
      //     if (effect.fn === LedgerTransport.isSupported) {
      //       result = true;
      //     }
      //     if (effect.fn === ledgerChannel) {
      //       result = eventChannel((emitter) => {
      //         setTimeout(() => {
      //           emitter({ type: 'add', deviceId });
      //         }, 100);
      //         return () => {};
      //       });
      //     }
      //     return result;
      //   },
      // })
      .put(trezorDisconnected(deviceId))
      .dispatch({ type: INIT_LEDGER })
      .run(10000)
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'trezorInfo', 'status'])).toEqual('disconnected');
        expect(state.getIn(['walletHoc', 'trezorInfo', 'deviceId'])).toEqual(null);
      });
  });
  it('should trigger fetchedTrezorAddressAction when got address by path', () => {
    const deviceId = '123';
    const storeState = {
      walletHoc: {
        trezorInfo: {
          status: 'connected',
          deviceId,
        },
      },
    };
    const key = {
      node: {
        chain_code: 'd93e82d55e4eb6afc72143098ae934862a15bd6266ad53a08d3013f6e8e376fe',
        public_key: '029d4ff641c64992c9ce51bfb2b168d15f3f68c758e80be42612a3c6cc193ed03a',
      },
    };
    const pathBase = 'm/44\'/60\'/0\'/0';
    const expectedAddresses = [
      '0xd03c200c7d655e5170e28e61595683c8d7a6494e',
      '0x9d7b7f53ce6a179274068a8050a15c9b8657a018',
      '0xfdfa888b8a6b81572444283e694ac78ececb1c24',
      '0xb501600b8554d3f557ae73fe68fe3a24e11633cb',
      '0x2cafdc27dad30f8d5192ead09e7a2ee36a771a13',
    ];
    const count = 5;
    return expectSaga(getTrezorAddresses, { pathBase, count })
      .withReducer((state, action) => state.set('walletHoc', walletHocReducer(state.get('walletHoc'), action)), fromJS(storeState))
      .provide({
        call(effect) {
          if (effect.args[0] === 'getpublickey') {
            return key;
          }
          return {};
        },
      })
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['walletHoc', 'trezorInfo', 'addresses']).count()).toEqual(count);
        for (let i = 0; i < expectedAddresses.length; i += 1) {
          expect(state.getIn(['walletHoc', 'trezorInfo', 'addresses', `${pathBase}/${i}`])).toEqual(expectedAddresses[i]);
        }
      });
  });
});