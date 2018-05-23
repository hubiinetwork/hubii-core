import styled from 'styled-components';

export const FlexWrapper = styled.div`
  display: flex;
`;

export const ImageWrapper = styled.div`
  margin-right: 10px;
`;

export const Image = styled.img`
  width: 37px;
  height: 37px;
`;

export const DetailWrapper = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
  margin-top: -3px;
`;

export const BalanceColor = styled.div`
  color: ${({ info, theme }) =>
    info ? theme.palette.info : theme.palette.light};
  margin-right: 6px;
`;
