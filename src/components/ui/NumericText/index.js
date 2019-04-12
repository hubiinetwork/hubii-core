import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import SelectableText from '../SelectableText';

const NumericText = (props) => {
  const { value, type, intl } = props;
  const { formatNumber } = intl;
  const options = {
    maximumFractionDigits: 6,
  };
  if (type === 'currency') {
    options.style = 'currency';
    options.currency = 'USD';
    options.maximumFractionDigits = 2;
  }
  return (
    <SelectableText {...props}>{formatNumber(value, options)}</SelectableText>
  );
};

NumericText.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(NumericText);
