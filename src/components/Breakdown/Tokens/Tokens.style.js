import styled from 'styled-components';
export const Logo = styled.img`
  border-radius: 50%;
  height: 1.14rem;
  width: 1.14rem;
  margin-right: 0.5rem;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
`;

export const Percentage = styled.div`
  color: ${({ theme }) => theme.palette.info};
  margin-left: 0.29rem;
`;

export const FlexContainer = styled.div`
  display: flex;
  margin-top: -0.86rem;
  flex-wrap: wrap;
`;

export const FlexItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.57rem;
  width: 9.5rem;
`;
