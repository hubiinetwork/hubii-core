import React from 'react';
import styled from 'styled-components';
import NahmiiLight from '../../../../public/images/nahmii-light.svg';

const StyledImg = styled.img`
  height: ${({ large }) => large ? '1.35' : '1.15'}rem;
  padding-bottom: ${({ large }) => large ? '0.35' : '0.21'}rem;
`;

export default (props) => <StyledImg {...props} src={NahmiiLight} alt="nahmii logo" />;
