/**
 *
 * NahmiiDeposit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAbsolutePath } from 'utils/electron';
import BigNumber from 'bignumber.js';
// import { formatFiat } from 'utils/numberFormats';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import Collapse, { Panel } from 'components/ui/Collapse';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import { makeSelectCurrentWalletWithInfo } from 'containers/WalletHoc/selectors';
import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import { makeSelectDepositStatus } from 'containers/NahmiiHoc/selectors';
import { nahmiiDeposit } from 'containers/NahmiiHoc/actions';
import { injectIntl } from 'react-intl';

import {
  AdvancedSettingsHeader,
} from './style';


export class NahmiiDeposit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const baseLayerAssets = props.currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const assetToDeposit = baseLayerAssets[0];

    // max decimals possible for current asset
    const assetToDepositMaxDecimals = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === assetToDeposit.currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToDepositInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToDepositMaxDecimals}})?$`);

    this.state = {
      amountToDepositInput: '0',
      amountToDeposit: new BigNumber('0'),
      assetToDeposit,
      assetToDepositMaxDecimals,
      amountToDepositInputRegex,
      gasPriceGweiInput: '10',
      gasPriceGwei: new BigNumber('10'),
      gasLimit: 21000,
      addContactModalVisibility: false,
      gasLimitInput: '21000',
    };
  }

  render() {
    const {
      assetToDeposit,
      gasLimitInput,
      gasPriceGweiInput,
      amountToDepositInput,
    } = this.state;
    const {
      currentWalletWithInfo,
      intl,
    } = this.props;
    const { formatMessage } = intl;

    const baseLayerAssets = currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Form>
            <FormItem
              label={<FormItemLabel>Select an asset to deposit</FormItemLabel>}
              colon={false}
            >
              <img
                src={getAbsolutePath(`public/images/assets/${assetToDeposit.symbol}.svg`)}
                alt="logo"
              />
              <Select
                // disabled={transfering}
                defaultValue={assetToDeposit.symbol}
                onSelect={this.handleAssetChange}
                style={{ paddingLeft: '0.5rem' }}
              >
                {baseLayerAssets.map((currency) => (
                  <Option value={currency.symbol} key={currency.symbol}>
                    {currency.symbol}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
              colon={false}
              // help={<HelperText left={formatFiat(usdValueToDeposit, 'USD')} right={formatMessage({ id: 'usd' })} />}
            >
              <Input
                // disabled={transfering}
                defaultValue={amountToDepositInput}
                value={amountToDepositInput}
                onFocus={() => this.onFocusNumberInput('amountToSendInput')}
                onBlur={() => this.onBlurNumberInput('amountToSendInput')}
                onChange={this.handleAmountToSendChange}
              />
            </FormItem>
            <Collapse bordered={false} defaultActiveKey={['2']}>
              <Panel
                header={<AdvancedSettingsHeader>{formatMessage({ id: 'advanced_settings' })}</AdvancedSettingsHeader>}
                key="1"
              >
                <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_price' })}</FormItemLabel>} colon={false}>
                  <Input
                    // disabled={transfering}
                    min={0}
                    defaultValue={gasPriceGweiInput}
                    value={gasPriceGweiInput}
                    onChange={this.handleGasPriceChange}
                    onFocus={() => this.onFocusNumberInput('gasPriceGweiInput')}
                    onBlur={() => this.onBlurNumberInput('gasPriceGweiInput')}
                  />
                </FormItem>
                <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_limit' })}</FormItemLabel>} colon={false}>
                  <Input
                    // disabled={transfering}
                    value={gasLimitInput}
                    defaultValue={gasLimitInput}
                    onChange={this.handleGasLimitChange}
                    onFocus={() => this.onFocusNumberInput('gasLimitInput')}
                    onBlur={() => this.onBlurNumberInput('gasLimitInput')}
                  />
                </FormItem>
              </Panel>
            </Collapse>
          </Form>
          col1
        </div>
        <div style={{ flex: '1' }}>
          col2
        </div>
      </div>
    );
  }
}

NahmiiDeposit.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  // ledgerNanoSInfo: PropTypes.object.isRequired,
  // trezorInfo: PropTypes.object.isRequired,
  // prices: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  // nahmiiDeposit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  depositStatus: makeSelectDepositStatus(),
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  prices: makeSelectPrices(),
  supportedAssets: makeSelectSupportedAssets(),
});

function mapDispatchToProps(dispatch) {
  return {
    nahmiiDeposit: (...args) => dispatch(nahmiiDeposit(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiDeposit);
