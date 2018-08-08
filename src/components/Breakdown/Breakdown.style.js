import styled from 'styled-components';

export const TotalAmount = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.43rem;
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.palette.light};
  font-weight: 500;
  font-size: 1rem;
  margin-top: 0.21rem;
  line-height: 1.14rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
