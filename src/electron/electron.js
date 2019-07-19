
/* global mainWindow */
import { initSplashScreen } from '@trodi/electron-splashscreen';
import { app, Menu, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import isDev from 'electron-is-dev';
import { registerWalletListeners } from './wallets';
import setupDevToolsShortcut from './dev-tools';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('electron-reload')(__dirname, {
    electron: path.join(`${__dirname}/../../`, 'node_modules', '.bin', 'electron'),
  });
}

const version = app.getVersion();

function createWindow() {
  const template = [
    {
      label: 'Application',
      submenu: [
        { label: `Version: ${version}`, enabled: false },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click() { app.quit(); } },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  const windowOptions = {
    width: 1250,
    height: 780,
    show: false,
    icon: process.platform === 'linux' && path.join(__dirname, '../icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  };
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: windowOptions.width,
    defaultHeight: windowOptions.height,
    fullScreen: false,
    maximize: false,
  });

  global.mainWindow = initSplashScreen({
    windowOpts: { ...windowOptions, ...mainWindowState },
    templateUrl: path.join(__dirname, '../public/images/splashscreen.svg'),
    delay: 0,
    splashScreenOpts: {
      height: 340,
      width: 340,
      transparent: true,
    },
  });

  mainWindowState.manage(mainWindow);

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

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', (err) => {
    log.error('auto updater:', err);
  });

  autoUpdater.checkForUpdatesAndNotify();

  ipcMain.on('install-new-release', () => {
    autoUpdater.quitAndInstall();
  });
}

const shouldQuit = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
} else {
  app.on('ready', () => {
    createWindow();
    setupAutoUpdater();
    setupDevToolsShortcut();
  });
}


app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

process.on('unhandledRejection', (err) => {
  log.error(err);
});
process.on('uncaughtException', (err) => {
  log.error(err);
});
