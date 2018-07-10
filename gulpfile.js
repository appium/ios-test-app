"use strict";

const gulp = require('gulp');
const boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp);
const install = require('./install-npm').install;

boilerplate({
  transpileOut: 'build-js',
  build: 'ios-test-app',
  jscs: false
});

gulp.task('install-app', install);
