import { BrowserWindow } from 'electron';
import localShortcut from 'electron-localshortcut';

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

export default function setupShortcut() {
  localShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', toggleDevTools);
}
