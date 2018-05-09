import * as React from 'react';
import PropTypes from 'prop-types';
import { StyledAffix, StyledStatus, StyledStatusLabel } from './Status.style';

/**
 * This component shows status of the user's  API connection.
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
  /**
   * statusValue prop to  decide  whether  the user is online, offline or in a connecting state.
   */
  statusValue: PropTypes.oneOf(['online', 'offline', 'connecting'])
};
export default Status;
