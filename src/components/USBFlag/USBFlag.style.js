import styled from 'styled-components';

export const Slanted = styled.div`
  position: relative;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: -62px;
    width: 0;
    height: 0;
    border-right: 100px solid transparent;
    border-top: 100px solid
      ${(props) =>
        props.connected ? props.theme.palette.info : props.theme.palette.info};
  }
`;

export const USB = styled.img`
  position: absolute;
  width: 11px;
  height: 16px;
  top: 6px;
  left: 6px;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
`;
