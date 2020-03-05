import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';
import { intl } from 'jest/__mocks__/react-intl';
import { currentNetworkMock } from 'containers/App/tests/mocks/selectors';
import {
  walletsWithInfoMock,
} from 'containers/WalletHoc/tests/mocks/selectors';
import {
  ledgerHocDisconnectedMock,
} from 'containers/LedgerHoc/tests/mocks/selectors';

import {
  trezorHocDisconnectedMock,
} from 'containers/TrezorHoc/tests/mocks/selectors';

import {
  claimFeesNone,
} from 'containers/NahmiiHoc/tests/mocks/selectors';

import {
  pricesLoadedMock,
  supportedAssetsLoadedMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';
import { gweiToEther } from 'utils/wallet';

import { NahmiiClaimFees } from '../index';

function expectTransferDescriptionMainProp(main, value, symbol) {
  expect(shallow(main).children().last().text()).toEqual(symbol);
  expect(shallow(main).find('NumericText').props().value.toString()).toEqual(value.toString());
}

describe('<NahmiiClaimFees />', () => {
  let props;
  beforeEach(() => {
    props = {
      currentWalletWithInfo: walletsWithInfoMock.get(0),
      prices: pricesLoadedMock,
      supportedAssets: supportedAssetsLoadedMock,
      currentNetwork: currentNetworkMock,
      ledgerNanoSInfo: ledgerHocDisconnectedMock,
      trezorInfo: trezorHocDisconnectedMock,
      revenueFees: claimFeesNone,
      intl,
      nahmiiClaimFees: () => {},
      goWalletDetails: () => {},
      setSelectedWalletCurrencyAction: () => {},
      claimFeesAction: () => {},
      loadClaimableFeesAction: () => {},
      withdrawFeesAction: () => {},
      loadWithdrawableFeesAction: () => {},
      gasStatistics: fromJS({}),
    };
  });
  describe('claim actions', () => {
    const erc20Asset = { ...walletsWithInfoMock.get(0).getIn(['balances', 'baseLayer', 'assets']).get(1).toJS(), decimals: 10 };
    const ethAsset = { symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000', balance: new BigNumber('1'), decimals: 18 };
    [{
      type: 'ETH',
      asset: ethAsset,
      walletsWithInfo: walletsWithInfoMock
        .get(0)
        .setIn(['balances', 'nahmiiStaged', 'assets'], fromJS([{ balance: new BigNumber(3), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }]))
        .setIn(
          ['balances', 'nahmiiAvailable', 'assets'],
          fromJS([{ balance: new BigNumber(4), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])
        )
        .set('type', 'software'),
    }, {
      type: 'ERC20',
      asset: erc20Asset,
      walletsWithInfo: walletsWithInfoMock
        .get(0)
        .setIn(['balances', 'nahmiiStaged', 'assets'], fromJS([
          {
            balance: new BigNumber(3),
            symbol: erc20Asset.symbol,
            currency: erc20Asset.currency,
          },
        ]))
        .setIn(
          ['balances', 'nahmiiAvailable', 'assets'],
          fromJS([{
            balance: new BigNumber(4),
            symbol: erc20Asset.symbol,
            currency: erc20Asset.currency,
          }])
        )
        .set('type', 'software'),

    }].forEach((t) => {
      describe(t.type, () => {
        let wrapper;
        beforeEach(() => {
          wrapper = shallow(
            <NahmiiClaimFees
              {...props}
              currentWalletWithInfo={t.walletsWithInfo}
            />
          );
        });
        describe('when loading claimable fees', () => {
          beforeEach(() => {
            wrapper = shallow(
              <NahmiiClaimFees
                {...props}
                currentWalletWithInfo={t.walletsWithInfo}
                revenueFees={fromJS({ claimable: { loading: true } })}
              />
            );
          });
          it('display loading icon for review panel', () => {
            const iconNode = wrapper.find('.loading-icon');
            expect(iconNode.exists()).toEqual(true);
            const reviewNode = wrapper.find('.review-panel');
            expect(reviewNode.exists()).toEqual(false);
          });
        });
        describe('when loaded fees', () => {
          beforeEach(() => {
            wrapper = shallow(
              <NahmiiClaimFees
                {...props}
                currentWalletWithInfo={t.walletsWithInfo}
                revenueFees={fromJS({ claimable: { loading: false }, withdrawable: { loading: false } })}
              />
            );
          });
          it('displays review panel', () => {
            const iconNode = wrapper.find('.loading-icon');
            expect(iconNode.exists()).toEqual(false);
            const reviewNode = wrapper.find('.review-panel');
            expect(reviewNode.exists()).toEqual(true);
          });
          it('should correctly calculate the eth before', () => {
            const baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance;
            expectTransferDescriptionMainProp(wrapper.find('.review-panel .base-layer-eth-balance-before').props().main, baseLayerBalanceBefore, 'ETH');
          });
          it('should correctly calculate the eth after', () => {
            const baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance;
            const { gasPriceGwei, gasLimit } = wrapper.state();

            const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
            const baseLayerBalanceAfter = baseLayerBalanceBefore.minus(txFeeAmt);
            expectTransferDescriptionMainProp(wrapper.find('.review-panel .base-layer-eth-balance-after').props().main, baseLayerBalanceAfter, 'ETH');
          });
          describe('claimable', () => {
            describe('when claimable amount is greater than zero', () => {
              const claimableBN = new BigNumber(1);
              beforeEach(() => {
                wrapper = shallow(
                  <NahmiiClaimFees
                    {...props}
                    currentWalletWithInfo={t.walletsWithInfo}
                    revenueFees={fromJS({ claimable: { loading: false, amount: claimableBN }, withdrawable: { loading: false } })}
                  />
                );
                wrapper.setState({ assetToClaim: t.asset });
              });
              it('should correctly calculate the claimable balance', () => {
                expectTransferDescriptionMainProp(wrapper.find('.review-panel .claimable-amount').props().main, claimableBN.div(new BigNumber(10).pow(t.asset.decimals)).toString(), t.asset.symbol);
              });
              it('enables claim button', () => {
                expect(wrapper.find('.review-panel .claim-btn').props().disabled).toEqual(false);
              });
              it('hides withdraw button', () => {
                expect(wrapper.find('.withdraw-btn')).toHaveLength(0);
              });
              describe('claiming', () => {
                [
                  { status: 'requesting', confOnDevice: true, text: /waiting_for_claiming_fees_to_be.*signed/i },
                  { status: 'mining', confOnDevice: true, text: /waiting_for_claiming_fees_to_be.*signed/i },
                  { status: 'receipt', confOnDevice: true, text: /waiting_for_claiming_fees_to_be.*signed/i },
                  { status: 'requesting', text: /waiting_for_claiming_fees_to_be.*requested/i },
                  { status: 'mining', text: /waiting_for_claiming_fees_to_be.*mined/i },
                  { status: 'receipt', text: /waiting_for_claiming_fees_to_be.*mined/i },
                ].forEach((test) => {
                  describe(`with tx status ${test.status}`, () => {
                    beforeEach(() => {
                      wrapper = shallow(
                        <NahmiiClaimFees
                          {...props}
                          currentWalletWithInfo={t.walletsWithInfo}
                          revenueFees={fromJS({
                            claimable: { loading: false, amount: claimableBN },
                            withdrawable: { loading: false },
                            claiming: { status: test.status },
                          })}
                          ledgerNanoSInfo={ledgerHocDisconnectedMock.set('confTxOnDevice', test.confOnDevice)}
                        />
                      );
                    });
                    it(`should show the transaction status ${t.text} when status is ${t.status} and confOnDevice is ${t.confOnDevice}`, () => {
                      expect(wrapper.find('.claim-btn')).toHaveLength(0);
                      expect(wrapper.find('.withdraw-btn')).toHaveLength(0);
                      expect(wrapper.find('.tx-status')).toHaveLength(1);
                      expect(wrapper.find('.tx-status Text').html()).toMatch(test.text);
                    });
                  });
                });
              });
            });
            describe('when claimable amount equals to zero', () => {
              beforeEach(() => {
                wrapper = shallow(
                  <NahmiiClaimFees
                    {...props}
                    currentWalletWithInfo={t.walletsWithInfo}
                    revenueFees={fromJS({ claimable: { loading: false, amount: new BigNumber(0) }, withdrawable: { loading: false } })}
                  />
                );
                wrapper.setState({ assetToClaim: t.asset });
              });
              it('disables claim button', () => {
                expect(wrapper.find('.review-panel .claim-btn').props().disabled).toEqual(true);
              });
            });
          });
          describe('withdrawable', () => {
            describe('when withdrawable amount is greater than zero', () => {
              const withdrawableBN = new BigNumber(2);
              beforeEach(() => {
                wrapper = shallow(
                  <NahmiiClaimFees
                    {...props}
                    currentWalletWithInfo={t.walletsWithInfo}
                    revenueFees={fromJS({ claimable: { loading: false }, withdrawable: { loading: false, amount: withdrawableBN } })}
                  />
                );
                wrapper.setState({ assetToClaim: t.asset });
              });
              it('should correctly calculate the withdrawable balance', () => {
                expectTransferDescriptionMainProp(wrapper.find('.review-panel .withdrawable-amount').props().main, withdrawableBN.div(new BigNumber(10).pow(t.asset.decimals)).toString(), t.asset.symbol);
              });
              it('enables withdraw button', () => {
                expect(wrapper.find('.review-panel .withdraw-btn').props().disabled).toEqual(false);
              });
              it('hides claim button', () => {
                expect(wrapper.find('.claim-btn')).toHaveLength(0);
              });
              it('should correctly calculate the eth after', () => {
                const baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance;
                const { gasPriceGwei, gasLimit } = wrapper.state();

                const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
                let baseLayerBalanceAfter = baseLayerBalanceBefore.minus(txFeeAmt);
                if (t.type === 'ETH') {
                  baseLayerBalanceAfter = baseLayerBalanceAfter.plus(withdrawableBN.div(new BigNumber(10).pow(t.asset.decimals)));
                }
                expectTransferDescriptionMainProp(wrapper.find('.review-panel .base-layer-eth-balance-after').props().main, baseLayerBalanceAfter, 'ETH');
              });
              describe('withdrawing', () => {
                [
                  { status: 'requesting', confOnDevice: true, text: /waiting_for_withdrawing_fees_to_be.*signed/i },
                  { status: 'mining', confOnDevice: true, text: /waiting_for_withdrawing_fees_to_be.*signed/i },
                  { status: 'receipt', confOnDevice: true, text: /waiting_for_withdrawing_fees_to_be.*signed/i },
                  { status: 'requesting', text: /waiting_for_withdrawing_fees_to_be.*requested/i },
                  { status: 'mining', text: /waiting_for_withdrawing_fees_to_be.*mined/i },
                  { status: 'receipt', text: /waiting_for_withdrawing_fees_to_be.*mined/i },
                ].forEach((test) => {
                  describe(`with tx status ${test.status}`, () => {
                    beforeEach(() => {
                      wrapper = shallow(
                        <NahmiiClaimFees
                          {...props}
                          currentWalletWithInfo={t.walletsWithInfo}
                          revenueFees={fromJS({
                            claimable: { loading: false, amount: withdrawableBN },
                            withdrawable: { loading: false },
                            withdrawing: { status: test.status },
                          })}
                          ledgerNanoSInfo={ledgerHocDisconnectedMock.set('confTxOnDevice', test.confOnDevice)}
                        />
                      );
                    });
                    it(`should show the transaction status ${t.text} when status is ${t.status} and confOnDevice is ${t.confOnDevice}`, () => {
                      expect(wrapper.find('.claim-btn')).toHaveLength(0);
                      expect(wrapper.find('.withdraw-btn')).toHaveLength(0);
                      expect(wrapper.find('.tx-status')).toHaveLength(1);
                      expect(wrapper.find('.tx-status Text').html()).toMatch(test.text);
                    });
                  });
                });
              });
            });
            describe('when withdrawable amount equals to zero', () => {
              it('shows claim button', () => {
                expect(wrapper.find('.claim-btn')).toHaveLength(1);
              });
              it('hides withdraw button', () => {
                expect(wrapper.find('.withdraw-btn')).toHaveLength(0);
              });
            });
          });
        });
      });
    });
  });
});
