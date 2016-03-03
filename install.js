#!/usr/bin/env node

// transpile:main

import install from './lib/install';
import { asyncify } from 'asyncbox';


if (require.main === module) {
  asyncify(install);
}
