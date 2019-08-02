/**
 *
 * NahmiiAirdriipRegistration
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import {
  StartWrapper,
  OuterWrapper,
  PrimaryHeading,
  SecondaryHeading,
} from './style';
import ScrollableContentWrapper from '../../components/ui/ScrollableContentWrapper';


export const Start = (props) => (
  <StartWrapper>
    <PrimaryHeading large>
      {props.intl.formatMessage({ id: 'thanks_for_interest_airdriip' })}
    </PrimaryHeading>
    <SecondaryHeading>
      {props.intl.formatMessage({ id: 'airdriip_disabled' })}
    </SecondaryHeading>
  </StartWrapper>
);

export const NahmiiAirdriipRegistration = (props) => (
  <ScrollableContentWrapper>
    <OuterWrapper>
      <Start intl={props.intl} />
    </OuterWrapper>
  </ScrollableContentWrapper>
);

NahmiiAirdriipRegistration.propTypes = {
  intl: PropTypes.object.isRequired,
};

Start.propTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  injectIntl
)(NahmiiAirdriipRegistration);
