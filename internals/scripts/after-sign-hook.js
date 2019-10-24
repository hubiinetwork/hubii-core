const fs = require('fs');
const path = require('path');
const electronNotarize = require('electron-notarize');

async function notarize(params) {
  // Only notarize the app on Mac OS only.
  if (params.electronPlatformName !== 'darwin') {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('afterSign hook triggered', params);

  // Same appId in electron-builder.
  const appId = process.env.npm_package_build_appId;

  const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  // eslint-disable-next-line no-console
  console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    await electronNotarize.notarize({
      appBundleId: appId,
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
    });
  } catch (error) {
    console.error(error);
  }

  // eslint-disable-next-line no-console
  console.log(`Done notarizing ${appId}`);
}

module.exports = notarize;
