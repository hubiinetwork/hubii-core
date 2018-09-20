import styled from 'styled-components';

export default styled.h2`
  font-weight: 400;
  margin: 0;
  color: ${({ theme }) => theme.palette.light};
  font-size: ${({ large }) => large ? '1.6rem' : '1.29rem'};
`;
