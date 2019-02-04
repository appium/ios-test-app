'use strict';

const xcode = require('appium-xcode');
const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const asyncUtil = require('async');
const rimraf = require('rimraf');
const { exec } = require('child_process');


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

// the sdks against which we will build
let sdks = ['iphonesimulator'];
if (process.env.IOS_REAL_DEVICE || process.env.REAL_DEVICE) {
  sdks.push('iphoneos');
}

const MAX_BUFFER_SIZE = 524288;

function cleanApp (appRoot, sdk, done) {
  log(`Cleaning app for ${sdk}`);
  const cmd = `xcodebuild -sdk ${sdk} clean`;
  exec(cmd, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE}, function (err, stdout, stderr) {
    if (err) {
      log(`Failed cleaning app: ${err.message}`);
      log(stderr);
      done(err);
    } else {
      log(`Finished cleaning app for ${sdk}`);
      done();
    }
  });
}

function cleanAll (done) {
  log('Cleaning apps');
  xcode.getMaxIOSSDK()
    .catch(function (err) {
      log(`Unable to get max iOS SDK: ${err.message}`);
    })
    .then(function (sdkVer) {
      asyncUtil.eachSeries(sdks, function (sdk, cb) {
        cleanApp('.', sdk + sdkVer, cb);
      }, function (err) {
        if (err) {
          return done(err);
        }
        asyncUtil.eachSeries([
          SDKS.iphonesimulator.buildPath,
          SDKS.iphonesimulator.finalPath,
          SDKS.iphoneos.buildPath,
          SDKS.iphoneos.finalPath
        ], rimraf, function (err) {
          if (err) {
            return done(err);
          }
          log('Finished cleaning apps');
          done();
        });
      });
    });
}

function buildApp (appRoot, sdk, done) {
  log(`Building app for ${sdk}`);
  const cmd = `xcodebuild -sdk ${sdk}`;
  exec(cmd, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE}, function (err, stdout, stderr) {
    if (err) {
      log(`Failed building app: ${err.message}`);
      log(stderr);
      done(err);
    } else {
      log(`Finished building app for ${sdk}`);
      done();
    }
  });
}

function buildAll (done) {
  log('Building apps');
  xcode.getMaxIOSSDK()
    .then(function (sdkVer) {
      asyncUtil.eachSeries(sdks, function (sdk, cb) {
        buildApp('.', sdk + sdkVer, cb);
      }, function (err) {
        if (err) {
          return done(err);
        }
        log('Finished building apps');
        done();
      });
    });
}

function renameAll (done) {
  log('Renaming apps');
  asyncUtil.eachSeries(sdks, function (sdk, cb) {
    log(`Renaming for ${sdk}`);
    fs.rename(SDKS[sdk].buildPath, SDKS[sdk].finalPath, cb);
  }, function (err) {
    if (err) {
      return done(err);
    }
    log('Finished renaming apps');
    done();
  });
}

exports.install = function install (done) {
  asyncUtil.series([
    cleanAll,
    buildAll,
    renameAll,
    function () {
      if (typeof done === 'function') {
        done();
      }
    }
  ]);
};

exports.installRealDevice = function installRealDevice (done) {
  sdks = ['iphoneos'];
  exports.install(function () {
    done(SDKS.iphoneos.finalPath);
  });
};

exports.relative = relative;
exports.absolute = absolute;
exports.appList = appList;

if (require.main === module) {
  exports.install(function () {
    log('Finished installing');
  });
}
