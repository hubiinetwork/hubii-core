// ****** white ****** //

const white = 'pink';

// ****** teal ****** //

const teal = 'white';
const tealDark = 'wheat';
const tealLight = 'whitesmoke';
const tealLighter = 'antiquewhite';
const tealDarker = 'floralwhite';
const teal50 = 'rgba(47,77,92,.5)';

// ****** seaGreen ****** //

const seaGreen = 'tomato';
const seaGreenLight = 'rgba(80,227,194,.05)';
const seaGreen50 = 'rgba(80,227,194,.5)';

// ****** grey ****** //

const grey = 'blueviolet';
const greyLight = 'cadetblue';
const greyDark = 'darkslateblue';
const greyDarker = 'dodgerblue';
const grey50 = 'steelblue';

// ****** black ****** //

const black = 'mintcream';
const black50 = 'aliceblue';
const blackLight = 'darkolivegreen';
const blackLighter = 'darkblue';

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

    secondary: grey,
    secondary1: greyLight,
    secondary2: greyDark,
    secondary3: greyDarker,
    secondary4: grey50,

    dark: black,
    dark1: blackLight,
    dark2: blackLighter,
    dark3: black50,

    light: white,

    info: seaGreen,
    info1: seaGreenLight,
    info2: seaGreen50,
  },
  transferDescription: {
    titleTextColor: seaGreen,
    recipientTextColor: white,
    headingTextColor: grey,
    balanceTextColor: seaGreen,
    list: {
      labelTextColor: white,
      valueTextColor: greyLight,
    },
  },
  walletItemCard: {
    iconColor: greyLight,
    balanceTextColor: seaGreen,
    backgroundColor: tealDarker,
    shadow: shadowLight,
    hover: {
      IconColor: seaGreen,
      backgroundColor: tealLighter,
    },
    menu: {
      backgroundColor: tealDark,
      item: {
        textColor: greyLight,
        hover: {
          backgroundColor: seaGreen,
          textColor: tealDark,
        },
        divider: {
          color: greyLight,
        },
      },
    },
  },
  walletHeader: {
    iconColor: white,
    iconBackgroundColor: teal,
    addressTextColor: grey,
    balanceTextColor: seaGreen,
    backgroundColor: tealDarker,
    hover: {
      iconColor: teal,
      iconBackgroundColor: seaGreen,
    },
  },
  walletTabs: {
    backgroundColor: tealLight,
    layout: {
      backgroundColor: tealDark,
      headingTextColor: white,
    },
    header: {
      backgroundColor: tealDarker,
    },
  },
  settingsHeader: {
    textColor: white,
    background: tealDark,
    headerBackground: tealLighter,
  },
  themeSwitcher: {
    iconBackground: seaGreenLight,
    fillColor: white,
    iconBorderColor: seaGreen,
    hover: {
      fillColor: white,
      background: seaGreen,
    },
    iconChecked: {
      fillColor: white,
      background: seaGreen,
      hover: {
        background: seaGreen,
      },
    },
  },
};
