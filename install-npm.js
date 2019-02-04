'use strict';

const xcode = require('appium-xcode');
const path = require('path');
const log = require('fancy-log');
const { exec } = require('teen_process');
const { fs } = require('appium-support');
const { asyncify } = require('asyncbox');


const rootDir = process.env.NO_PRECOMPILE ? path.resolve(__dirname) : path.resolve(__dirname, '..');

const relative = {
  iphoneos: 'build/Release-iphoneos/TestApp-iphoneos.app',
  iphonesimulator: 'build/Release-iphonesimulator/TestApp-iphonesimulator.app'
};

const absolute = {
  iphoneos: path.resolve(rootDir, 'build', 'Release-iphoneos', 'TestApp-iphoneos.app'),
  iphonesimulator: path.resolve(rootDir, 'build', 'Release-iphonesimulator', 'TestApp-iphonesimulator.app')
};

const appList = [
  relative.iphoneos,
  relative.iphonesimulator
];

const SDKS = {
  iphonesimulator: {
    name: 'iphonesimulator',
    buildPath: path.resolve('build', 'Release-iphonesimulator', 'TestApp.app'),
    finalPath: relative.iphonesimulator
  },
  iphoneos: {
    name: 'iphoneos',
    buildPath: path.resolve('build', 'Release-iphoneos', 'TestApp.app'),
    finalPath: relative.iphoneos
  }
};

const apps = [
  SDKS.iphonesimulator.buildPath,
  SDKS.iphonesimulator.finalPath,
  SDKS.iphoneos.buildPath,
  SDKS.iphoneos.finalPath,
];

// the sdks against which we will build
let sdks = ['iphonesimulator'];
if (process.env.IOS_REAL_DEVICE || process.env.REAL_DEVICE) {
  sdks.push('iphoneos');
}

const MAX_BUFFER_SIZE = 524288;

async function getIOSSDK () {
  try {
    return await xcode.getMaxIOSSDK();
  } catch (err) {
    log(`Unable to get max iOS SDK: ${err.message}`);
    throw err;
  }
}

async function cleanApp (appRoot, sdk) {
  log(`Cleaning app for ${sdk} at app root '${appRoot}'`);
  try {
    const cmd = 'xcodebuild';
    const args = ['-sdk', sdk, 'clean'];
    await exec(cmd, args, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE});
    log(`Finished cleaning app for ${sdk}`);
  } catch (err) {
    log(`Failed cleaning app: ${err.message}`);
    throw err;
  }
}

async function cleanAll () {
  log('Cleaning all apps');
  const sdkVer = await getIOSSDK();

  for (const sdk of sdks) {
    await cleanApp('.', sdk + sdkVer);
  }

  // delete all the apps
  for (const app of apps) {
    await fs.rimraf(app);
  }
  log('Finished cleaning apps');
}

async function buildApp (appRoot, sdk) {
  log(`Building app for ${sdk} at app root '${appRoot}'`);
  try {
    const cmd = 'xcodebuild';
    const args = ['-sdk', sdk];
    await exec(cmd, args, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE});
  } catch (err) {
    log(`Failed building app: ${err.message}`);
    throw err;
  }

  log(`Finished building app for ${sdk}`);
}

async function buildAll () {
  log('Building all apps');
  const sdkVer = await getIOSSDK();
  for (const sdk of sdks) {
    await buildApp('.', sdk + sdkVer);
  }

  log('Finished building apps');
}

async function renameAll () {
  log('Renaming apps');
  for (const sdk of sdks) {
    log(`Renaming for ${sdk}`);
    await fs.rename(SDKS[sdk].buildPath, SDKS[sdk].finalPath);
  }
  log('Finished renaming apps');
}

exports.install = async function install () {
  await cleanAll();
  await buildAll();
  await renameAll();
  log('Finished installing');
};

exports.installRealDevice = async function installRealDevice () {
  sdks = ['iphoneos'];
  await exports.install();
};

exports.relative = relative;
exports.absolute = absolute;
exports.appList = appList;

if (require.main === module) {
  asyncify(exports.install);
}
