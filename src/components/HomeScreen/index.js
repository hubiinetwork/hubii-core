/**
 *
 * HomeScreen
 *
 */

import React from 'react';
import DashboardCard from 'components/DashboardCard';
import { StriimTextColorBlue, StriimTextColorPink } from 'components/DashboardCard/DashboardCard.style';

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
        <StyledLink to="/striim">
          <DashboardCard
            iconSrc={getAbsolutePath('public/images/striim.png')}
            title={
              <div>
                My
                <StriimTextColorBlue> str</StriimTextColorBlue>
                <StriimTextColorPink>ii</StriimTextColorPink>
                <StriimTextColorBlue>m</StriimTextColorBlue>
              </div>}
          />
        </StyledLink>
        <StyledLink to="/dex">
          <DashboardCard iconSrc={getAbsolutePath('public/images/dex-icon-green.png')} title="DEX" />
        </StyledLink>
        <StyledLink to="/settings">
          <DashboardCard iconType="setting" title="Settings" />
        </StyledLink>
      </Cards>
    </Wrapper>
  );
}

export default HomeScreen;
