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
    props.active ? props.theme.palette.info : props.theme.palette.secondary6};
  }
  transform: translateZ(0px); /* fix overflow when spinner icon */
  -webkit-transform: translateZ(0px); 
`;

export const Icon = styled.img`
  position: absolute;
  max-width: 1.14rem;
  max-height: 1.14rem;
  top: ${({ walletType }) => walletType === 'hardware' ? '0.43' : '0.3'}rem;;
  left: ${({ walletType }) => walletType === 'hardware' ? '0.43' : '0.2'}rem;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
`;
