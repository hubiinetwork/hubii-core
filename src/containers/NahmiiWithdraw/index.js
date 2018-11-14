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
import BigNumber from 'bignumber.js';
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
  makeSelectNahmiiBalancesByCurrentWallet,
} from 'containers/NahmiiHoc/selectors';
import {
  makeSelectSupportedAssets,
} from 'containers/HubiiApiHoc/selectors';

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
    this.state = { amountToSendInput: 0, syncTime: new Date(), selectedSymbol: 'ETH' };
    this.startPaymentChallenge = this.startPaymentChallenge.bind(this);
    this.settlePaymentDriip = this.settlePaymentDriip.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
  }

  getAssetDetailsBySymbol(symbol) {
    const { supportedAssets } = this.props;
    const assetDetails = supportedAssets.get('assets').find((a) => a.get('symbol') === symbol);
    return assetDetails;
  }

  getLastReceipt() {
    const { allReceipts, currentWalletWithInfo } = this.props;
    const { selectedSymbol } = this.state;
    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol);
    const walletReceipts = allReceipts.get(currentWalletWithInfo.get('address'));
    if (!assetDetails) {
      return null;
    }

    if (!walletReceipts) {
      return null;
    }

    const currency = assetDetails.toJS().symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetDetails.toJS().symbol;
    const lastReceipt = walletReceipts.filter((r) => r.currency.ct === currency).sort((a, b) => b.nonce - a.nonce)[0];
    return lastReceipt;
  }

  settlePaymentDriip() {
    const { currentWalletWithInfo, allReceipts, lastPaymentChallenge } = this.props;
    const challenge = lastPaymentChallenge.get('challenge');
    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address')).filter((receipt) => receipt.nonce === challenge.nonce.toNumber())[0];
    this.props.settlePaymentDriip(lastReceipt);
  }

  startPaymentChallenge() {
    const { selectedSymbol } = this.state;
    const stageAmount = ethers.utils.parseEther('2.5');

    const lastReceipt = this.getLastReceipt();

    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol).toJS();
    this.props.startPaymentChallenge(lastReceipt, stageAmount, assetDetails.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetDetails.currency);
    this.state.syncTime = moment().add(30, 'seconds').toDate();
  }

  withdraw() {
    const { selectedSymbol } = this.state;
    const amount = ethers.utils.parseEther('2.5');
    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol).toJS();
    const currency = assetDetails.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetDetails.currency;
    this.props.withdraw(amount, currency);
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

  handleAssetChange(symbol) {
    const { supportedAssets } = this.props;
    const assetDetails = supportedAssets.get('assets').find((a) => a.get('symbol') === symbol).toJS();
    this.setState({ selectedSymbol: assetDetails.symbol });
  }

  canStartPaymentChallenge() {
    const { lastPaymentChallenge, lastSettlePaymentDriip } = this.props;
    const { syncTime } = this.state;
    const challengeUpdatedTime = lastPaymentChallenge.get('updatedAt');
    const challenge = lastPaymentChallenge.get('challenge');
    const settlementUpdatedTime = lastSettlePaymentDriip.get('updatedAt');
    const lastReceipt = this.getLastReceipt();

    if (!lastReceipt) {
      return false;
    }

    return lastPaymentChallenge.get('phase') !== 'Dispute' &&
           lastPaymentChallenge.get('txStatus') !== 'mining' &&
           !this.canSettlePaymentDriip() &&
           lastReceipt && challenge && challenge.nonce.toNumber() < lastReceipt.nonce &&
           (settlementUpdatedTime && challengeUpdatedTime && syncTime.getTime() < settlementUpdatedTime.getTime() && syncTime.getTime() < challengeUpdatedTime.getTime());
  }

  render() {
    const { intl, lastPaymentChallenge, nahmiiBalances, supportedAssets } = this.props;
    const { formatMessage } = intl;
    const { selectedSymbol } = this.state;
    const { staged } = nahmiiBalances.toJS();

    const {
      amountToSendInput,
    } = this.state;

    const challenge = lastPaymentChallenge.get('challenge');
    const assets = supportedAssets.get('assets').toJS();
    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol);

    if (!assetDetails || !staged) {
      return (null);
    }
    const assetDecimals = assetDetails.toJS().decimals;
    const stagedBalance = staged.assets[0] || { balance: new BigNumber('0') };
    const formattedStagedBalance = stagedBalance.balance.div(new BigNumber('10').pow(assetDecimals)).toString();
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
              onSelect={this.handleAssetChange}
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
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount_withdraw' }, { withdraw_amount: formattedStagedBalance, symbol: 'ETH' })}</FormItemLabel>}
            colon={false}
          >
            <Input
              defaultValue={amountToSendInput}
              value={amountToSendInput}
            />
            <StyledButton onClick={this.withdraw}>{formatMessage({ id: 'withdraw' })}</StyledButton>
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
  nahmiiBalances: PropTypes.object.isRequired,
  settlePaymentDriip: PropTypes.func.isRequired,
  startPaymentChallenge: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  allReceipts: makeSelectReceipts(),
  lastPaymentChallenge: makeSelectLastPaymentChallenge(),
  lastSettlePaymentDriip: makeSelectLastSettlePaymentDriip(),
  nahmiiBalances: makeSelectNahmiiBalancesByCurrentWallet(),
  supportedAssets: makeSelectSupportedAssets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    startPaymentChallenge: (...args) => dispatch(actions.startPaymentChallenge(...args)),
    settlePaymentDriip: (...args) => dispatch(actions.settlePaymentDriip(...args)),
    withdraw: (...args) => dispatch(actions.withdraw(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiWithdraw);
