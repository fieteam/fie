'use strict';

/**
 * @author 擎空 <zernmal@foxmail.com>
 */

const fiePkg = require('../package.json');
const path = require('path');
const argv = require('yargs').argv;
const chalk = require('chalk');

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
  console.log(chalk.magenta(`v${fiePkg.version}`));

  if (argv.d || argv.debug) {
    // 其依赖的核心包
    console.log(chalk.magenta(
      `
其依赖的核心包版本如下:

${getPackagesVersion()}

`
    ));
  }
};
