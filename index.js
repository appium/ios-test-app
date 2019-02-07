'use strict';

const path = require('path');


const relative = {
  iphoneos: 'build/Release-iphoneos/TestApp-iphoneos.app',
  iphonesimulator: 'build/Release-iphonesimulator/TestApp-iphonesimulator.app'
};

const absolute = {
  iphoneos: path.resolve('build', 'Release-iphoneos', 'TestApp-iphoneos.app'),
  iphonesimulator: path.resolve('build', 'Release-iphonesimulator', 'TestApp-iphonesimulator.app')
};

module.exports = {
  relative,
  absolute,
};
