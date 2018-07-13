/**
*
* LoadingError
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function LoadingError(props) {
  if (props.error.message === 'Not Found') {
    return (
      <h1>
        <FormattedMessage
          {...messages.doesntExist}
          values={{ type: props.pageType, id: props.id }}
        />
      </h1>
    );
  }

  return (
    <h1>
      <FormattedMessage
        {...messages.unknownError}
        values={{ error: props.error.message }}
      />
    </h1>
  );
}

LoadingError.propTypes = {
  error: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default LoadingError;
