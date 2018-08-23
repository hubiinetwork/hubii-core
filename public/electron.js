
/* global mainWindow */
const { initSplashScreen } = require('@trodi/electron-splashscreen');
const { app, Menu, dialog } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = require('electron-is-dev');
const { registerWalletListeners } = require('./wallets');
const setupDevToolsShortcut = require('./dev-tools');

function createWindow() {
  const template = [{
    label: 'Application',
    submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click() { app.quit(); } },
    ] }, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
      ] },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  const windowOptions = {
    width: 1200,
    height: 680,
    show: false,
    icon: process.platform === 'linux' && path.join(__dirname, '../icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  };
  global.mainWindow = initSplashScreen({
    windowOpts: windowOptions,
    templateUrl: path.join(__dirname, 'images/splashscreen.svg'),
    delay: 0,
    splashScreenOpts: {
      height: 340,
      width: 340,
      transparent: true,
    },
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../index.html')}`);
  if (isDev) {
    mainWindow.webContents.openDevTools();
    // Need to require this globally so we can keep it as a
    // dev-only dependency
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer'); // eslint-disable-line global-require
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach((extension) => {
      installExtension(extension)
      .then()
      .catch((err) => console.error(`An error occurred loading extension ${name}: `, err)); // eslint-disable-line no-console
    });
  }
  mainWindow.once('show', () => {
    registerWalletListeners(mainWindow);
  });
  mainWindow.on('closed', () => {
    app.quit();
  });
  return mainWindow;
}

function setupAutoUpdater() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded.',
    };

    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (err) => {
    log.error('auto updater:', err);
  });
  autoUpdater.checkForUpdatesAndNotify();
}

app.on('ready', () => {
  createWindow();
  setupAutoUpdater();
  setupDevToolsShortcut();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
