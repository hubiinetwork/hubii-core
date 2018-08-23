import { Button } from 'antd';
import styled from 'styled-components';

export default styled(Button)`
&&& {
  ${(props) => props.disabled ? `
    pointer-events: none;
    background-color: transparent;
    border-color: ${props.theme.palette.secondary4};
    color: ${props.theme.palette.secondary4};
  ` : null}
}
  height: 2.71rem;
  font-size: 0.86rem;
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
    return '';
  }};
`;
