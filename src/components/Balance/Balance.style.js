import styled from 'styled-components';

export const FlexWrapper = styled.div`
  display: flex;
`;

export const ImageWrapper = styled.div`
  margin-right: 0.71rem;
  align-self: center;
  position: relative;
`;

export const Caret = styled.div`
  width: 0rem;
  height: 0rem;
  border-top: 0.36rem solid transparent;
  border-bottom: 0.36rem solid transparent;
  border-left: 0.36rem solid white;
  transform: rotate(45deg);
  position: absolute;
  bottom: -0.21rem;
  right: -0.07rem;
`;

export const Image = styled.img`
  width: 2.29rem;
  height: 2.29rem;
`;

export const DetailWrapper = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.14rem;
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const BalanceColor = styled.div`
  color: ${({ info, theme }) =>
    info ? theme.palette.info : theme.palette.light};
  margin-right: 0.43rem;
  font-size: 1.14rem;
  font-weight: 400;
  line-height: 1.14rem;
`;
