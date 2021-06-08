'use strict';

const gulp = require('gulp');
const boilerplate = require('@appium/gulp-plugins').boilerplate.use(gulp);
const { relative } = require('.');


boilerplate({
  build: 'ios-test-app',
  projectRoot: __dirname,
  transpile: false,
  iosApps: {
    relativeLocations: {
      iphoneos: relative.iphoneos,
      iphonesimulator: relative.iphonesimulator,
    },
    appName: 'TestApp.app',
  },
});
