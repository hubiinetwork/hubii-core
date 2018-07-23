import React from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper,
  AntdIcon,
  CustomIcon as Icon,
  Title,
} from './DashboardCard.style';

/**
 * This component shows app's features as options on the main screen.
 */

const DashboardCard = ({ className, iconType, title, iconSrc }) => (
  <Wrapper className={className}>
    {iconSrc ? <Icon src={iconSrc} /> : <AntdIcon type={iconType} />}
    s
    <Title>{title}</Title>
  </Wrapper>
  );

DashboardCard.propTypes = {
  /**
   * title to show on dashboard card.
   */
  title: PropTypes.string.isRequired,

  /**
   * antd icon to show on dashboard card with title.
   */
  iconType: PropTypes.string,

  /**
   * location of icon to show on dashboard card with title.
   */
  iconSrc: PropTypes.string,

  /**
   * styled-components classname
   */
  className: PropTypes.string,
};

export default DashboardCard;
