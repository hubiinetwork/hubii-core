import styled from 'styled-components';
import { Icon } from 'antd';

export const StyledIcon = styled(Icon)`
&&& {
  ${({ theme }) => `
    color: ${theme.palette.secondary7};
    :hover {
      cursor: pointer;
      color: ${theme.palette.light};
      font-size: 1.4rem;
    }
  `}
  transition: all 0.3s ease;
  font-size: 1.15rem;
}
`;
