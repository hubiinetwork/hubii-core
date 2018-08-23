import { injectGlobal } from 'styled-components';
import Bold from '../public/fonts/SF-UI-Text-Bold.otf';
import BoldItalic from '../public/fonts/SF-UI-Text-BoldItalic.otf';
import HeavyItalic from '../public/fonts/SF-UI-Text-HeavyItalic.otf';
import Medium from '../public/fonts/SF-UI-Text-Medium.otf';
import MediumItalic from '../public/fonts/SF-UI-Text-MediumItalic.otf';
import Regular from '../public/fonts/SF-UI-Text-Regular.otf';
import RegularItalic from '../public/fonts/SF-UI-Text-RegularItalic.otf';
import Light from '../public/fonts/SF-UI-Text-Light.otf';
import Semibold from '../public/fonts/SF-UI-Text-Semibold.otf';
import SemiboldItalic from '../public/fonts/SF-UI-Text-SemiboldItalic.otf';
import Ultrathin from '../public/fonts/SF-UI-Text-Ultrathin.otf';
import UltrathinItalic from '../public/fonts/SF-UI-Text-UltrathinItalic.otf';
import darkTheme from './themes/darkTheme';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  /** Bold */
  @font-face {
    font-family: "SF Text";
    font-weight: 700;
    src: url(${Bold});
  }

  /** Bold Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 700;
    font-style: italic;
    src: url(${BoldItalic});
  }

  /** Heavy */
  @font-face {
    font-family: "SF Text";
    font-weight: 800;
    src: url(${Bold});
  }

  /** Heavy Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 800;
    font-style: italic;
    src: url(${HeavyItalic});
  }

  /** Light */
  @font-face {
    font-family: "SF Text";
    font-weight: 200;
    src: url(${Light});
  }

  /** Light Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 200;
    font-style: italic;
    src: url(${HeavyItalic});
  }

  /** Medium */
  @font-face {
    font-family: "SF Text";
    font-weight: 500;
    src: url(${Medium});
  }

  /** Medium Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 500;
    font-style: italic;
    src: url(${MediumItalic});
  }

  /** Regular */
  @font-face {
    font-family: "SF Text";
    font-weight: 400;
    src: url(${Regular});
  }

  /** Regular Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 400;
    font-style: italic;
    src: url(${RegularItalic});
  }

  /** Semibold */
  @font-face {
    font-family: "SF Text";
    font-weight: 600;
    src: url(${Semibold});
  }

  /** Semibold Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 600;
    font-style: italic;
    src: url(${SemiboldItalic});
  }

  /** Ultrathin */
  @font-face {
    font-family: "SF Text";
    font-weight: 100;
    src: url(${Ultrathin});
  }

  /** Ultrathin Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 100;
    font-style: italic;
    src: url(${UltrathinItalic});
  }
  
  .ant-tooltip {
    display: none;
  }

  html * {
    font-family: "SF Text";
  }

  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
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


  /* Custom antd Pagination styles */
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

  /* Custom antd notification styles */
  .ant-notification-notice-with-icon {
    display: flex;
    align-items: center;
  }
}
`;
