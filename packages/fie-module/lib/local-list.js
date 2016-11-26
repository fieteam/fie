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

  let modules = globby.sync([
    'fie-plugin-*',
    'fie-plugin-*',
    'fie-toolkit-*',
    'fie-plugin-*',
    '!.*',
    '!*.*'
  ], {
    cwd: moduleCwd
  });

  modules = modules.map((item) => {
    const modPkg = fs.readJsonSync(path.resolve(moduleCwd, item, 'package.json'));
    return {
      name: modPkg.name,
      description: modPkg.description
    };
  });

  modules = options.type ? utils.moduleFilter(modules, options.type) : modules;

  log.debug('所有本地模块: %o', modules);

  return modules;
}


module.exports = localList;
