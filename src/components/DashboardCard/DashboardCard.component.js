import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledCard,
  Wrapper,
  IconSpan,
  TitleSpan
} from './DashboardCard.style';

/**
 * Dashboad card component to show features as option on the main screen
 */

const DashboardCard = ({ iconType, to, title }) => (
  <Wrapper>
    <StyledCard>
      <IconSpan>
        <Icon type={iconType} />
      </IconSpan>
      <TitleSpan> {title} </TitleSpan>
    </StyledCard>
  </Wrapper>
);
DashboardCard.propTypes = {
  /**
   * title to show on dashboard card
   */
  title: PropTypes.string.isRequired,
  /**
   * icon to show on dashboard card with title
   */
  iconType: PropTypes.string.isRequired
};
export default DashboardCard;
