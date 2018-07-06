/**
*
* PageLoadingIndicator
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { Loader } from 'semantic-ui-react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function PageLoadingIndicator(props) {
  return (
    <div>
      <Loader active={props.loading} size="huge">
        <FormattedMessage
          {...messages.header}
          values={{ pageType: props.pageType, id: props.id }}
        />
      </Loader>
    </div>
  );
}

PageLoadingIndicator.propTypes = {
  id: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PageLoadingIndicator;
