import styled from 'styled-components';

export const FlexWrapper = styled.div`
  display: flex;
`;

export const ImageWrapper = styled.div`
  margin-right: 10px;
  align-self: center;
  position: relative;
`;

export const Caret = styled.div`
  width: 0px;
  height: 0px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid white;
  transform: rotate(45deg);
  position: absolute;
  bottom: -3px;
  right: -1px;
`;

export const Image = styled.img`
  width: 32px;
  height: 32px;
`;

export const DetailWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const BalanceColor = styled.div`
  color: ${({ info, theme }) =>
    info ? theme.palette.info : theme.palette.light};
  margin-right: 6px;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
`;
