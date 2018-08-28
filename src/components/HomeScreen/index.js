/**
 *
 * HomeScreen
 *
 */

import React from 'react';
import DashboardCard from 'components/DashboardCard';

import { getAbsolutePath } from 'utils/electron';
import StyledLink from './StyledLink';
import Wrapper from './Wrapper';
import Logo from './Logo';
import Cards from './Cards';
function HomeScreen() {
  return (
    <Wrapper>
      <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
      <Cards>
        <StyledLink to="/wallets">
          <DashboardCard iconSrc={getAbsolutePath('public/images/wallet-icon-green.png')} title="My wallets" />
        </StyledLink>
        <StyledLink to="/dex">
          <DashboardCard iconSrc={getAbsolutePath('public/images/dex-icon-green.png')} title="DEX" />
        </StyledLink>
      </Cards>
    </Wrapper>
  );
}

export default HomeScreen;
