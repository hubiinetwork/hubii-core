import * as React from 'react';
import { notification } from 'antd';
import { StyledIcon, StyledTitle } from './Notification.style';
export default (success, title) => {
  const color = success ? '#51b651' : '#ef3f20';
  notification.open({
    duration: 2,
    icon: <StyledIcon type="info-circle-o" />,
    message: <StyledTitle>{title}</StyledTitle>,
    description: '',
    placement: 'bottomRight',
    style: { background: color },
  });
};
