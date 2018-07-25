import path from 'path';

export function getAbsolutePath(relativePath) {
  // eslint-disable-next-line global-require
  const rootPath = process.env.NODE_ENV === 'production' ? path.join(require('electron').remote.app.getAppPath(), 'build') : '/';
  if (process.env.NODE_ENV === 'test') {
    return path.posix.join(rootPath, relativePath);
  }
  return path.join(rootPath, relativePath);
}
