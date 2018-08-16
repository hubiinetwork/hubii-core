/**
*
* SimplexPage
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import { Wrapper, StyledSpin } from './styles';


class SimplexPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { loading: false, error: false };
  }

  componentDidMount() {
    const webview = document.querySelector('webview');
    if (webview) {
      webview.addEventListener('did-start-loading', () => this.setState({ loading: true }));
      webview.addEventListener('did-stop-loading', () => this.setState({ loading: false }));
    } else {
      this.setState({ error: true }); // eslint-disable-line
    }
  }

  render() {
    const { match } = this.props;
    const { loading, error } = this.state;
    const address = match.path.substring(8, 50);
    if (!isValidAddress(address) || error) {
      return (
        <p style={{ color: 'white' }}>Unexpected error occured, please try again later</p>
      );
    }
    return (
      <Wrapper>
        {
          loading &&
            <StyledSpin tip="Loading..." size="large" />
        }
        <webview
          style={loading ? { display: 'none' } : { width: '100%', height: '80vh' }}
          autosize="on"
          src={'https://simplex.dev.hubii.net/?crypto=ETH'}
        ></webview>
      </Wrapper>
    );
  }
}

SimplexPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default SimplexPage;
