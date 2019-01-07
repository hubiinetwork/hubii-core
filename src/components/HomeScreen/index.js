/**
 *
 * HomeScreen
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import DashboardCard from 'components/DashboardCard';
import { injectIntl } from 'react-intl';

import { getAbsolutePath } from 'utils/electron';
import StyledLink from './StyledLink';
import Wrapper from './Wrapper';
import Logo from './Logo';
import Cards from './Cards';


class HomeScreen extends React.PureComponent {
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Wrapper>
        <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
        <Cards>
          <StyledLink to="/wallets">
            <DashboardCard
              iconSrc={getAbsolutePath('public/images/wallet-icon-green.png')}
              title={formatMessage({ id: 'my_wallets' })}
            />
          </StyledLink>
          <StyledLink to="/nahmii/airdriip-registration">
            <DashboardCard
              iconSrc={getAbsolutePath('public/images/nahmii-token-green.png')}
              title={formatMessage({ id: 'my_nahmii' })}
            />
          </StyledLink>
          <StyledLink to="/dex/trading">
            <DashboardCard
              iconSrc={getAbsolutePath('public/images/dex-icon-green.png')}
              title={formatMessage({ id: 'exchange' })}
            />
          </StyledLink>
          <StyledLink to="/settings">
            <DashboardCard
              iconType="setting"
              title={formatMessage({ id: 'settings' })}
            />
          </StyledLink>
        </Cards>
      </Wrapper>
    );
  }
}

HomeScreen.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(HomeScreen);
