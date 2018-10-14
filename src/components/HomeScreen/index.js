/**
 *
 * HomeScreen
 *
 */

import React from 'react';
import DashboardCard from 'components/DashboardCard';
import { injectIntl } from 'react-intl';

import { getAbsolutePath } from 'utils/electron';
import StyledLink from './StyledLink';
import Wrapper from './Wrapper';
import Logo from './Logo';
import Cards from './Cards';

class HomeScreen extends React.PureComponent {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Wrapper>
        <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
        <Cards>
          <StyledLink to="/wallets">
            <DashboardCard iconSrc={getAbsolutePath('public/images/wallet-icon-green.png')} title={formatMessage({id: 'my_wallets'})} />
          </StyledLink>
          <StyledLink to="/dex">
            <DashboardCard iconSrc={getAbsolutePath('public/images/dex-icon-green.png')} title={formatMessage({id: 'DEX'})} />
          </StyledLink>
        </Cards>
      </Wrapper>
    );
  }
}

export default injectIntl(HomeScreen);
