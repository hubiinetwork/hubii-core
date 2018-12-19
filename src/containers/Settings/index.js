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

import NahmiiInfoBtn from 'containers/NahmiiInfoBtn';
import TopHeader from 'components/ui/TopHeader';
import Heading from 'components/ui/Heading';
import Select, { Option } from 'components/ui/Select';

import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { makeSelectDisclaimerModal } from 'containers/NahmiiHoc/selectors';
import {
  hideDisclaimerBtn,
  showDisclaimerBtn,
 } from 'containers/NahmiiHoc/actions';

import { translationMessages } from '../../i18n';

import {
  Wrapper,
  SettingWrapper,
  Body,
  StyledSectionHeading,
  NahmiiInfoCheckbox,
} from './style';

export class Settings extends React.PureComponent {
  constructor() {
    super();
    this.onChangeNahmiiDisclaimerBtn = this.onChangeNahmiiDisclaimerBtn.bind(this);
  }

  onChangeNahmiiDisclaimerBtn(e) {
    if (e.target.checked) {
      this.props.showDisclaimerBtn();
    } else {
      this.props.hideDisclaimerBtn();
    }
  }

  render() {
    const {
      locale,
      onChangeNetwork,
      onChangeLocale,
      currentNetwork,
      supportedNetworks,
      disclaimerModal,
      intl,
    } = this.props;
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
              value={currentNetwork.provider.network.name}
              style={{ width: '20rem' }}
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
              style={{ width: '20rem' }}
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
          <SettingWrapper>
            <StyledSectionHeading>
              nahmii info button
            </StyledSectionHeading>
            <div
              style={{ display: 'flex' }}
            >
              <NahmiiInfoCheckbox
                checked={disclaimerModal.get('showBtn')}
                onChange={this.onChangeNahmiiDisclaimerBtn}
                style={{ width: '20rem', display: 'flex' }}
              >
                Show a&nbsp;<NahmiiInfoBtn iconOnly forceIcon />&nbsp;button beside nahmii UI
            </NahmiiInfoCheckbox>
            </div>
          </SettingWrapper>
        </Body>
      </Wrapper>
    );
  }
  }

Settings.propTypes = {
  onChangeNetwork: PropTypes.func.isRequired,
  onChangeLocale: PropTypes.func.isRequired,
  showDisclaimerBtn: PropTypes.func.isRequired,
  hideDisclaimerBtn: PropTypes.func.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  supportedNetworks: ImmutablePropTypes.map.isRequired,
  locale: PropTypes.string.isRequired,
  disclaimerModal: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentNetwork: makeSelectCurrentNetwork(),
  disclaimerModal: makeSelectDisclaimerModal(),
  supportedNetworks: makeSelectSupportedNetworks(),
  locale: makeSelectLocale(),
});

export function mapDispatchToProps(dispatch) {
  return {
    hideDisclaimerBtn: () => dispatch(hideDisclaimerBtn()),
    showDisclaimerBtn: () => dispatch(showDisclaimerBtn()),
    onChangeNetwork: (...args) => dispatch(changeNetwork(...args)),
    onChangeLocale: (...args) => dispatch(changeLocale(...args)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect, injectIntl)(Settings);
