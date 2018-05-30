import { Icon } from 'antd';
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
      ${props =>
        props.connected
          ? props.theme.palette.success
          : props.theme.palette.danger};
  }
`;

export const USB = styled(Icon)`
  position: absolute;
  font-size: 16px;
  top: 4px;
  left: 3px;
  font-weight: bolder;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
`;
