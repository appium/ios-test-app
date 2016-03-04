import xcode from 'appium-xcode';
import { fs } from 'appium-support';
import { exec } from 'teen_process';
import logger from './logger';
import path from 'path';


const rootDir = process.env.NO_PRECOMPILE ? path.resolve(__dirname) : path.resolve(__dirname, '..', '..');

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

// the sdks against which we will build
let sdks = ['iphonesimulator'];
if (process.env.IOS_REAL_DEVICE || process.env.REAL_DEVICE) {
  sdks.push('iphoneos');
}

async function cleanApp (appRoot, sdk) {
  logger.debug(`cleaning app for ${sdk}`);
  try {
    await exec('xcodebuild', ['-sdk', sdk, 'clean'], {cwd: appRoot});
  } catch (err) {
    logger.errorAndThrow(err);
  }
}

async function cleanAll () {
  logger.info("cleaning apps");
  let sdkVer = await xcode.getMaxIOSSDK();
  for (let sdk of sdks) {
    let fullSdk = sdk+sdkVer;
    await cleanApp('.', fullSdk);
  }
  for (let p of [
    SDKS.iphonesimulator.buildPath,
    SDKS.iphonesimulator.finalPath,
    SDKS.iphoneos.buildPath,
    SDKS.iphoneos.finalPath
  ]) {
    await fs.rimraf(p);
  }
  logger.info("finished cleaning apps");
}

async function buildApp (appRoot, sdk) {
  try {
    logger.debug(`building app for ${sdk}`);
    let args = ['-sdk', sdk];
    await exec('xcodebuild', args, {
      cwd: appRoot
    });
  } catch (err) {
    logger.error(err);
  }
}

async function buildAll () {
  logger.info("building apps");
  let sdkVer = await xcode.getMaxIOSSDK();
  for (let sdk of sdks) {
    let fullSdk = sdk+sdkVer;
    await buildApp('.', fullSdk);
  }
  logger.info("finished building apps");
 }

async function renameAll () {
  try {
    logger.info("renaming apps");
    for (let sdk of sdks) {
      logger.info(`renaming for ${sdk}`);
      await fs.rename(SDKS[sdk].buildPath, SDKS[sdk].finalPath);
    }
    logger.info("finished renaming apps");
  } catch (err) {
    logger.warn("could not rename apps");
    logger.error(err);
  }
}

async function install () {
  await cleanAll();
  await buildAll();
  await renameAll();
}

async function installRealDevice () {
  sdks = ['iphoneos'];
  await install;
  return SDKS.iphoneos.finalPath;
}

export default install;
export { relative, absolute, appList, install, installRealDevice };
