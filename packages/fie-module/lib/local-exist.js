'use strict';

const fs = require('fs-extra');
const path = require('path');
const home = require('fie-home');
const utils = require('./utils');
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
