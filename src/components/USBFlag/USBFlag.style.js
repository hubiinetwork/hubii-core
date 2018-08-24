import styled from 'styled-components';

export const Slanted = styled.div`
  position: relative;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: -4.43rem;
    width: 0;
    height: 0;
    border-right: 7.14rem solid transparent;
    border-top: 7.14rem solid
      ${(props) =>
        props.connected ? props.theme.palette.info : props.theme.palette.info};
  }
  transform: translateZ(0px); /* fix overflow when spinner icon */
  -webkit-transform: translateZ(0px); 
`;

export const USB = styled.img`
  position: absolute;
  width: 0.79rem;
  height: 1.14rem;
  top: 0.43rem;
  left: 0.43rem;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
`;
