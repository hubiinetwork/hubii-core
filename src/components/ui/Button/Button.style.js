import { Button } from 'antd';
import styled from 'styled-components';

export default styled(Button)`
  height: 38px;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 400;
  border-radius: 0.3rem;
  ${({ theme, type }) => {
    if (type === 'primary') {
      return `
        color: ${theme.palette.light};
        border-color: ${theme.palette.info3};
        background: transparent;
        &:hover {
          color: ${theme.palette.light};
          background: ${theme.palette.info2} !important;
          border-color: ${theme.palette.info3} !important;
        }
        &:focus {
          color: ${theme.palette.light};
          border-color: ${theme.palette.info3};
          background-color: ${theme.palette.info2};
        }`;
    }
  }};
`;
