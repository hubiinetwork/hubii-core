const { BrowserWindow } = require('electron');
const localShortcut = require('electron-localshortcut');

const isMacOS = process.platform === 'darwin';

function toggleDevTools(win = BrowserWindow.getFocusedWindow()) {
  if (win) {
    const { webContents } = win;
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools();
    } else {
      webContents.openDevTools();
    }
  }
}

module.exports = function () {
  localShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', toggleDevTools);
};
