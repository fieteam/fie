'use strict';

/**
 * @author 擎空 <zernmal@foxmail.com>
 */

const path = require('path');
const argv = require('yargs').help(false).argv;
const chalk = require('chalk');
const home = require('fie-home');
const config = require('fie-config');
const coreConfig = require('fie-core-config');
const log = require('fie-log')('core-commands');

const fieModuleName = require('fie-module-name');

function getPackagesVersion() {
  let str = '';
  [
    'fie-config',
    'fie-env',
    'fie-home',
    'fie-log',
    'fie-module',
    'fie-npm',
    'fie-task',
    'fie-fs',
    'fie-report',
    'fie-error'
  ].forEach((item) => {
    str += `${item} ${require(path.join(`../node_modules/${item}/package.json`)).version}\n`;
  });
  return str;
}

module.exports = function* () {
  const bin = coreConfig.getBinName();

  console.log(chalk.magenta(`${bin} v${process.env.FIE_VERSION}`));

  // 获取toolkit
  let toolkitName = config.getToolkitName();
  if (toolkitName) {
    toolkitName = fieModuleName.toolkitFullName(toolkitName);
    try {
      const pkgPath = path.join(home.getModulesPath(), toolkitName, 'package.json');
      log.debug(`${toolkitName} pacage.json path = ${pkgPath}`);
      const pkg = require(pkgPath);
      console.log(chalk.magenta(`${toolkitName} v${pkg.version}`));
    } catch (e) {
      log.debug(e);
    }
  }


  if (argv.d || argv.debug) {
    // 其依赖的核心包
    console.log(chalk.magenta(
      `
core package:

${getPackagesVersion()}

`
    ));
  }
};
