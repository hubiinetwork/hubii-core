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
  ledgerHocConnectedMock,
} from 'containers/LedgerHoc/tests/mocks/selectors';

import {
  trezorHocConnectedMock,
  trezorHocDisconnectedMock,
} from 'containers/TrezorHoc/tests/mocks/selectors';

import {
  depositStatusNone,
  depositStatusEth,
  depositStatusApproving,
  depositStatusCompleting,
  depositStatusError,
  ongoingChallengesNone,
  settleableChallengesNone,
} from 'containers/NahmiiHoc/tests/mocks/selectors';

import {
  pricesLoadedMock,
  pricesLoadingMock,
  pricesErrorMock,
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

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
      intl,
      currentNetwork: currentNetworkMock,
      depositStatus: depositStatusNone,
      ledgerNanoSInfo: ledgerHocDisconnectedMock,
      trezorInfo: trezorHocDisconnectedMock,
      nahmiiWithdraw: () => {},
      goWalletDetails: () => {},
      setSelectedWalletCurrency: () => {},
      startChallenge: () => {},
      settle: () => {},
      withdraw: () => {},
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
    describe('when withrawal amount is greater than staged amount', () => {
      it('should render for starting settlement for required staged amount and hide the withdrawal review', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
          />
        );
        wrapper.setState({ amountToWithdraw: new BigNumber(1) });
        expect(wrapper.find('.start-settlement')).toHaveLength(1);
        expect(wrapper.find('.withdraw-review')).toHaveLength(0);
      });
    });
    describe('when withrawal amount is less than staged amount', () => {
      it('should render for withdrawal review and hide the start challenge action', () => {
        const wrapper = shallow(
          <NahmiiWithdraw
            {...props}
            currentWalletWithInfo={walletsWithInfoMock.get(0).setIn(['balances', 'nahmiiStaged', 'assets'], fromJS([{ balance: new BigNumber(3), symbol: 'ETH' }]))}
          />
        );
        wrapper.setState({ amountToWithdraw: new BigNumber(2) });
        expect(wrapper.find('.start-settlement')).toHaveLength(0);
        expect(wrapper.find('.withdraw-review')).toHaveLength(1);
      });
    });
  });


  it('should render correctly when ledger connected', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        ledgerNanoSInfo={ledgerHocConnectedMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when trezor connected', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        trezorInfo={trezorHocConnectedMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when prices are loading', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        prices={pricesLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when prices are errored', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        prices={pricesErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when depositing eth', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        depositStatus={depositStatusEth}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when approving a token deposit', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        depositStatus={depositStatusApproving}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when completing a token deposit', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        depositStatus={depositStatusCompleting}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when depositstatus is errored', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        depositStatus={depositStatusError}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets are loading', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        supportedAssets={supportedAssetsLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets are errored', () => {
    const wrapper = shallow(
      <NahmiiWithdraw
        {...props}
        supportedAssets={supportedAssetsErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
