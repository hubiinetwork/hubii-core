import * as React from 'react';
import { notification } from 'antd';
import { StyledIcon, StyledTitle } from './Notification.style';

export default (type, message, customDuration) => {
  // If unknown type default to info
  let color;
  let iconType;
  let duration;
  if (type === 'success') {
    color = '#51b651';
    iconType = 'check-circle-o';
    duration = customDuration || 4;
  } else if (type === 'error') {
    color = '#ef3f20';
    iconType = 'close-circle-o';
    duration = customDuration || 10;
  } else if (type === 'warning') {
    color = '#f0ad4e';
    iconType = 'exclamation-circle-o';
    duration = customDuration || 10;
  } else {
    color = '#5bc0de';
    iconType = 'info-circle-o';
    duration = customDuration || 4;
  }
  notification.open({
    duration,
    icon: <StyledIcon type={iconType} />,
    message: <StyledTitle large>{message}</StyledTitle>,
    description: '',
    placement: 'bottomRight',
    style: { background: color },
  });
};
