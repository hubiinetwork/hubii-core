import styled from 'styled-components';
import { Icon } from 'antd';

export const HomeIcon = styled(Icon)`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.71rem;
  transition: all 0.3s ease-in-out;
`;

export const StyledLink = styled.div`
  width: 5.14rem;
  background-color: ${({ theme }) => theme.palette.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.info};
    .icon-home {
      color: ${({ theme }) => theme.palette.primary};
    }
  }
`;
