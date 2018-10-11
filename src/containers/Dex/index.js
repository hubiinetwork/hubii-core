import * as React from 'react';
import { getAbsolutePath } from 'utils/electron';

import Heading from 'components/ui/Heading';

import {
  Wrapper,
  TopHeader,
  Title,
  Container,
  Logo,
} from './index.style';

export const Dex = () => (
  <Wrapper>
    <TopHeader>
      <Heading>Exchange</Heading>
    </TopHeader>
    <Container>
      <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
      <Title>
        DEX coming soon
      </Title>
    </Container>
  </Wrapper>
    );

export default Dex;
