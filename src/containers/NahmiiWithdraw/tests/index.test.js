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
  settlementsNone,
  withdrawalsNone,
} from 'containers/NahmiiHoc/tests/mocks/selectors';

import {
  pricesLoadedMock,
  supportedAssetsLoadedMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';
import { gweiToEther } from 'utils/wallet';

import { NahmiiWithdraw } from '../index';

function expectTransferDescriptionMainProp(main, value, symbol) {
  expect(shallow(main).children().last().text()).toEqual(symbol);
  expect(shallow(main).find('NumericText').props().value.toString()).toEqual(value.toString());
}

describe('<NahmiiWithdraw />', () => {
  let props;
  beforeEach(() => {
    props = {
      currentWalletWithInfo: walletsWithInfoMock.get(0),
      prices: pricesLoadedMock,
      supportedAssets: supportedAssetsLoadedMock,
      settlements: settlementsNone,
      withdrawals: withdrawalsNone,
      intl,
      currentNetwork: currentNetworkMock,
      ledgerNanoSInfo: ledgerHocDisconnectedMock,
      trezorInfo: trezorHocDisconnectedMock,
      nahmiiWithdraw: () => {},
      goWalletDetails: () => {},
      setSelectedWalletCurrency: () => {},
      settle: () => {},
      stage: () => {},
      withdraw: () => {},
      gasStatistics: fromJS({}),
    };
  });
  it('should render correctly when everything is loaded', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('display notice for settlement actions', () => {
    describe('when there are stageable settlements', () => {
      it('renders notice and hide the withdrawal actions', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            settlements={settlementsNone.set('details', fromJS([
              { isStageable: true, stageAmount: 100 },
              { isStageable: true, stageAmount: 100 },
            ]))}
          />
        );
        const noticeNode = wrapper.find('style__SettlementWarning');
        expect(noticeNode).toHaveLength(1);
        expect(noticeNode.props().message).toEqual('settlement_period_ended');
        expect(shallow(noticeNode.props().description).text()).toEqual('settlement_period_ended_notice {"symbol":"ETH","intended_stage_amount":"2e-16","tx_count":2}<style__StyledButton />');
        expect(wrapper.find('.start-settlement')).toHaveLength(0);
        expect(wrapper.find('.withdraw-review')).toHaveLength(0);
      });
    });
  });

  describe('stepper for settlement process', () => {
    ['payment', 'onchain-balance'].forEach((t) => {
      describe(t, () => {
        it('should hide the stepper graph when there are no ongoing/settleable settlements or invalid settlements', () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
            />
          );
          const stepsNode = wrapper.find('style__StyledSteps');
          expect(stepsNode.length).toEqual(0);
        });
        it('should update the stepper graph to stage 1 when there is a ongoing payment settlement', () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              settlements={settlementsNone.set('details', fromJS([
                { type: t, isOngoing: true, expirationTime: 1, stageAmount: '100' },
              ]))}
            />
          );
          const stepsNode = wrapper.find('style__StyledSteps');
          expect(stepsNode.props().current).toEqual(1);
        });
        it('should update the stepper graph to stage 2 when there is a settleable driip settlement', () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              settlements={settlementsNone.set('details', fromJS([
                { type: t, isStageable: true, stageAmount: '100' },
              ]))}
            />
          );
          const stepsNode = wrapper.find('style__StyledSteps');
          expect(stepsNode.props().current).toEqual(2);
        });
        it('should update the stepper graph to stage 3 when the settlement is terminated', () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              settlements={settlementsNone.set('details', fromJS([
                { type: t, isTerminated: true },
              ]))}
            />
          );
          const stepsNode = wrapper.find('style__StyledSteps');
          expect(stepsNode.props().current).toEqual(3);
          expect(stepsNode.find('Step').get(0).props.description).toEqual(null);
          expect(stepsNode.find('Step').get(1).props.description).toEqual(null);
        });
      });
    });
    it('should aggregate and display the staging amount in the stepper', () => {
      const wrapper = shallow(
        <NahmiiWithdraw
          {...props}
          settlements={settlementsNone.set('details', fromJS([
            { type: 'payment', isStageable: true, stageAmount: '100' },
            { type: 'onchain-balance', isOngoing: true, stageAmount: '100' },
          ]))}
        />
      );
      const stepsNode = wrapper.find('style__StyledSteps');
      expect(stepsNode.find('Step').get(0).props.description).toEqual('intended_stage_amount {"amount":"2e-16","symbol":"ETH"}');
    });
    it('should aggregate and display the max expiration time in the stepper', () => {
      const wrapper = shallow(
        <NahmiiWithdraw
          {...props}
          settlements={settlementsNone.set('details', fromJS([
            { type: 'payment', isOngoing: true, expirationTime: 1, stageAmount: '100' },
            { type: 'onchain-balance', isOngoing: true, expirationTime: 1000000, stageAmount: '100' },
          ]))}
        />
      );
      const stepsNode = wrapper.find('style__StyledSteps');
      expect(stepsNode.find('Step').get(1).props.description).toEqual('expiration_time {"endtime":"Thu, Jan 1, 1970 1:16 AM"}');
    });
    it('should display max withdrawable amount in the stepper even when there is an ongoing settlement', () => {
      const wrapper = shallow(
        <NahmiiWithdraw
          {...props}
          settlements={settlementsNone.set('details', fromJS([
            { type: 'onchain-balance', isOngoing: true, expirationTime: 1, stageAmount: '100' },
          ]))}
          currentWalletWithInfo={walletsWithInfoMock
            .get(0)
            .setIn(['balances', 'nahmiiStaged', 'assets'], fromJS([{ balance: new BigNumber(3), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }]))
          }
        />
      );
      const stepsNode = wrapper.find('style__StyledSteps');
      expect(stepsNode.find('Step').get(3).props.description).toEqual('withdrawable_amount {"amount":"3","symbol":"ETH"}');
    });
    [
      [true, true],
      [false, false],
      [undefined, false],
    ].forEach(([loadingSettlements, expectedLoadingIcon]) => {
      it(`displays loading icon: ${expectedLoadingIcon}, when loading settlements: ${loadingSettlements}`, () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            settlements={settlementsNone.set('loading', loadingSettlements)}
          />
        );
        const iconNode = wrapper.find('style__BottomWrapper Icon');
        expect(iconNode.exists()).toEqual(expectedLoadingIcon);
      });
    });
    [
      {
        describe: 'should always render the later stage',
        props: {
          settlements: settlementsNone.set('details', fromJS([
            { type: 'onchain-balance', isOngoing: true, expirationTime: 1, stageAmount: '100' },
            { type: 'payment', isTerminated: true },
          ])),
        },
        expect: { step: 1 },
      },
      {
        describe: 'should render the step for the active settlement',
        props: {
          settlements: settlementsNone.set('details', fromJS([
            { type: 'onchain-balance', isStageable: true, stageAmount: '100' },
            { type: 'payment', isTerminated: true },
          ])),
        },
        expect: { step: 2 },
      },
      {
        describe: 'should render the same step if all settlements at the same step',
        props: {
          settlements: settlementsNone.set('details', fromJS([
            { type: 'onchain-balance', isStageable: true, stageAmount: '100' },
            { type: 'payment', isStageable: true, stageAmount: '100' },
          ])),
        },
        expect: { step: 2 },
      },
      {
        describe: 'should render the last step',
        props: {
          settlements: settlementsNone.set('details', fromJS([
            { type: 'onchain-balance', isTerminated: true, stageAmount: '100' },
          ])),
        },
        expect: { step: 3 },
      },
    ].forEach((t) => {
      it(t.describe, () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            {...t.props}
          />
        );
        const stepsNode = wrapper.find('style__StyledSteps');
        expect(stepsNode.props().current).toEqual(t.expect.step);
      });
    });
  });

  describe('withdrawal actions', () => {
    const erc20Asset = walletsWithInfoMock.get(0).getIn(['balances', 'baseLayer', 'assets']).get(1).toJS();
    const ethAsset = { symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000', balance: new BigNumber('1') };
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
            <NahmiiWithdraw
              {...props}
              currentWalletWithInfo={t.walletsWithInfo}
            />
          );
        });
        it('should correctly calculate the base layer eth before', () => {
          const baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance.toNumber();
          expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .base-layer-eth-balance-before').props().main, baseLayerBalanceBefore, 'ETH');
        });
        if (t.type !== 'ETH') {
          it('should correctly calculate the base layer token balance before', () => {
            wrapper.setState({ amountToWithdraw: new BigNumber(1), assetToWithdraw: t.asset });
            const baseLayerTokenBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === t.asset.symbol).balance;
            expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .base-layer-token-balance-before').props().main, baseLayerTokenBalanceBefore, t.asset.symbol);
          });
        }
        describe('when withrawal amount is less than staged amount', () => {
          const amountToWithdraw = new BigNumber(2);
          beforeEach(() => {
            wrapper.setState({ amountToWithdraw, assetToWithdraw: t.asset });
          });
          it('should correctly calculate the staged balance before and after', () => {
            expect(wrapper.find('.withdraw-review .withdraw-btn').props().disabled).toEqual(false);
            expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .staged-balance-before').props().main, '3', t.asset.symbol);
            expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .staged-balance-after').props().main, '1', t.asset.symbol);
          });
          it('should correctly calculate the base layer eth after', () => {
            let baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance;
            const { gasPriceGwei, gasLimit } = wrapper.state();

            const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
            baseLayerBalanceBefore = baseLayerBalanceBefore.minus(txFeeAmt);
            if (t.type === 'ETH') {
              baseLayerBalanceBefore = baseLayerBalanceBefore.plus(amountToWithdraw);
            }
            expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .base-layer-eth-balance-after').props().main, baseLayerBalanceBefore, 'ETH');
          });
          if (t.type !== 'ETH') {
            it('should correctly calculate the token balance after', () => {
              let baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === t.asset.symbol).balance;
              baseLayerBalanceBefore = baseLayerBalanceBefore.plus(amountToWithdraw);
              expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .base-layer-token-balance-after').props().main, baseLayerBalanceBefore, t.asset.symbol);
            });
          }
        });
        describe('when withrawal amount is equal to staged amount', () => {
          beforeEach(() => {
            wrapper.setState({
              amountToWithdraw: new BigNumber(3),
              assetToWithdraw: t.asset,
            });
          });
          it('should correctly calculate the staged balance before and after', () => {
            expect(wrapper.find('.withdraw-review .withdraw-btn').props().disabled).toEqual(false);
            expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .staged-balance-before').props().main, '3', t.asset.symbol);
            expectTransferDescriptionMainProp(wrapper.find('.withdraw-review .staged-balance-after').props().main, '0', t.asset.symbol);
          });
        });
      });
    });
  });

  describe('notice element for withdrawal/settlement statuses', () => {
    describe('start settlement', () => {
      const getProps = (status) => ({
        settlements: settlementsNone.setIn(['settling', 'status'], status),
        currentWalletWithInfo:
            walletsWithInfoMock
              .get(0)
              .setIn(['balances', 'nahmiiStaged', 'assets'], fromJS([{ balance: new BigNumber(0), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])),
      });
      describe('should hide the settle button', () => {
        [
          { status: 'requesting', confOnDevice: true, text: /waiting_for_start_challenge_to_be.*signed/i },
          { status: 'mining', confOnDevice: true, text: /waiting_for_start_challenge_to_be.*signed/i },
          { status: 'receipt', confOnDevice: true, text: /waiting_for_start_challenge_to_be.*signed/i },
          { status: 'requesting', text: /waiting_for_start_challenge_to_be.*requested/i },
          { status: 'mining', text: /waiting_for_start_challenge_to_be.*mined/i },
          { status: 'receipt', text: /waiting_for_start_challenge_to_be.*mined/i },
        ].forEach((t) => {
          it(`should show the transaction status ${t.text} when status is ${t.status} and confOnDevice is ${t.confOnDevice}`, () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t.status)}
                ledgerNanoSInfo={ledgerHocDisconnectedMock.set('confTxOnDevice', t.confOnDevice)}
              />
            );
            wrapper.setState({ amountToWithdraw: new BigNumber(3) });
            expect(wrapper.find('.withdraw-review')).toHaveLength(0);
            expect(wrapper.find('.start-settlement')).toHaveLength(1);
            expect(wrapper.find('.challenge-btn')).toHaveLength(0);
            expect(wrapper.find('.challenge-tx-status')).toHaveLength(1);
            expect(wrapper.find('.challenge-tx-status Text').html()).toMatch(t.text);
          });
          it('should correctly calculate the nahmii balance before/after staging', () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t.status)}
                currentWalletWithInfo={
                  getProps(t.status).currentWalletWithInfo.setIn(
                    ['balances', 'nahmiiAvailable', 'assets'],
                    fromJS([{ balance: new BigNumber(4), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])
                  )
                }
              />
            );
            wrapper.setState({ amountToWithdraw: new BigNumber(3) });
            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .nahmii-balance-before-staging').props().main, '4', 'ETH');
            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .nahmii-balance-after-staging').props().main, '1', 'ETH');
          });
        });
      });

      describe('should show the settle button', () => {
        ['failed', null, 'success'].forEach((t) => {
          it(`hide the transaction status when status is ${t}`, () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t)}
              />
            );
            wrapper.setState({ amountToWithdraw: new BigNumber(3) });
            expect(wrapper.find('.withdraw-review')).toHaveLength(0);
            expect(wrapper.find('.start-settlement')).toHaveLength(1);
            expect(wrapper.find('.challenge-btn')).toHaveLength(1);
            expect(wrapper.find('.challenge-tx-status')).toHaveLength(0);
          });
          it('should correctly calculate the nahmii balance before/after staging', () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t)}
                currentWalletWithInfo={
                  getProps(t).currentWalletWithInfo.setIn(
                    ['balances', 'nahmiiAvailable', 'assets'],
                    fromJS([{ balance: new BigNumber(4), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])
                  ).set('type', 'software')
                }
              />
            );
            wrapper.setState({ amountToWithdraw: new BigNumber(3) });
            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .nahmii-balance-before-staging').props().main, 4, 'ETH');
            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .nahmii-balance-after-staging').props().main, 1, 'ETH');
            expect(wrapper.find('.start-settlement .challenge-btn').props().disabled).toEqual(false);
          });
          it('should disable settle button when required staged amount is greater than nahmii balance', () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t)}
                currentWalletWithInfo={
                  getProps(t).currentWalletWithInfo.setIn(
                    ['balances', 'nahmiiAvailable', 'assets'],
                    fromJS([{ balance: new BigNumber(1), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])
                  ).set('type', 'software')
                }
              />
            );
            wrapper.setState({ amountToWithdraw: new BigNumber(2) });
            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .nahmii-balance-before-staging').props().main, 1, 'ETH');
            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .nahmii-balance-after-staging').props().main, -1, 'ETH');
            expect(wrapper.find('.start-settlement .challenge-btn').props().disabled).toEqual(true);
          });
          it('should disable settle button when base eth after balance is negative', () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t)}
                currentWalletWithInfo={
                  getProps(t).currentWalletWithInfo.setIn(
                    ['balances', 'nahmiiAvailable', 'assets'],
                    fromJS([{ balance: new BigNumber(1), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])
                  ).set('type', 'software')
                }
              />
            );
            wrapper.setState({ amountToWithdraw: new BigNumber(1) });
            expect(wrapper.find('.start-settlement .challenge-btn').props().disabled).toEqual(false);
            const baseLayerBalanceBefore = getProps(t).currentWalletWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance;
            const { gasPriceGwei, gasLimit } = wrapper.state();

            const timesOfFees = 10000;
            const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit).times(timesOfFees);
            const baseLayerBalanceAfter = baseLayerBalanceBefore.minus(txFeeAmt);
            wrapper.setState({ gasLimit: gasLimit * timesOfFees });

            expectTransferDescriptionMainProp(wrapper.find('.start-settlement .base-layer-eth-balance-after').props().main, baseLayerBalanceAfter, 'ETH');
            expect(wrapper.find('.start-settlement .challenge-btn').props().disabled).toEqual(true);
          });
        });
      });

      it('should clear withdraw input when status is success', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
          />
        );

        wrapper.setState({
          amountToWithdrawInput: '1',
          amountToWithdraw: new BigNumber('1'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('1');
        wrapper.setProps({
          settlements: settlementsNone.setIn(['settling', 'status'], 'success'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('0');
      });
    });
    describe('confirm settling', () => {
      [
        { status: 'requesting', confOnDevice: true, text: /waiting_for_confirm_settle_to_be.*signed/i },
        { status: 'mining', confOnDevice: true, text: /waiting_for_confirm_settle_to_be.*signed/i },
        { status: 'receipt', confOnDevice: true, text: /waiting_for_confirm_settle_to_be.*signed/i },
        { status: 'requesting', text: /waiting_for_confirm_settle_to_be.*requested/i },
        { status: 'mining', text: /waiting_for_confirm_settle_to_be.*mined/i },
        { status: 'receipt', text: /waiting_for_confirm_settle_to_be.*mined/i },
      ].forEach((t) => {
        it(`should hide the confirm button and show the transaction status ${t.text} when status is ${t.status} and confOnDevice is ${t.confOnDevice}`, () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              settlements={settlementsNone.set('details', fromJS([
                { stageAmount: '100', isStageable: true },
                { stageAmount: '100', isStageable: true },
              ])).setIn(['staging', 'status'], t.status)}
              ledgerNanoSInfo={ledgerHocDisconnectedMock.set('confTxOnDevice', t.confOnDevice)}
            />
          );
          const noticeNode = wrapper.find('style__SettlementWarning');
          expect(noticeNode).toHaveLength(1);
          expect(noticeNode.props().message).toEqual('settlement_period_ended');

          const noticeNodeShallow = shallow(noticeNode.props().description);
          expect(noticeNodeShallow.find('.confirm-btn')).toHaveLength(0);
          expect(noticeNodeShallow.find('.confirm-tx-status')).toHaveLength(1);
          expect(noticeNodeShallow.find('.confirm-tx-status Text').html()).toMatch(t.text);
        });
      });
      ['failed', null, 'success'].forEach((t) => {
        it(`should show the confirm button and hide the transaction status when status is ${t}`, () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              settlements={settlementsNone.set('details', fromJS([
                { stageAmount: '100', isStageable: true },
                { stageAmount: '100', isStageable: true },
              ])).setIn(['staging', 'status'], t)}
            />
          );
          const noticeNode = wrapper.find('style__SettlementWarning');
          expect(noticeNode).toHaveLength(1);
          expect(noticeNode.props().message).toEqual('settlement_period_ended');

          const noticeNodeShallow = shallow(noticeNode.props().description);
          expect(noticeNodeShallow.find('.confirm-btn')).toHaveLength(1);
          expect(noticeNodeShallow.find('.confirm-tx-status')).toHaveLength(0);
        });
      });
      it('should clear withdraw input when status is success', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
          />
        );

        wrapper.setState({
          amountToWithdrawInput: '1',
          amountToWithdraw: new BigNumber('1'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('1');
        wrapper.setProps({
          settlements: settlementsNone.set('details', fromJS([
            { isStageable: true, stageAmount: '100' },
            { isStageable: true, stageAmount: '100' },
          ])).setIn(['staging', 'status'], 'success'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('0');
      });
    });
    describe('withdrawal', () => {
      [
        { status: 'requesting', confOnDevice: true, text: /waiting_for_withdraw_to_be.*signed/i },
        { status: 'mining', confOnDevice: true, text: /waiting_for_withdraw_to_be.*signed/i },
        { status: 'receipt', confOnDevice: true, text: /waiting_for_withdraw_to_be.*signed/i },
        { status: 'requesting', text: /waiting_for_withdraw_to_be.*requested/i },
        { status: 'mining', text: /waiting_for_withdraw_to_be.*mined/i },
        { status: 'receipt', text: /waiting_for_withdraw_to_be.*mined/i },
      ].forEach((t) => {
        it(`should hide the withdraw button and show the transaction status ${t.text} when status is ${t.status} and confOnDevice is ${t.confOnDevice}`, () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              withdrawals={fromJS({ status: t.status })}
              ledgerNanoSInfo={ledgerHocDisconnectedMock.set('confTxOnDevice', t.confOnDevice)}
            />
          );
          expect(wrapper.find('.withdraw-btn')).toHaveLength(0);
          expect(wrapper.find('.withdraw-status')).toHaveLength(1);
          expect(wrapper.find('.withdraw-status Text').html()).toMatch(t.text);
        });
      });
      ['failed', null, 'success'].forEach((t) => {
        it(`should show the withdraw button and hide the transaction status when status is ${t}`, () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              withdrawals={fromJS({ status: t })}
            />
          );
          expect(wrapper.find('.withdraw-btn')).toHaveLength(1);
          expect(wrapper.find('.withdraw-status')).toHaveLength(0);
        });
      });

      it('should clear withdraw input when status is success', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
          />
        );

        wrapper.setState({
          amountToWithdrawInput: '1',
          amountToWithdraw: new BigNumber('1'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('1');
        wrapper.setProps({
          withdrawals: fromJS({ status: 'success' }),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('0');
      });
    });
  });
});
