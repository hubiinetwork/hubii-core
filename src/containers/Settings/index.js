import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
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

import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { translationMessages } from '../../i18n';

import {
  Wrapper,
  SettingWrapper,
  Body,
  StyledSectionHeading,
} from './style';

export class Settings extends React.PureComponent {

  render() {
    const { locale, onChangeNetwork, onChangeLocale, currentNetwork, supportedNetworks, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <Wrapper>
        <TopHeader>
          <Heading>{formatMessage({ id: 'settings' })}</Heading>
        </TopHeader>
        <Body>
          <SettingWrapper>
            <StyledSectionHeading>
              {formatMessage({ id: 'setting_network' })}
            </StyledSectionHeading>
            <Select
              value={currentNetwork.provider.name}
              style={{ width: '15rem' }}
              onChange={onChangeNetwork}
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
              {formatMessage({ id: 'setting_language' })}
            </StyledSectionHeading>
            <Select
              value={locale}
              style={{ width: '15rem' }}
              onChange={onChangeLocale}
            >
              {
                Object.keys(translationMessages).map((localeKey) => (
                  <Option value={localeKey} key={localeKey}>
                    {translationMessages[localeKey].language}
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
  locale: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentNetwork: makeSelectCurrentNetwork(),
  supportedNetworks: makeSelectSupportedNetworks(),
  locale: makeSelectLocale(),
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

export default compose(withConnect, injectIntl)(Settings);
