/**
 *
 * Nahmii
 *
 */

import React from 'react';
import { Route } from 'react-router';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Icon } from 'antd';
import { injectIntl } from 'react-intl';

import TopHeader from 'components/ui/TopHeader';
import Heading from 'components/ui/Heading';
import Tabs, { TabPane } from 'components/ui/Tabs';

import NahmiiAirdriipRegistration from 'containers/NahmiiAirdriipRegistration';

import { OuterWrapper } from './style';


export class Nahmii extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { match, history, dispatch } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <OuterWrapper>
        <TopHeader>
          <Heading>{formatMessage({ id: 'my_nahmii' })}</Heading>
        </TopHeader>
        <Tabs
          activeKey={history.location.pathname}
          onChange={(route) => dispatch(push(route))}
          animated={false}
        >
          <TabPane
            tab={
              <span>
                <Icon type="solution" />
                {formatMessage({ id: 'airdriip_registration' })}
              </span>
            }
            key={`${match.url}/airdriip-registration`}
          >
            <Route
              path={`${match.url}/airdriip-registration`}
              component={NahmiiAirdriipRegistration}
            />
          </TabPane>
        </Tabs>
      </OuterWrapper>
    );
  }
}

Nahmii.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(Nahmii);
