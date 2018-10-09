import * as React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectCurrentNetwork, makeSelectSupportedNetworks } from 'containers/App/selectors';
import { changeNetwork } from 'containers/App/actions';
import { changeLocale } from 'containers/LanguageProvider/actions';

import TopHeader from 'components/ui/TopHeader';
import Heading from 'components/ui/Heading';
import Select, { Option } from 'components/ui/Select';

import { translationMessages } from '../../i18n';

import {
  Wrapper,
  SettingWrapper,
  Body,
  StyledSectionHeading,
} from './style';

export class Settings extends React.PureComponent {

  render() {
    const { onChangeNetwork, onChangeLocale, currentNetwork, supportedNetworks } = this.props;
    return (
      <Wrapper>
        <TopHeader>
          <Heading>Settings</Heading>
        </TopHeader>
        <Body>
          <SettingWrapper>
            <StyledSectionHeading>
              Network
            </StyledSectionHeading>
            <Select
              value={currentNetwork.provider.name}
              style={{ width: '15rem' }}
              onChange={onChangeNetwork}
              disabled
            >
              {
                Object.entries(supportedNetworks.toJS()).map(([key]) => {
                  const label = key === 'homestead' ? '[MAINNET]' : '[TESTNET]';
                  const name = `${key.charAt(0).toUpperCase()}${key.slice(1)} ${label}`;
                  return (
                    <Option value={key} key={key}>
                      {name}
                    </Option>
                  );
                })
              }
            </Select>
          </SettingWrapper>
          <SettingWrapper>
            <StyledSectionHeading>
              Language
            </StyledSectionHeading>
            <Select
              // value={'en'}
              style={{ width: '15rem' }}
              onChange={onChangeLocale}
            >
              {
                Object.keys(translationMessages).map((locale) => (
                  <Option value={locale} key={locale}>
                    {translationMessages[locale].language}
                  </Option>
                  ))
              }
            </Select>
          </SettingWrapper>
        </Body>
      </Wrapper>
    );
  }
  }

Settings.propTypes = {
  onChangeNetwork: PropTypes.func.isRequired,
  onChangeLocale: PropTypes.func.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  supportedNetworks: ImmutablePropTypes.map.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentNetwork: makeSelectCurrentNetwork(),
  supportedNetworks: makeSelectSupportedNetworks(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeNetwork: (...args) => dispatch(changeNetwork(...args)),
    onChangeLocale: (...args) => dispatch(changeLocale(...args)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(Settings);
