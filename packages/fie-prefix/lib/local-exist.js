'use strict';

const utils = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const home = require('fie-home');

/**
 * 模块是否存在
 */
function localExist(name) {
  name = utils.fullName(name);
  const modulePath = path.resolve(home.getModulesPath(), name);
  const pkgPath = path.resolve(modulePath, 'package.json');
  return fs.existsSync(pkgPath);
}

module.exports = localExist;
