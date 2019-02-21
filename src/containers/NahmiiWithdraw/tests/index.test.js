import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';
import nahmii from 'nahmii-sdk';
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
  ongoingChallengesNone,
  settleableChallengesNone,
  withdrawalsNone,
} from 'containers/NahmiiHoc/tests/mocks/selectors';

import {
  pricesLoadedMock,
  supportedAssetsLoadedMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';
import { gweiToEther } from 'utils/wallet';

import { NahmiiWithdraw } from '../index';

describe('<NahmiiWithdraw />', () => {
  let props;
  beforeEach(() => {
    props = {
      currentWalletWithInfo: walletsWithInfoMock.get(0),
      prices: pricesLoadedMock,
      supportedAssets: supportedAssetsLoadedMock,
      ongoingChallenges: ongoingChallengesNone,
      settleableChallenges: settleableChallengesNone,
      withdrawals: withdrawalsNone,
      intl,
      currentNetwork: currentNetworkMock,
      ledgerNanoSInfo: ledgerHocDisconnectedMock,
      trezorInfo: trezorHocDisconnectedMock,
      nahmiiWithdraw: () => {},
      goWalletDetails: () => {},
      setSelectedWalletCurrency: () => {},
      startChallenge: () => {},
      settle: () => {},
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

  describe('settlement actions', () => {
    describe('when there are ongoing challenges', () => {
      it('should render notice for ongoing challenges', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            ongoingChallenges={ongoingChallengesNone.set('details', [
              { expirationTime: 1, intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
              { expirationTime: 1, intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
            ])}
          />
        );
        const noticeNode = wrapper.find('style__SettlementWarning');
        expect(noticeNode).toHaveLength(1);
        expect(noticeNode.props().message).toEqual('challenge_period_progress {"staging_amount":"2e-16","symbol":"ETH"}');
        expect(noticeNode.props().description).toEqual('challenge_period_endtime {"endtime":"Thursday, January 1, 1970 1:00 AM","symbol":"ETH"}');
        expect(noticeNode).toHaveLength(1);
      });
      it('should update the stepper graph to stage 0 when there are no ongoing/settleable challenges or invalid settlements', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
          />
        );
        const stepsNode = wrapper.find('Steps');
        expect(stepsNode.props().current).toEqual(0);
      });
      it('should update the stepper graph to stage 1 when there is a ongoing driip challenge', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            ongoingChallenges={ongoingChallengesNone.set('details', [
              { type: 'payment-driip', expirationTime: 1, intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
            ])}
          />
        );
        const stepsNode = wrapper.find('Steps');
        expect(stepsNode.props().current).toEqual(1);
      });
      it('should update the stepper graph to stage 2 when there is a settleable driip challenge', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            settleableChallenges={settleableChallengesNone.set('details', [
              { type: 'payment-driip', intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
            ])}
          />
        );
        const stepsNode = wrapper.find('Steps');
        expect(stepsNode.props().current).toEqual(2);
      });
      it('should update the stepper graph to stage 3 when the invalid settlement reason is "can not replay"', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            settleableChallenges={settleableChallengesNone.set('invalidReasons', [
              { type: 'payment-driip', reasons: [new Error('The settlement can not be replayed')] },
            ])}
          />
        );
        const stepsNode = wrapper.find('Steps');
        expect(stepsNode.props().current).toEqual(3);
      });
    });
    describe('when there are settleable challenges', () => {
      it('should render notice for settleable challenges and hide the withdrawal actions', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            settleableChallenges={settleableChallengesNone.set('details', [
              { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
              { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
            ])}
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
          expect(wrapper.find('.withdraw-review .base-layer-eth-balance-before').props().main).toEqual(`${baseLayerBalanceBefore} ETH`);
        });
        if (t.type !== 'ETH') {
          it('should correctly calculate the base layer token balance before', () => {
            wrapper.setState({ amountToWithdraw: new BigNumber(1), assetToWithdraw: t.asset });
            const baseLayerTokenBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === t.asset.symbol).balance;
            expect(wrapper.find('.withdraw-review .base-layer-token-balance-before').props().main).toEqual(`${baseLayerTokenBalanceBefore} ${t.asset.symbol}`);
          });
        }
        describe('when withrawal amount is less than staged amount', () => {
          const amountToWithdraw = new BigNumber(2);
          beforeEach(() => {
            wrapper.setState({ amountToWithdraw, assetToWithdraw: t.asset });
          });
          it('should correctly calculate the staged balance before and after', () => {
            expect(wrapper.find('.withdraw-review .withdraw-btn').props().disabled).toEqual(false);
            expect(wrapper.find('.withdraw-review .staged-balance-before').props().main).toEqual(`3 ${t.asset.symbol}`);
            expect(wrapper.find('.withdraw-review .staged-balance-after').props().main).toEqual(`1 ${t.asset.symbol}`);
          });
          it('should correctly calculate the base layer eth after', () => {
            let baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === 'ETH').balance;
            const { gasPriceGwei, gasLimit } = wrapper.state();

            const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
            baseLayerBalanceBefore = baseLayerBalanceBefore.minus(txFeeAmt);
            if (t.type === 'ETH') {
              baseLayerBalanceBefore = baseLayerBalanceBefore.plus(amountToWithdraw);
            }
            expect(wrapper.find('.withdraw-review .base-layer-eth-balance-after').props().main).toEqual(`${baseLayerBalanceBefore} ETH`);
          });
          if (t.type !== 'ETH') {
            it('should correctly calculate the token balance after', () => {
              let baseLayerBalanceBefore = t.walletsWithInfo.toJS().balances.baseLayer.assets.find((a) => a.symbol === t.asset.symbol).balance;
              baseLayerBalanceBefore = baseLayerBalanceBefore.plus(amountToWithdraw);
              expect(wrapper.find('.withdraw-review .base-layer-token-balance-after').props().main).toEqual(`${baseLayerBalanceBefore} ${t.asset.symbol}`);
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
            expect(wrapper.find('.withdraw-review .staged-balance-before').props().main).toEqual(`3 ${t.asset.symbol}`);
            expect(wrapper.find('.withdraw-review .staged-balance-after').props().main).toEqual(`0 ${t.asset.symbol}`);
          });
        });
      });
    });
  });

  describe('notice element for withdrawal/settlement statuses', () => {
    describe('start challenge', () => {
      const getProps = (status) => ({
        ongoingChallenges: ongoingChallengesNone.set('status', status),
        currentWalletWithInfo:
            walletsWithInfoMock
              .get(0)
              .setIn(['balances', 'nahmiiStaged', 'assets'], fromJS([{ balance: new BigNumber(0), symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000' }])),
      });
      describe('should hide the settle button', () => {
        [
          { status: 'requesting', text: /waiting_for_start_challenge_to_be/i },
          { status: 'mining', text: /waiting_for_start_challenge_to_be/i },
          { status: 'receipt', text: /waiting_for_start_challenge_to_be/i },
        ].forEach((t) => {
          it(`should show the transaction status when status is ${t.status}`, () => {
            const wrapper = shallow(
              <NahmiiWithdraw
                {...props}
                {...getProps(t.status)}
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
            expect(wrapper.find('.start-settlement .nahmii-balance-before-staging').props().main).toEqual('4 ETH');
            expect(wrapper.find('.start-settlement .nahmii-balance-after-staging').props().main).toEqual('1 ETH');
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
            expect(wrapper.find('.start-settlement .nahmii-balance-before-staging').props().main).toEqual('4 ETH');
            expect(wrapper.find('.start-settlement .nahmii-balance-after-staging').props().main).toEqual('1 ETH');
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
            expect(wrapper.find('.start-settlement .nahmii-balance-before-staging').props().main).toEqual('1 ETH');
            expect(wrapper.find('.start-settlement .nahmii-balance-after-staging').props().main).toEqual('-1 ETH');
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

            expect(wrapper.find('.start-settlement .base-layer-eth-balance-after').props().main).toEqual(`${baseLayerBalanceAfter} ETH`);
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
          ongoingChallenges: ongoingChallengesNone.set('status', 'success'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('0');
      });
    });
    describe('confirm settling', () => {
      [
        { status: 'requesting', text: /waiting_for_confirm_settle_to_be/i },
        { status: 'mining', text: /waiting_for_confirm_settle_to_be/i },
        { status: 'receipt', text: /waiting_for_confirm_settle_to_be/i },
      ].forEach((t) => {
        it(`should hide the confirm button and show the transaction status when status is ${t.status}`, () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              settleableChallenges={settleableChallengesNone.set('details', [
                { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
                { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
              ]).set('status', t.status)}
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
              settleableChallenges={settleableChallengesNone.set('details', [
                { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
                { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
              ]).set('status', t)}
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
          settleableChallenges: settleableChallengesNone.set('details', [
            { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
            { intendedStageAmount: new nahmii.MonetaryAmount('100', '0x1', 0) },
          ]).set('status', 'success'),
        });
        expect(wrapper.find('.withdraw-input').props().value).toEqual('0');
      });
    });
    describe('withdrawal', () => {
      [
        { status: 'requesting', text: /waiting_for_withdraw_to_be/i },
        { status: 'mining', text: /waiting_for_withdraw_to_be/i },
        { status: 'receipt', text: /waiting_for_withdraw_to_be/i },
      ].forEach((t) => {
        it(`should hide the withdraw button and show the transaction status when status is ${t.status}`, () => {
          const wrapper = shallow(
            <NahmiiWithdraw
              {...props}
              withdrawals={fromJS({ status: t.status })}
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
