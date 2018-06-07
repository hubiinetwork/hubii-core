import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { createStructuredSelector } from 'reselect';

import StriimAccountsContainer from 'containers/StriimAccounts';
import StriimTabs, { TabPane } from 'components/ui/StriimTabs';
import { Wrapper } from './StriimAccounts.style';

export class StriimContainers extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  onTabChange(key) {
    const { history } = this.props;// eslint-disable-line
    history.push(key);
  }

  render() {
    const { history, match } = this.props;// eslint-disable-line
    return (
      <Wrapper>
        <StriimTabs defaultActiveKey={history.location.pathname} onChange={this.onTabChange.bind(this)}>
          <TabPane tab="Accounts" key={`${match.url}/accounts`} style={{ color: 'white' }}>
            <Route path={`${match.url}/accounts`} component={StriimAccountsContainer} />
          </TabPane>
          <TabPane tab="Contacts" key={`${match.url}/contacts`} style={{ color: 'white' }}>
            Content of Tab Pane 2
          </TabPane>
        </StriimTabs>
        {
          history.location.pathname === match.url &&
          <Redirect from={match.url} to={`${match.url}/accounts`} push />
        }
      </Wrapper>
    );
  }
}

StriimContainers.propTypes = {};

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, null);


export default compose(
  withConnect,
)(StriimContainers);
