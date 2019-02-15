import { Button } from 'antd';
import styled from 'styled-components';

export default styled(Button)`
&&&& {
  height: 2.71rem;
  ${({ theme, type }) => {
    if (type === 'primary' || type === 'default' || !type) {
      return `
        color: ${theme.palette.light};
        background: transparent;
        border-color: ${theme.palette.info3};
        &:hover {
          background: ${theme.palette.info2} !important;
          border-color: ${theme.palette.info3} !important;
        }
        &:focus {
          border-color: ${theme.palette.info3};
          background-color: ${theme.palette.info2};
        }
      `;
    } return null;
  }};
  ${({ type }) => {
    if (type === 'primary') {
      return `
        border-width: 0.14rem;
      `;
    } return null;
  }};
  ${({ theme, disabled }) => {
    if (disabled) {
      return `
        pointer-events: none;
        background-color: transparent;
        border-color: ${theme.palette.secondary4};
        color: ${theme.palette.secondary4};
      `;
    } return null;
  }};
  ${({ type, theme }) => {
    if (type === 'icon') {
      return `
        text-align: center;
        color: #C0CDD3;
        background: #406171;
        border-color: #406171;
        width: 24px;
        padding-left: 0;
        padding-right: 0;
        font-size: 14px;
        border-radius: 50%;
        height: 24px;
        &:hover {
          color: ${theme.palette.info};
        }
      `;
    } return null;
  }};
}`;
