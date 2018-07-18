// ****** white ****** //

const white = '#ffffff';
const dullWhite = '#E1E7EB';
const paleBlue = '#C0CDD3';

// ****** teal ****** //

const teal = '#3b6174';
const tealBlue = '#1D6E96';
const tealDark = '#263c46';
const tealLight = '#26404d';
const tealLighter = '#395664';
const tealDarker = '#2f4d5c';
const teal50 = 'rgba(47,77,92,.5)';

// ****** seaGreen ****** //

const seaGreen = '#3df5cd';
const seaGreenLight = 'rgba(80,227,194,.05)';
const seaGreenDark = '#50e3c2';
const seaGreen50 = 'rgba(80,227,194,.5)';

// ****** grey ****** //

const grey = 'rgba(255,255,255,0.5)';
const greyDim = 'rgba(255,255,255,0.3)';
const greyLight = '#C0CDD3';
const greyDark = '#43616F';
const greyDarker = '#445f6c';
const grey50 = 'rgba(140,165,177,.5)';
const grey8C = '#8CA5B1';
const grey6F = '#43616F';
const grey40 = '#406171';
const grey58 = '#587786';
const grey2D = '#2D444F';

// ****** black ****** //

const black = '#122a2b';
const black50 = 'rgba(36, 59, 71, 0.5)';
const blackLight = '#26404d';
const blackLighter = '#404f56';

// ****** green ****** //

const green = '#78B214';
const greenLight = 'rgba(173, 255, 47, 0.5)';

// ****** yellow ****** //

const yellow = '#F5A623';

// ****** red ****** //

const red = 'tomato';

// ****** shadows ****** //

const shadowLight = '0 2px 5px 0 rgba(0, 0, 0, 0.15)';
const shadowDark = '0 3px 7.5px 0 rgba(0, 0, 0, 0.15)';

export default {
  iconColor: '',
  mode: 'dark',
  color: 'red',
  shadows: {
    light: shadowLight,
    dark: shadowDark,
  },
  palette: {
    primary: teal,
    primary1: tealLight,
    primary2: tealLighter,
    primary3: tealDark,
    primary4: tealDarker,
    primary5: teal50,
    primary6: tealBlue,

    secondary: grey,
    secondary1: greyLight,
    secondary2: greyDark,
    secondary3: greyDarker,
    secondary4: grey50,
    secondary5: greyDim,
    secondary6: grey8C,
    secondary7: grey6F,
    secondary8: grey40,
    secondary9: grey58,
    secondary10: grey2D,

    dark: black,
    dark1: blackLight,
    dark2: blackLighter,
    dark3: black50,

    light: white,
    light1: dullWhite,
    light2: paleBlue,

    info: seaGreen,
    info1: seaGreenLight,
    info2: seaGreen50,
    info3: seaGreenDark,

    success: green,
    success1: greenLight,
    warning: yellow,
    danger: red,
  },
};
