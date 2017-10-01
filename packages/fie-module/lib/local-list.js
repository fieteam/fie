'use strict';

/**
 * 本地模块列表
 * Created by hugo on 16/11/20.
 */
const globby = require('globby');
const log = require('fie-log')('core-module');
const env = require('fie-env');
const home = require('fie-home');
const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils');

/**
 * 列出所有本地模块
 * @param options object {type (按类型筛选): 'toolkit | plugin'}
 * @returns {Array}
 */
function localList(options) {
  options = options || {};
  const isIntranet = env.isIntranet();
  const fieModulesPath = home.getModulesPath();
  const tPrefix = utils.toolkitPrefix();
  const pPrefix = utils.pluginPrefix();
  const moduleCwd = isIntranet ? path.resolve(fieModulesPath, '@ali') : fieModulesPath;
  const modules = globby.sync([
    `${tPrefix}*`,
    `${pPrefix}*`,
    '!.*',
    '!*.*'
  ], {
    cwd: moduleCwd
  });
  let modulePkgs = [];

  log.debug('modules path = %s',moduleCwd);

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
