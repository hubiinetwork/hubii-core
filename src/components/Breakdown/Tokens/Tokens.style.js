import styled from 'styled-components';
export const Logo = styled.img`
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin-right: 7px;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
`;

export const Percentage = styled.div`
  color: ${({ theme }) => theme.palette.info};
  margin-left: 4px;
`;

export const FlexContainer = styled.div`
  display: flex;
  margin-top: -12px;
  flex-wrap: wrap;
`;

export const FlexItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  width: 133px;
`;
