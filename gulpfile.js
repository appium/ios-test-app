"use strict";

var gulp = require('gulp'),
    boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp);

boilerplate({
  transpileOut: 'build-js',
  build: 'ios-test-app',
  jscs: false
});
