import styled from 'styled-components';

export const SpaceBetween = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const TextDiv = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  margin-top: 32px;
  margin-bottom: 12px;
`;
