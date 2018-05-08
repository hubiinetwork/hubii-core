import * as React from 'react';
import PropTypes from 'prop-types';
import { StyledAffix, StyledStatus, StyledStatusLabel } from './Status.style';

/**
 * This component shows status
 */
const Status = props => {
  const { statusValue } = props;
  return (
    <StyledAffix>
      <StyledStatusLabel>Status: </StyledStatusLabel>
      <StyledStatus>{statusValue}</StyledStatus>
    </StyledAffix>
  );
};
Status.propTypes = {
  statusValue: PropTypes.oneOf(['online', 'offline', 'connecting'])
};
export default Status;
