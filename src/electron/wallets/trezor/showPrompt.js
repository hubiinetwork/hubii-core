import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs'

export default function showPrompt(event) {
  return new Promise((resolve, reject) => {
    const pinTemplate = fs.readFileSync(path.resolve(__dirname, `${event}.html`), 'utf8');
    const scriptNonce = Math.floor(Math.random() * 1000000000000);
    const html = pinTemplate
      .replace(/\$scriptNonce/g, scriptNonce.toString())
      .replace(/\$EVENT/g, event);

    let hasResolved = false;

    const window = new BrowserWindow({
      width: 320,
      height: 380,
      frame: false,
      backgroundColor: '#21252B',
      darkTheme: true,
    });

    window.on('closed', () => {
      if (hasResolved) {
        return;
      }
      reject(new Error('TREZOR_CANCELED'));
    });

    ipcMain.once(event, (_, value) => {
      try {
        resolve(value);
        hasResolved = true;
        window.close();
      } catch (e) {
        reject(e);
      }
    });

    window.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(html)}`);
    window.show();
    window.focus();
  });
};
