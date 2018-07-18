import * as React from 'react';
import { notification } from 'antd';
import { StyledIcon, StyledTitle } from './Notification.style';

export default (type, title) => {
  // If unknown type default to info
  let color;
  let iconType;
  if (type === 'success') {
    color = '#51b651';
    iconType = 'check-circle-o';
  } else if (type === 'error') {
    color = '#ef3f20';
    iconType = 'close-circle-o';
  } else if (type === 'warning') {
    color = '#f0ad4e';
    iconType = 'exclamation-circle-o';
  } else {
    color = '#5bc0de';
    iconType = 'info-circle-o';
  }
  notification.open({
    duration: 4,
    icon: <StyledIcon type={iconType} />,
    message: <StyledTitle>{title}</StyledTitle>,
    description: '',
    placement: 'bottomRight',
    style: { background: color },
  });
};
