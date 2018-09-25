/**
*
* PageLoadingIndicator
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { Spin } from 'antd';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function PageLoadingIndicator(props) {
  return (
    <div>
      <Spin tip="Loading...">
        <FormattedMessage
          {...messages.header}
          values={{ pageType: props.pageType, id: props.id }}
        />
      </Spin>
    </div>
  );
}

PageLoadingIndicator.propTypes = {
  id: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
};

export default PageLoadingIndicator;
