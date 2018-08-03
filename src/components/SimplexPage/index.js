/**
*
* SimplexPage
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import Wrapper from './Wrapper';


class SimplexPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { match } = this.props;
    const address = match.path.substring(8, 50);
    if (!isValidAddress(address)) {
      return (
        <p style={{ color: 'white' }}>Fatal error: Failed to locate selected wallet address</p>
      );
    }
    return (
      <Wrapper>
        <webview
          style={{ width: '100%', height: '100%' }}
          src={`https://hubii-simplex.netlify.com?address=${address}`}
        ></webview>
      </Wrapper>
    );
  }
}

SimplexPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default SimplexPage;
