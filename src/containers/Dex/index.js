import * as React from 'react';
// import PropTypes from 'prop-types';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
import { getAbsolutePath } from 'utils/electron';

import {
  Wrapper,
  TopHeader,
  Heading,
  Title,
  Container,
} from './index.style';

import Logo from './Logo';

export const Dex = () => (
  <Wrapper>
    <TopHeader>
      <Heading>Dex</Heading>
    </TopHeader>
    <Container>
      <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
      <Title>
        DEX Coming Soon.
      </Title>
    </Container>
  </Wrapper>
    );

Dex.propTypes = {

};

export default Dex;
