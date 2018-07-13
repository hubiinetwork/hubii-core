
const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

const showDevTools = process.env.DEV_TOOLS;

let mainWindow;

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

  mainWindow = new BrowserWindow({ width: 1200, height: 680 });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../index.html')}`);
  if (showDevTools || isDev) {
    // Need to require this globally so we can keep it as a
    // dev-only dependency
    mainWindow.webContents.openDevTools();
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

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
