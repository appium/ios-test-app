#!/usr/bin/env node

// transpile:main

import install from './lib/install';
import B from 'bluebird';

B.resolve(install()).done();
