import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  /** Bold */
  @font-face {
    font-family: "SF Text";
    font-weight: 700;
    src: url("/public/fonts/SF-UI-Text-Bold.otf");
  }

  /** Bold Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 700;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-BoldItalic.otf");
  }

  /** Heavy */
  @font-face {
    font-family: "SF Text";
    font-weight: 800;
    src: url("/public/fonts/SF-UI-Text-Heavy.otf");
  }

  /** Heavy Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 800;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-HeavyItalic.otf");
  }

  /** Light */
  @font-face {
    font-family: "SF Text";
    font-weight: 200;
    src: url("/public/fonts/SF-UI-Text-Light.otf");
  }

  /** Light Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 200;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-HeavyItalic.otf");
  }

  /** Medium */
  @font-face {
    font-family: "SF Text";
    font-weight: 500;
    src: url("/public/fonts/SF-UI-Text-Medium.otf");
  }

  /** Medium Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 500;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-MediumItalic.otf");
  }

  /** Regular */
  @font-face {
    font-family: "SF Text";
    font-weight: 400;
    src: url("/public/fonts/SF-UI-Text-Regular.otf");
  }

  /** Regular Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 400;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-RegularItalic.otf");
  }

  /** Semibold */
  @font-face {
    font-family: "SF Text";
    font-weight: 600;
    src: url("/public/fonts/SF-UI-Text-Semibold.otf");
  }

  /** Semibold Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 600;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-SemiboldItalic.otf");
  }

  /** Ultrathin */
  @font-face {
    font-family: "SF Text";
    font-weight: 100;
    src: url("/public/fonts/SF-UI-Text-Ultrathin.otf");
  }

  /** Ultrathin Italic */
  @font-face {
    font-family: "SF Text";
    font-weight: 100;
    font-style: italic;
    src: url("/public/fonts/SF-UI-Text-UltrathinItalic.otf");
  }

  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: "SF Text";
  }

  body {
    font-family: 'Nunito', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    letter-spacing: 0.06rem;
  }

  body.fontLoaded {
    font-family: 'Nunito', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;
