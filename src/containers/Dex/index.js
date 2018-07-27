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
      <Title>
        Coming soon to Hubii Core...
      </Title>
      <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
    </Container>
  </Wrapper>
    );

Dex.propTypes = {

};

export default Dex;
