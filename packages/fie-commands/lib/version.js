'use strict';

/**
 * @author 擎空 <zernmal@foxmail.com>
 */

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
  console.log(chalk.magenta(`v${process.env.FIE_VERSION}`));

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
