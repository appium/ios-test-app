#!/usr/bin/env node

var install = require('./build-js/lib/install');
var B = require('bluebird');

B.resolve(install()).done();
