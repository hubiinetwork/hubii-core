import styled from 'styled-components';

export const Label = styled.span`
  color: ${({ theme }) => theme.palette.light};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`;

export const Value = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  text-align: right;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
