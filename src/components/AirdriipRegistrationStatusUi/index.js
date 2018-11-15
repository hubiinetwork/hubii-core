/**
*
* AirdriipRegistrationStatusUi
*
*/

import React from 'react';
import { Spin, Alert, Icon } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Text from 'components/ui/Text';

const AirdriipRegistrationStatusUi = ({ status, loading, style, intl }) => {
  const { formatMessage } = intl;
  if (loading) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>
          {formatMessage({ id: 'checking_registration_status' })}
        </Text>
        <Spin
          style={{ marginLeft: '0.75rem' }}
          indicator={<Icon type="loading" />}
        />
      </div>
    );
  }
  if (status === 'registered') {
    return (
      <Alert
        message={formatMessage({ id: 'address_registered' })}
        description={formatMessage({ id: 'no_further_action_required' })}
        type="success"
        showIcon
        style={style}
      />
    );
  }
  if (status === 'unregistered') {
    return (
      <Alert
        message={formatMessage({ id: 'address_not_registered' })}
        type="info"
        showIcon
        style={style}
      />
    );
  }
  return (
    <Alert
      message={formatMessage({ id: 'problem_communicating_nahmii_airdriip' })}
      description={status}
      type="error"
      showIcon
      style={style}
    />
  );
};

AirdriipRegistrationStatusUi.propTypes = {
  loading: PropTypes.bool.isRequired,
  status: PropTypes.string,
  style: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(AirdriipRegistrationStatusUi);
