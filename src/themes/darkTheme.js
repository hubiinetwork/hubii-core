// ****** white ****** //

const white = '#ffffff';

// ****** teal ****** //

const teal = '#3b6174';
const tealDark = '#263c46';
const tealLight = '#26404d';
const tealLighter = '#395664';
const tealDarker = '#2f4d5c';
const teal50 = 'rgba(47,77,92,.5)';

// ****** seaGreen ****** //

const seaGreen = '#3df5cd';
const seaGreenLight = 'rgba(80,227,194,.05)';
const seaGreen50 = 'rgba(80,227,194,.5)';

// ****** grey ****** //

const grey = 'rgba(255,255,255,0.5)';
const greyDim = 'rgba(255,255,255,0.3)';
const greyLight = '#C0CDD3';
const greyDark = '#43616F';
const greyDarker = '#445f6c';
const grey50 = 'rgba(140,165,177,.5)';
const grey8C = '#8CA5B1';

// ****** black ****** //

const black = '#122b2b';
const black50 = 'rgba(36, 59, 71, 0.5)';
const blackLight = '#27404c';
const blackLighter = '#404f56';

// ****** green ****** //

const green = 'greenyellow';
const greenLight = 'rgba(173, 255, 47, 0.5)';

// ****** yellow ****** //

const orange = 'orange';

// ****** shadows ****** //

const shadowLight = '0 2px 5px 0 rgba(0, 0, 0, 0.15)';
const shadowDark = '0 3px 7.5px 0 rgba(0, 0, 0, 0.15)';

export default {
  iconColor: '',
  mode: 'dark',
  color: 'red',
  shadows: {
    light: shadowLight,
    dark: shadowDark
  },
  palette: {
    primary: teal,
    primary1: tealLight,
    primary2: tealLighter,
    primary3: tealDark,
    primary4: tealDarker,
    primary5: teal50,

    secondary: grey,
    secondary1: greyLight,
    secondary2: greyDark,
    secondary3: greyDarker,
    secondary4: grey50,
    secondary5: greyDim,
    secondary6: grey8C,

    dark: black,
    dark1: blackLight,
    dark2: blackLighter,
    dark3: black50,

    light: white,

    info: seaGreen,
    info1: seaGreenLight,
    info2: seaGreen50,

    success: green,
    success1: greenLight,
    warning: orange
  }
};
