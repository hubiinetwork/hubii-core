import { injectGlobal } from 'styled-components';
import { getAbsolutePath } from 'utils/electron';
import darkTheme from './themes/darkTheme';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  @import url(${getAbsolutePath('public/fonts/Open_Sans/index.css')});

  .ant-tooltip {
    display: none;
  }

  html * {
    font-family: "Open Sans";
  }

  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-weight: 500;
  }

  body {
    letter-spacing: 0.06rem;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }

  .ant-tooltip {
    display: none;
  }
  .ant-popover-inner,
  .ant-popover-arrow {
    background-color: ${darkTheme.palette.primary1};
  }
  .ant-popover-inner{
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.27);
  }

  .ant-pagination-item-link:hover,
  .ant-pagination-next:focus,
  .ant-pagination-next:hover,
  .ant-pagination-prev:focus,
  .ant-pagination-item-active:focus, 
  .ant-pagination-item-active:hover,
  .ant-pagination-item-active {
    border-color: ${darkTheme.palette.info} !important;
    background: transparent;
    color: ${darkTheme.palette.info} !important;
  }

  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    :focus:after, :hover:after {
      color: ${darkTheme.palette.info};
    }
  }

  .ant-pagination-item-link,
  .ant-pagination-item:hover,
  .ant-pagination-item:focus,
  .ant-pagination-item {
    background: transparent !important;
  }

  .ant-pagination-item {
    :hover, :focus {
      border-color: ${darkTheme.palette.info} !important;
      a {
        color: ${darkTheme.palette.info} !important;
      }
    }
  }

  .ant-pagination-item-link {
    border: none !important;
    :hover::after {
      color: ${darkTheme.palette.info} !important;
    }

  }

  .ant-pagination-item>a,
  .ant-pagination-item-link::after {
    color: ${darkTheme.palette.light};
  }

}
`;
