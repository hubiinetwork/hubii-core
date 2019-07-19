/**
*
* SimplexPage
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import { Wrapper, StyledSpin } from './styles';
import ScrollableContentWrapper from '../ui/ScrollableContentWrapper';


class SimplexPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { loading: false, error: false, timesStoppedLoading: 0 };
    this.startLoad = this.startLoad.bind(this);
    this.stopLoad = this.stopLoad.bind(this);
  }

  componentDidMount() {
    const webview = document.querySelector('webview');
    if (webview) {
      webview.addEventListener('did-start-loading', this.startLoad);
      webview.addEventListener('did-stop-loading', this.stopLoad);
    } else {
      this.setState({ error: true }); // eslint-disable-line
    }
  }

  // will show loading for landing page load and simplex checkout
  // load. stop checking after that, since it'll flash the loading
  // screen a few times during the simplex checkout process
  startLoad() {
    if (this.state.timesStoppedLoading < 2) {
      this.setState({ loading: true, timesStoppedLoading: this.state.timesStoppedLoading += 1 });
    }
  }

  stopLoad() {
    if (this.state.loading) {
      this.setState({ loading: false });
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
      <ScrollableContentWrapper>
        <Wrapper>
          {
            loading &&
            <StyledSpin tip="Loading..." size="large" />
          }
          <webview
            style={loading ? { visibility: 'hidden' } : { width: '100%', height: '80vh' }}
            autosize="on"
            src={'https://simplex.dev.hubii.net/?crypto=ETH'}
          ></webview>
        </Wrapper>
      </ScrollableContentWrapper>
    );
  }
}

SimplexPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default SimplexPage;
