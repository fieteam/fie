'use strict';

/**
 * Created by hugo on 16/11/20.
 */
const globby = require('globby');
const log = require('fie-log')('fie-module');
const env = require('fie-env');
const home = require('fie-home');
const utils = require('./utils');
const path = require('path');
const fs = require('fs-extra');

const isIntranet = env.isIntranet();
const fieModulesPath = home.getModulesPath();


function localList(options) {
  options = options || {};
  const moduleCwd = isIntranet ? path.resolve(fieModulesPath, '@ali') : fieModulesPath;
  const modules = globby.sync([
    'fie-plugin-*',
    'fie-plugin-*',
    'fie-toolkit-*',
    'fie-plugin-*',
    '!.*',
    '!*.*'
  ], {
    cwd: moduleCwd
  });
  let modulePkgs = [];

  modules.forEach((item) => {
    const pkgPath = path.resolve(moduleCwd, item, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const modPkg = fs.readJsonSync(pkgPath);
      modulePkgs.push({
        name: modPkg.name,
        description: modPkg.description
      });
    }
  });

  modulePkgs = options.type ? utils.moduleFilter(modulePkgs, options.type) : modulePkgs;

  log.debug('所有本地模块: %o', modulePkgs);

  return modulePkgs;
}


module.exports = localList;
