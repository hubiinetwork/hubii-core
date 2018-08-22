import { injectGlobal } from 'styled-components';
import darkTheme from './themes/darkTheme';

import BoldWoff from '../public/fonts/opensans/Bold/OpenSans-Bold.woff';
import BoldWoff2 from '../public/fonts/opensans/Bold/OpenSans-Bold.woff2';
import RegularWoff from '../public/fonts/opensans/Regular/OpenSans-Regular.woff';
import RegularWoff2 from '../public/fonts/opensans/Regular/OpenSans-Regular.woff2';
import LightWoff from '../public/fonts/opensans/Light/OpenSans-Light.woff';
import LightWoff2 from '../public/fonts/opensans/Light/OpenSans-Light.woff2';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  /** Bold */
  @font-face {
    font-family: "OpenSans";
    font-weight: 700;
    src: url("${BoldWoff2}?v=1.101") format("woff2"), url("${BoldWoff}?v=1.101") format("woff");
    font-style: normal;
  }

  // /** Regular */
  @font-face {
    font-family: "OpenSans";
    font-weight: 500;
    src: url("${RegularWoff2}?v=1.101") format("woff2"), url("${RegularWoff}?v=1.101") format("woff");
    font-style: normal;
  }

  // /** Light */
  @font-face {
    font-family: "OpenSans";
    font-weight: 400;
    src: url("${LightWoff2}?v=1.101") format("woff2"), url("${LightWoff}?v=1.101") format("woff");
    font-style: normal;
  }

  @font-face {
    font-family: "OpenSans";
    font-weight: 300;
    src: url("${LightWoff2}?v=1.101") format("woff2"), url("${LightWoff}?v=1.101") format("woff");
    font-style: normal;
  }

  .ant-tooltip {
    display: none;
  }

  html * {
    font-family: "OpenSans";
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
