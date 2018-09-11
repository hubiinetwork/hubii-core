import { webFrame } from 'electron';
import { protocolNames } from './handlers';

if (webFrame) {
  protocolNames.forEach((name) => {
    const PROTOCOL_NAME = name;
    webFrame.registerURLSchemeAsPrivileged(PROTOCOL_NAME);
  });
}
