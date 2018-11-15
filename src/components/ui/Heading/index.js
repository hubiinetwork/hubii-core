import styled from 'styled-components';

// defaults to 20px equivilent, large prop ups to 24px equivilent
export default styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.palette.light};
  font-size: ${({ large }) => large ? '1.72rem' : '1.43rem'};
`;
