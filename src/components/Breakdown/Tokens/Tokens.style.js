import styled from 'styled-components';
export const Logo = styled.img`
  border-radius: 50%;
  height: 24px;
  width: 24px;
  margin-right: 7px;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.palette.light};
`;

export const Percentage = styled.div`
  color: ${({ theme }) => theme.palette.info};
  margin-left: 4px;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const FlexItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  width: 133px;
`;
