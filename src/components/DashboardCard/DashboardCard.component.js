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
 * The props of Dashboard Component
 * @param {string} props.title title to be shown on the card.
 * @param {string} props.iconType icon to be shown at the header.
 * @param {string} props.href path to navigate when DashboardCard is clicked.
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
  title: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired
};
export default DashboardCard;
