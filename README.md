## ios-test-app

A simple test application for iOS, used by [Appium](https://github.com/appium/appium) for certain tests.

### Building

`npm install` will build the app for a simulator. If you want also to build for a real device, set the environment variable `IOS_REAL_DEVICE` or `REAL_DEVICE` to a truthy value.

```
REAL_DEVICE=1 npm install
```

To build the application for simulator and real device without using `npm`, use

```
gulp transpile
REAL_DEVICE=1 node build-js/install.js
```

Finally, to install from within a node application (or as part of a build), use the
exported `installRealDevice` function

```js
import { installRealDevice } from 'ios-test-app';

let appPath = await installRealDevice();
```

## Watch

```
npm run watch
```

## Test

```
npm test
```
