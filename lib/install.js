import xcode from 'appium-xcode';
import { fs } from 'appium-support';
import { exec } from 'teen_process';
import logger from './logger';
import path from 'path';

let sdks = ['iphonesimulator', 'iphoneos'];

async function cleanApp (appRoot, sdk) {
  logger.debug(`cleaning app for ${sdk}`);
  try {
    await exec('xcodebuild', ['-sdk', sdk, 'clean'], {cwd: appRoot});
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function cleanAll () {
  logger.info("cleaning apps");
  let sdkVer = await xcode.getMaxIOSSDK();
  for(let sdk of sdks) {
    let fullSdk = sdk+sdkVer;
    await cleanApp('.', fullSdk);
  }
  for(let p of [
    path.resolve('build', 'Release-iphonesimulator', 'TestApp.app'),
    path.resolve('build', 'Release-iphonesimulator', 'TestApp-iphonesimulator.app'),
    path.resolve('build', 'Release-iphoneos', 'TestApp.app'),
    path.resolve('build', 'Release-iphoneos', 'TestApp-iphoneos.app'),
  ]) {
    await fs.rimraf(p);
  }
  logger.info("finished cleaning apps");
}

async function buildApp(appRoot, sdk) {
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
  for(let sdk of sdks) {
    let fullSdk = sdk+sdkVer;
    await buildApp('.', fullSdk);
  }
  logger.info("finished building apps");
 }

async function renameAll () {
  try {
    logger.info("renaming apps");
    await fs.rename(
      path.resolve('build', 'Release-iphonesimulator', 'TestApp.app'),
      path.resolve('build', 'Release-iphonesimulator', 'TestApp-iphonesimulator.app'));
    await fs.rename(
      path.resolve('build', 'Release-iphoneos', 'TestApp.app'),
      path.resolve('build', 'Release-iphoneos', 'TestApp-iphoneos.app'));
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

export default install;
