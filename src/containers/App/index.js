/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { shell } from 'electron';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { getAbsolutePath } from 'utils/electron';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import HomeScreen from 'components/HomeScreen';
import SideBar from 'components/SideBar';
import Striim from 'containers/Striim';
import WalletManager from 'containers/WalletManager';
import WalletDetails from 'containers/WalletDetails';
import Dex from 'containers/Dex';
import Settings from 'containers/Settings';

import withExchangeRate from 'containers/ExchangeRateHOC';
import WalletHOC from 'containers/WalletHOC';

import { Modal } from 'components/ui/Modal';
import { OWNER, REPO } from 'config/constants';

import {
  ButtonDiv,
  StyledButton,
  StyledDetailsButton,
  TitleDiv,
  TextWhite,
  Container,
} from './index.style';

import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import { makeSelectReleaseNotes } from './selectors';

class App extends React.PureComponent {
  render() {
    const menuItems = [
      {
        to: '/wallets',
        icon: 'wallet',
        name: 'Wallet Manager',
      },
      {
        to: '/dex',
        icon: 'dex',
        name: 'dex detail',
      },
    ];
    return (
      <SideBar menuItems={menuItems} logoSrc={getAbsolutePath('public/images/hubii-core-logo.svg')}>
        <Helmet>
          <title>hubii core</title>
        </Helmet>
        <Switch>
          <Route path="/wallets" component={WalletManager} />
          <Route path="/wallet/:address" component={WalletDetails} />
          <Route path="/striim" component={Striim} />
          <Route path="/dex" component={Dex} />
          <Route path="/settings" component={Settings} />
          <Route component={HomeScreen} />
        </Switch>
        <Modal
          footer={null}
          width={'41.79rem'}
          maskClosable
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '1.43rem' }}
          visible={this.props.releaseNotes.show}
          onCancel={this.props.hideReleaseNotes}
          destroyOnClose
        >
          <TitleDiv>
            {`New version available - ${this.props.releaseNotes.version}`}
          </TitleDiv>
          <Container>
            <ReactMarkdown source={this.props.releaseNotes.body} />
          </Container>
          <ButtonDiv>
            <StyledButton type="primary" onClick={this.props.installNewRelease}>
              <TextWhite>Install</TextWhite>
            </StyledButton>
            <StyledDetailsButton type="primary" onClick={() => { shell.openExternal(`https://github.com/${OWNER}/${REPO}/releases/tag/${this.props.releaseNotes.version}`); }}>
              <TextWhite>View Details</TextWhite>
            </StyledDetailsButton>
          </ButtonDiv>
        </Modal>
      </SideBar>
    );
  }
}

App.propTypes = {
  releaseNotes: PropTypes.object.isRequired,
  hideReleaseNotes: PropTypes.func.isRequired,
  installNewRelease: PropTypes.func.isRequired,
};

const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

const mapStateToProps = createStructuredSelector({
  releaseNotes: makeSelectReleaseNotes(),
});
function mapDispatchToProps(dispatch) {
  return {
    hideReleaseNotes: () => dispatch(actions.hideReleaseNotes()),
    installNewRelease: () => dispatch(actions.installNewRelease()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withExchangeRate,
  WalletHOC,
)(App);
