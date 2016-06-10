"use strict";

var gulp = require('gulp'),
    boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp),
    install = require('./install-npm').install;

boilerplate({
  transpileOut: 'build-js',
  build: 'ios-test-app',
  jscs: false
});

gulp.task('install-app', install);
