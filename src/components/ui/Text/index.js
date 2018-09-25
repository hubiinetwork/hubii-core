import styled from 'styled-components';

// defaults to 14px equivilent. 'large' means 16px equivilent is used instead.
export default styled.span`
  line-height: 1.6;
  font-size: ${({ large }) => large ? '1.15' : '1'}rem;
`;
