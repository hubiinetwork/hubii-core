import { fromJS } from 'immutable';
import ethers from 'ethers'
import { expectSaga } from 'redux-saga-test-plan';
import {listen as nahmiiHoc} from '../saga'
import nahmiiHocReducer from '../reducer'
import * as actions from '../actions'
import nahmii from 'nahmii-sdk'

describe('nahmii', () => {
  let receipt
  const hash = 'fake hash'
  const txRequest = {hash}
  const txResponse = {hash}

  const storeState = {
    nahmiiHoc: {
      wallets: {},
      balances: {},
    },
  };

  const wallet = {
    address: '0x97026a8157f39101aefc4A81496C161a6b1Ce46A', 
    decrypted: {privateKey: '0x5bf0a56999d150c94943090182df4bcd40a4fd4b19a26d74e3493e613763bb8f'}
  }

  beforeEach(() => {
    receipt = {
      "nonce": 1,
      "amount": "5000000000000000000",
      "currency": {
        "ct": "0x0000000000000000000000000000000000000000",
        "id": "0"
      },
      "sender": {
        "wallet": "0x97026a8157f39101aefc4A81496C161a6b1Ce46A",
        "nonce": 1,
        "balances": {
          "current": "4800000000000000000",
          "previous": "10000000000000000000"
        },
        "fees": {
          "single": {
            "amount": "200000000000000000",
            "currency": {
              "ct": "0x0000000000000000000000000000000000000000",
              "id": "0"
            }
          },
          "total": [
            {
              "amount": "200000000000000000",
              "currency": {
                "ct": "0x0000000000000000000000000000000000000000",
                "id": "0"
              }
            }
          ]
        }
      },
      "recipient": {
        "wallet": "0xBB97f342884eD086dd83a192c8a7e649E095DB7b",
        "nonce": 1,
        "balances": {
          "current": "5000000000000000000",
          "previous": "0"
        },
        "fees": {
          "total": []
        }
      },
      "transfers": {
        "single": "5000000000000000000",
        "total": "10000000000000000000"
      },
      "blockNumber": "0",
      "operatorId": "1",
      "seals": {
        "wallet": {
          "hash": "0x424f956befa5a84763afe5202876bc15cd0fc0c448ead6efa35fa4d8a93e728c",
          "signature": {
            "v": 27,
            "r": "0x3c2ae3eb67ad66db58cbbc263eba3d6507cd437109ea70af5de7c88ae7651c28",
            "s": "0x5e5b343ea4176bd408f1e126ec4f64e3f5735e1dc2639e54544ba6d686a6924d"
          }
        },
        "operator": {
          "hash": "0x7aa30cb4577403d15743776ee664956b8005766dc7a5c59b1e97b672fec4be19",
          "signature": {
            "v": 27,
            "r": "0x9f272b1232165eea0914e5ed496f992592acc58b8620e7083446f8c9dc025783",
            "s": "0x23af84569bae8e03d39020663786536d0f57aa8f49d0f0adc4dff56ffba122c6"
          }
        }
      }
    }
  })

  const mockNetworkConfig = {
    walletApiEndpoint: () => '',
    identityServiceAppId: '',
    identityServiceSecret: '',
  }

  describe('start settlement challenge', () => {
    const amount = ethers.utils.parseUnits('1', 18)
    const stageAmount = new nahmii.MonetaryAmount(amount, '0x0000000000000000000000000000000000000000', 0)
    const tests = [
      {test: 'can start settlement challenge', params: {txReceipt: {hash, status: 1}}},
      {test: 'failed to start settlement challenge', params: {txReceipt: {hash, status: 0}}},
    ]
    tests.forEach(t => {
      it(t.test, () => {
        const {txReceipt} = t.params
        let selectorCount = 0
        let callCount = 0
        
        const expectSagaObj = expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              selectorCount++
              if (selectorCount === 1) {
                return {
                  toJS: () => {
                    return wallet
                  }
                }
              }
              if (selectorCount === 2) {
                return mockNetworkConfig
              }
            },
            call(data) {
              callCount ++
              if (callCount === 1) {
                expect(data.args[0].toJSON()).toEqual(receipt)
                expect(data.args[1].toJSON()).toEqual(stageAmount.toJSON())
                return txRequest
              }
              if (callCount === 2) {
                expect(data.args[0]).toEqual(hash)
                return txResponse
              }
              if (callCount === 3) {
                expect(data.args[0]).toEqual(hash)
                return txReceipt
              }
            }
          })
          .dispatch(actions.startPaymentChallenge(receipt, stageAmount))
          
        
        if (txReceipt.status === 1) {
          expectSagaObj.put(actions.startPaymentChallengeSuccess(wallet.address, txReceipt))
        } else {
          expectSagaObj.put(actions.startPaymentChallengeError(wallet.address, txReceipt))
        }

        return expectSagaObj
          .put(actions.loadTxRequestForPaymentChallenge(wallet.address, txRequest))
          .run()
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'txStatus'])).toEqual(txReceipt.status === 1 ? 'success': 'failed');
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'txReceipt'])).toEqual(txReceipt);
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'txRequest'])).toEqual(txRequest);
          });
      })
    })
  })

  describe('settle for a payment driip', () => {
    const tests = [
      {test: 'can settle for a payment driip', params: {txReceipt: {hash, status: 1}}},
      {test: 'failed to settle for a payment driip', params: {txReceipt: {hash, status: 0}}},
    ]
    tests.forEach(t => {
      it(t.test, () => {
        const {txReceipt} = t.params
        let selectorCount = 0
        let callCount = 0
        
        const expectSagaObj = expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              selectorCount++
              if (selectorCount === 1) {
                return {
                  toJS: () => {
                    return wallet
                  }
                }
              }
              if (selectorCount === 2) {
                return mockNetworkConfig
              }
            },
            call(data) {
              callCount ++
              if (callCount === 1) {
                expect(data.args[0].toJSON()).toEqual(receipt)
                return txRequest
              }
              if (callCount === 2) {
                expect(data.args[0]).toEqual(hash)
                return txResponse
              }
              if (callCount === 3) {
                expect(data.args[0]).toEqual(hash)
                return txReceipt
              }
            }
          })
          .dispatch(actions.settlePaymentDriip(receipt))
          
        
        if (txReceipt.status === 1) {
          expectSagaObj.put(actions.settlePaymentDriipSuccess(wallet.address, txReceipt))
        } else {
          expectSagaObj.put(actions.settlePaymentDriipError(wallet.address, txReceipt))
        }

        return expectSagaObj
          .put(actions.loadTxRequestForSettlePaymentDriip(wallet.address, txRequest))
          .run()
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastSettlePaymentDriip', 'txStatus'])).toEqual(txReceipt.status === 1 ? 'success': 'failed');
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastSettlePaymentDriip', 'txReceipt'])).toEqual(txReceipt);
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastSettlePaymentDriip', 'txRequest'])).toEqual(txRequest);
          });
      })
    })
  })

  describe('withdraw from staged balance', () => {
    const amount = ethers.utils.parseUnits('1', 18)
    const withdrawAmount = new nahmii.MonetaryAmount(amount, '0x0000000000000000000000000000000000000000', 0)
    const tests = [
      {test: 'can withdraw', params: {txReceipt: {hash, status: 1}}},
      {test: 'failed to withdraw', params: {txReceipt: {hash, status: 0}}},
    ]
    tests.forEach(t => {
      it(t.test, () => {
        const {txReceipt} = t.params
        let selectorCount = 0
        let callCount = 0
        
        const expectSagaObj = expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              selectorCount++
              if (selectorCount === 1) {
                return {
                  toJS: () => {
                    return wallet
                  }
                }
              }
              if (selectorCount === 2) {
                return mockNetworkConfig
              }
            },
            call(data) {
              callCount ++
              if (callCount === 1) {
                expect(data.args[0].toJSON()).toEqual(withdrawAmount.toJSON())
                return txRequest
              }
              if (callCount === 2) {
                expect(data.args[0]).toEqual(hash)
                return txResponse
              }
              if (callCount === 3) {
                expect(data.args[0]).toEqual(hash)
                return txReceipt
              }
            }
          })
          .dispatch(actions.withdraw(withdrawAmount))
          
        
        if (txReceipt.status === 1) {
          expectSagaObj.put(actions.withdrawSuccess(wallet.address, txReceipt))
        } else {
          expectSagaObj.put(actions.withdrawError(wallet.address, txReceipt))
        }

        return expectSagaObj
          .put(actions.loadTxRequestForWithdraw(wallet.address, txRequest))
          .run()
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastWithdraw', 'txStatus'])).toEqual(txReceipt.status === 1 ? 'success': 'failed');
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastWithdraw', 'txReceipt'])).toEqual(txReceipt);
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastWithdraw', 'txRequest'])).toEqual(txRequest);
          });
      })
    })
  })

  describe('poll challenge/settlement status', () => {
    it('can load phase for current challenge payment', () => {
      return expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              return mockNetworkConfig
            },
            call() {
              return 'Dispute'
            }
          })
          .dispatch(actions.loadCurrentPaymentChallengePhase(wallet.address))
          .put(actions.loadCurrentPaymentChallengePhaseSuccess(wallet.address, 'Dispute'))
          .run({ silenceTimeout: true })
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'phase'])).toEqual('Dispute');
          });
    })
  
    it('can not load phase for current challenge payment', () => {
      return expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              return mockNetworkConfig
            },
            call() {
              throw new Error('')
            }
          })
          .dispatch(actions.loadCurrentPaymentChallengePhase(wallet.address))
          .put(actions.loadCurrentPaymentChallengePhaseError(wallet.address))
          .run({ silenceTimeout: true })
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'phase'])).toEqual(null);
          });
    })
  
    it('can load status for current challenge payment', () => {
      return expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              return mockNetworkConfig
            },
            call() {
              return 'Qualified'
            }
          })
          .dispatch(actions.loadCurrentPaymentChallengeStatus(wallet.address))
          .put(actions.loadCurrentPaymentChallengeStatusSuccess(wallet.address, 'Qualified'))
          .run({ silenceTimeout: true })
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'status'])).toEqual('Qualified');
          });
    })
  
    it('can not load status for current challenge payment', () => {
      return expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), fromJS(storeState))
          .provide({
            select() {
              return mockNetworkConfig
            },
            call() {
              throw new Error('')
            }
          })
          .dispatch(actions.loadCurrentPaymentChallengeStatus(wallet.address))
          .put(actions.loadCurrentPaymentChallengeStatusError(wallet.address))
          .run({ silenceTimeout: true })
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastPaymentChallenge', 'status'])).toEqual(null);
          });
    })
  
    it('can load settlement by nonce', () => {
      const settlement = {nonce: 1}
      const receiptsList = [{nonce: 1}, {nonce: 2}]
      const receipts = {[wallet.address]: receiptsList}
      let selectCount = 0
      const modifiedState = fromJS(storeState).setIn(['nahmiiHoc', 'receipts'], fromJS(receipts))
      return expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), modifiedState)
          .provide({
            select(effect, next) {
              selectCount++
              if (selectCount === 1) {
                return mockNetworkConfig
              }
              return next()
            },
            call(effect) {
              expect(effect.args[0]).toEqual(receipts[wallet.address][receiptsList.length - 1].nonce)
              return settlement
            }
          })
          .dispatch(actions.loadSettlement(wallet.address))
          .put(actions.loadSettlementSuccess(wallet.address, settlement))
          .run({ silenceTimeout: true })
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastSettlePaymentDriip', 'settlement'])).toEqual(settlement);
          });
    })
  
    it('can not load settlement by nonce', () => {
      const receiptsList = [{nonce: 1}, {nonce: 2}]
      const receipts = {[wallet.address]: receiptsList}
      let selectCount = 0
      const modifiedState = fromJS(storeState).setIn(['nahmiiHoc', 'receipts'], fromJS(receipts))
      return expectSaga(nahmiiHoc)
          .withReducer((state, action) => state.set('nahmiiHoc', nahmiiHocReducer(state.get('nahmiiHoc'), action)), modifiedState)
          .provide({
            select(effect, next) {
              selectCount++
              if (selectCount === 1) {
                return mockNetworkConfig
              }
              return next()
            },
            call() {
              throw new Error('')
            }
          })
          .dispatch(actions.loadSettlement(wallet.address))
          .put(actions.loadSettlementError(wallet.address))
          .run({ silenceTimeout: true })
          .then((result) => {
            const state = result.storeState;
            expect(state.getIn(['nahmiiHoc', 'wallets', wallet.address, 'lastSettlePaymentDriip', 'settlement'])).toEqual(null);
          });
    })
  })


  it('refresh staged balance', () => {
    //poll sdk function
  })

  it('unstage back into available balance', () => {
    //store tx hash
    //wait for tx receipt to return with status=1, status=0 is failure
  })

})