import { expectSaga } from 'redux-saga-test-plan';
import { fromJS } from 'immutable';
import { getAddresses } from '../saga';
import trezorHocReducer from '../reducer';

describe('trezorHocSaga', () => {
  it('should trigger fetchedTrezorAddressAction when got address by path', () => {
    const storeState = {
      trezorHoc: {
        id: '123',
        addresses: {},
      },
    };
    const key = {
      node: {
        chain_code: '2bb1c3f7487080d8ce50c6768607c96dc5d17ffe31e19457add5be26e6257c7d',
        public_key: '04c8429d878d35be22549b5e8d6a2c3af3a145f91823824a9fb602e5dbc0a3cf5212b3609e13427a581736d2afbcf3601ce420968c4abab06b3535899786046603',
      },
    };
    const pathTemplate = "m/44'/60'/0/{index}'";
    const expectedAddresses = [
      '0xe1dddBd012f6a9f3F0A346A2b418aEcd03b058e7',
      '0x7344328668927e8B25Ee00751a072f751CBf4993',
      '0x003Ab49013842d8542EF9f2119A1822b1e9002fE',
      '0xDdCe775e7df165A8cd5b65556712d9074AFE2eC6',
      '0x6074A2987AA8A0963d8E0aa618D530fB366F9971',
    ];
    const firstIndex = 0;
    const lastIndex = 4;
    return expectSaga(getAddresses, { pathTemplate, firstIndex, lastIndex })
      .withReducer((state, action) => state.set('trezorHoc', trezorHocReducer(state.get('trezorHoc'), action)), fromJS(storeState))
      .provide({
        call() {
          return key;
        },
      })
      .run({ silenceTimeout: true })
      .then((result) => {
        const state = result.storeState;
        expect(state.getIn(['trezorHoc', 'addresses']).count()).toEqual((lastIndex - firstIndex) + 1);
        for (let i = 0; i < expectedAddresses.length; i += 1) {
          expect(state.getIn(['trezorHoc', 'addresses', pathTemplate.replace('{index}', i + firstIndex)])).toEqual(expectedAddresses[i]);
        }
      });
  });
});
