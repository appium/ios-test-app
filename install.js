#!/usr/bin/env node

// transpile:main

import install from './install-npm';
import { asyncify } from 'asyncbox';


if (require.main === module) {
  asyncify(install);
}
