import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import SelectableText from '../SelectableText';

export const NumericText = (props) => {
  const { value, type, maxDecimalPlaces, intl } = props;
  const { formatNumber } = intl;

  if (type === 'currency') {
    const defaultMaxDecimalPlaces = 2;
    const _maxDecimalPlaces = maxDecimalPlaces || defaultMaxDecimalPlaces;
    return (
      <SelectableText {...props}>
        {formatNumber(value, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: _maxDecimalPlaces,
        })}
      </SelectableText>
    );
  }

  const defaultMaxDecimalPlaces = 6;
  const _maxDecimalPlaces = maxDecimalPlaces || defaultMaxDecimalPlaces;
  const bn = new BigNumber(value);

  if (bn.gte(new BigNumber(10).pow(-_maxDecimalPlaces))) {
    return (
      <SelectableText {...props}>
        {formatNumber(value, {
          maximumFractionDigits: _maxDecimalPlaces,
        })}
      </SelectableText>
    );
  }
  return (
    <SelectableText {...props}>
      {bn.eq(0) ? '0' : bn.toExponential(3)}
    </SelectableText>
  );
};

NumericText.propTypes = {
  value: PropTypes.string.isRequired,
  intl: PropTypes.object,
  type: PropTypes.string,
  maxDecimalPlaces: PropTypes.number,
};

export default injectIntl(NumericText);
