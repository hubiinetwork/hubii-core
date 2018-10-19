/**
*
* AirdriipRegistrationStatusUi
*
*/

import React from 'react';
import { Spin, Alert, Icon } from 'antd';
import PropTypes from 'prop-types';
import Text from 'components/ui/Text';

const AirdriipRegistrationStatusUi = ({ status, loading, style }) => {
  if (loading) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Text>{'Checking registration status'}</Text>
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
        message="Address registered"
        description="No further action is required"
        type="success"
        showIcon
        style={style}
      />
    );
  }
  if (status === 'unregistered') {
    return (
      <Alert
        message="Address is not yet registered"
        type="info"
        showIcon
        style={style}
      />
    );
  }
  return (
    <Alert
      message="There was a problem communicating with the nahmii airdriip service, please try again later."
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
};

export default AirdriipRegistrationStatusUi;
