'use strict';

var xcode = require('appium-xcode').default,
    fs = require('fs'),
    path = require('path'),
    log = require('fancy-log'),
    asyncUtil = require('async'),
    rimraf = require('rimraf'),
    exec = require('child_process').exec;


var rootDir = process.env.NO_PRECOMPILE ? path.resolve(__dirname) : path.resolve(__dirname, '..');

var relative = {
  iphoneos: 'build/Release-iphoneos/TestApp-iphoneos.app',
  iphonesimulator: 'build/Release-iphonesimulator/TestApp-iphonesimulator.app'
};

var absolute = {
  iphoneos: path.resolve(rootDir, 'build', 'Release-iphoneos', 'TestApp-iphoneos.app'),
  iphonesimulator: path.resolve(rootDir, 'build', 'Release-iphonesimulator', 'TestApp-iphonesimulator.app')
};

var appList = [
  relative.iphoneos,
  relative.iphonesimulator
];

var SDKS = {
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
var sdks = ['iphonesimulator'];
if (process.env.IOS_REAL_DEVICE || process.env.REAL_DEVICE) {
  sdks.push('iphoneos');
}

var MAX_BUFFER_SIZE = 524288;

function cleanApp (appRoot, sdk, done) {
  log('cleaning app for ' + sdk);
  var cmd = 'xcodebuild -sdk ' + sdk + ' clean';
  exec(cmd, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE}, function (err, stdout, stderr) {
    if (err) {
      log("Failed cleaning app: " + err);
      log(stderr);
      done(err);
    } else {
      log('finished cleaning app for ' + sdk);
      done();
    }
  });
}

function cleanAll (done) {
  log("cleaning apps");
  xcode.getMaxIOSSDK()
    .catch(function (err) {
      log("Unable to get max iOS SDK:", err.message);
    })
    .then(function (sdkVer) {
      asyncUtil.eachSeries(sdks, function (sdk, cb) {
        cleanApp('.', sdk + sdkVer, cb);
      }, function (err) {
        if (err) return done(err);
        asyncUtil.eachSeries([
          SDKS.iphonesimulator.buildPath,
          SDKS.iphonesimulator.finalPath,
          SDKS.iphoneos.buildPath,
          SDKS.iphoneos.finalPath
        ], rimraf, function (err) {
          if (err) return done(err);
          log("finished cleaning apps");
          done();
        });
      });
    });
}

function buildApp (appRoot, sdk, done) {
  log('building app for ' + sdk);
  var cmd = 'xcodebuild -sdk ' + sdk;
  exec(cmd, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE}, function (err, stdout, stderr) {
    if (err) {
      log("Failed building app");
      log(stderr);
      done(err);
    } else {
      log('finished building app for ' + sdk);
      done();
    }
  });
}

function buildAll (done) {
  log('building apps');
  xcode.getMaxIOSSDK()
    .then(function (sdkVer) {
      asyncUtil.eachSeries(sdks, function (sdk, cb) {
        buildApp('.', sdk + sdkVer, cb);
      }, function (err) {
        if (err) return done(err);
        log('finished building apps');
        done();
      });
    });
 }

function renameAll (done) {
  log('renaming apps');
  asyncUtil.eachSeries(sdks, function (sdk, cb) {
    log('renaming for ' + sdk);
    fs.rename(SDKS[sdk].buildPath, SDKS[sdk].finalPath, cb);
  }, function (err) {
    if (err) return done(err);
    log('finished renaming apps');
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
    console.log('finished installing');
  });
}
