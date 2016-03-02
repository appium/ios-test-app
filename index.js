import path from 'path';
import { install, installRealDevice } from './lib/install';


let rootDir = process.env.NO_PRECOMPILE ? path.resolve(__dirname) : path.resolve(__dirname, '..');

let relative = {
  'iphoneos': 'build/Release-iphoneos/TestApp-iphoneos.app',
  'iphonesimulator': 'build/Release-iphonesimulator/TestApp-iphonesimulator.app'
};

let absolute = {
  'iphoneos': path.resolve(rootDir, 'build', 'Release-iphoneos', 'TestApp-iphoneos.app'),
  'iphonesimulator': path.resolve(rootDir, 'build', 'Release-iphonesimulator', 'TestApp-iphonesimulator.app')
};

// default export is relative app for backward compaibility
let appList = [
  "build/Release-iphoneos/TestApp-iphoneos.app",
  "build/Release-iphonesimulator/TestApp-iphonesimulator.app"
];

export default appList;
export { relative, absolute, appList, install, installRealDevice };
