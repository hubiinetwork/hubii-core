import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import { injectIntl } from 'react-intl';
// import { getAbsolutePath } from 'utils/electron';
import ethers from 'ethers';
import moment from 'moment';
import Select, { Option } from 'components/ui/Select';
import Input from 'components/ui/Input';
import * as actions from 'containers/NahmiiHoc/actions';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import {
  makeSelectReceipts,
  makeSelectLastPaymentChallenge,
  makeSelectLastSettlePaymentDriip,
} from 'containers/NahmiiHoc/selectors';

import {
  OuterWrapper,
  // ETHtoDollar,
  // Image,
  // AdvanceSettingsHeader,
  // Panel,
  StyledButton,
  SettlementWarning,
  ChallengeWarning,
} from './NahmiiWithdraw.style';

export class NahmiiWithdraw extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { amountToSendInput: 0, syncTime: new Date() };
    this.startPaymentChallenge = this.startPaymentChallenge.bind(this);
    this.settlePaymentDriip = this.settlePaymentDriip.bind(this);
  }

  settlePaymentDriip() {
    const { currentWalletWithInfo, allReceipts, lastPaymentChallenge } = this.props;
    const challenge = lastPaymentChallenge.get('challenge');
    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address')).filter((receipt) => receipt.nonce === challenge.nonce.toNumber())[0];
    this.props.settlePaymentDriip(lastReceipt);
  }

  startPaymentChallenge() {
    const { currentWalletWithInfo, allReceipts } = this.props;
    const stageAmount = ethers.utils.parseEther('2.5');

    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address'))[0];
    this.props.startPaymentChallenge(lastReceipt, stageAmount, '0x0000000000000000000000000000000000000000');
    this.state.syncTime = moment().add(30, 'seconds').toDate();
  }

  isChallengeInProgress() {
    const { lastPaymentChallenge } = this.props;
    const challenge = lastPaymentChallenge.get('challenge');
    if (challenge && challenge.timeout.toNumber() * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }

  canSettlePaymentDriip() {
    const { currentWalletWithInfo, lastPaymentChallenge, lastSettlePaymentDriip } = this.props;
    const address = currentWalletWithInfo.get('address');
    const settlement = lastSettlePaymentDriip.get('settlement');
    const challenge = lastPaymentChallenge.get('challenge');
    // console.log(lastSettlePaymentDriip.get('loadingSettlement'))
    if (lastPaymentChallenge.get('phase') === 'Dispute' || !lastPaymentChallenge.get('phase')) { return false; }

    if (lastPaymentChallenge.get('status') === 'Disqualified' || !lastPaymentChallenge.get('status')) { return false; }

    if (!settlement) {
      return false;
    }

    if (!challenge || !challenge.nonce.toNumber()) {
      return false;
    }

    if (!settlement.origin || !settlement.target) {
      return true;
    }

    if (settlement.origin.done && settlement.origin.wallet === address) { return false; }
    if (settlement.target.done && settlement.target.wallet === address) { return false; }

    return true;
  }

  canStartPaymentChallenge() {
    const { lastPaymentChallenge, lastSettlePaymentDriip, allReceipts, currentWalletWithInfo } = this.props;
    const { syncTime } = this.state;
    const challengeUpdatedTime = lastPaymentChallenge.get('updatedAt');
    const challenge = lastPaymentChallenge.get('challenge');
    const settlementUpdatedTime = lastSettlePaymentDriip.get('updatedAt');
    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address')).sort((a, b) => b.nonce - a.nonce)[0];

    return lastPaymentChallenge.get('phase') !== 'Dispute' &&
           lastPaymentChallenge.get('txStatus') !== 'mining' &&
           !this.canSettlePaymentDriip() &&
           lastReceipt && challenge && challenge.nonce.toNumber() < lastReceipt.nonce &&
           (settlementUpdatedTime && challengeUpdatedTime && syncTime.getTime() < settlementUpdatedTime.getTime() && syncTime.getTime() < challengeUpdatedTime.getTime());
  }

  render() {
    const { intl, lastPaymentChallenge } = this.props;
    const { formatMessage } = intl;
    const assets = [
      { symbol: 'ETH' },
    ];

    const {
      amountToSendInput,
    } = this.state;

    const challenge = lastPaymentChallenge.get('challenge');

    return (
      <OuterWrapper>
        {
          this.canSettlePaymentDriip() &&
          <SettlementWarning
            message={formatMessage({ id: 'settlement_period_ended' })}
            description={
              <div>
                <div>
                  {formatMessage({ id: 'settlement_period_ended_notice' })}
                </div>
                <StyledButton onClick={this.settlePaymentDriip}>
                  {formatMessage({ id: 'confirm_settlement' })}
                </StyledButton>
              </div>
            }
            type="info"
            showIcon
          />
        }
        {
          this.isChallengeInProgress() &&
          <ChallengeWarning
            message={formatMessage({ id: 'challenge_period_progress' })}
            description={formatMessage({ id: 'challenge_period_endtime' }, { endtime: moment(challenge.timeout * 1000).format('LLLL') })}
            type="info"
            showIcon
          />
        }
        <Form>
          <FormItem
            label={<FormItemLabel>{formatMessage({ id: 'select_asset' })}</FormItemLabel>}
            colon={false}
          >
            {/* <Image
              src={getAbsolutePath(`public/images/assets/${assets[0].symbol}.svg`)}
              alt="logo"
            /> */}
            <Select
              // disabled={transfering}
              defaultValue={'ETH'}
              // onSelect={this.handleAssetChange}
              style={{ paddingLeft: '0.5rem' }}
            >
              {assets.map((currency) => (
                <Option value={currency.symbol} key={currency.symbol}>
                  {currency.symbol}
                </Option>
            ))}
            </Select>
          </FormItem>
          <FormItem
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
            colon={false}
            // help={<HelperText left={formatFiat(usdValueToSend, 'USD')} right={formatMessage({ id: 'usd' })} />}
          >
            <Input
              // disabled={transfering}
              defaultValue={amountToSendInput}
              value={amountToSendInput}
              // onFocus={() => this.onFocusNumberInput('amountToSendInput')}
              // onBlur={() => this.onBlurNumberInput('amountToSendInput')}
              // onChange={this.handleAmountToSendChange}
            />
            <StyledButton onClick={this.startPaymentChallenge} disabled={!this.canStartPaymentChallenge()}>
              {formatMessage({ id: 'settle_payment' })}
            </StyledButton>
          </FormItem>
          <FormItem
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
            colon={false}
          >
            <Input
              defaultValue={amountToSendInput}
              value={amountToSendInput}
            />
            <StyledButton>{formatMessage({ id: 'withdraw' })}</StyledButton>
          </FormItem>
        </Form>
      </OuterWrapper>
    );
  }
}

NahmiiWithdraw.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  allReceipts: PropTypes.object.isRequired,
  lastPaymentChallenge: PropTypes.object.isRequired,
  lastSettlePaymentDriip: PropTypes.object.isRequired,
  settlePaymentDriip: PropTypes.object.isRequired,
  startPaymentChallenge: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  allReceipts: makeSelectReceipts(),
  lastPaymentChallenge: makeSelectLastPaymentChallenge(),
  lastSettlePaymentDriip: makeSelectLastSettlePaymentDriip(),
});

export function mapDispatchToProps(dispatch) {
  return {
    startPaymentChallenge: (...args) => dispatch(actions.startPaymentChallenge(...args)),
    settlePaymentDriip: (...args) => dispatch(actions.settlePaymentDriip(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiWithdraw);
