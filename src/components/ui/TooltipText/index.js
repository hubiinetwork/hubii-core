import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tooltip, Icon } from 'antd';

const TooltipText = (props) => {
  const { details, children } = props;

  return (<Tooltip
    title={details}
  >
    {children}
    <Icon type="info-circle" style={{ marginLeft: '0.5rem' }} />
  </Tooltip>);
};

TooltipText.propTypes = {
  details: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default injectIntl(TooltipText);
