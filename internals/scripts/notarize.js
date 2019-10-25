#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const electronNotarize = require('electron-notarize');

(async () => {
  // Same appId in electron-builder.
  const appId = process.env.npm_package_build_appId;

  const appPath = path.join(process.cwd(), 'dist/mac', `${process.env.npm_package_name}.app`);
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

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

  console.log(`Done notarizing ${appId}`);
})();
