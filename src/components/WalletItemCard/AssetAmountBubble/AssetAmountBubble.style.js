import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.light};
  background-color: ${({ theme }) => theme.palette.secondary2};
  height: 24px;
  line-height: 22px;
  min-width: 80px;
  padding: 0 10px 0 2px;
  font-size: 13px;
  border-radius: 15px;
`;

export const Span = styled.span`
  display: flex;
  margin-left: 6px;
`;

export const Image = styled.img`
  height: 21px;
  width: 21px;
`;
