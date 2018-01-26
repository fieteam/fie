/**
 * 查看FIE 及 套件的 帮助信息
 */

'use strict';

const fieConfig = require('fie-config');
const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const fieEnv = require('fie-env');
const chalk = require('chalk');
const Intl = require('fie-intl');
const message = require('../locale/index');

/**
 * 获取fie的实际命令
 * @returns {*|string}
 */
function getFieBin() {
  return process.env.FIE_BIN || 'fie';
}

/**
 * 显示FIE帮助
 */
function outFieHelpInfo(needToolkit) {
  const intl = new Intl(message);
  const env = fieEnv.isIntranet() ? intl.get('aliIntranet') : intl.get('aliExtranet');
  const tool = getFieBin();
  const help = intl.get('help', { tool });

  // 打印帮助信息
  console.log(chalk.cyan(help));
  console.log(chalk.yellow(intl.get('helpTips')));
  needToolkit && console.log(chalk.yellow(intl.get('helpToolkit')));
  console.log(chalk.yellow(intl.get('helpPlugin', { tool })));
  console.log(chalk.yellow(intl.get('helpEnv', { tool, env })));
}

function isGenerator(obj) {
  return typeof obj.next === 'function' && typeof obj.throw === 'function';
}

/**
 * 判断当前对象是否为 generator 函数
 * @param obj
 * @returns {boolean}
 */
function isGeneratorFunction(obj) {
  const constructor = obj.constructor;
  if (!constructor) return false;
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction')
    return true;
  return isGenerator(constructor.prototype);
}

module.exports = function*() {
  const toolkit = fieConfig.getToolkitName();
  const intl = new Intl(message);
  const tool = getFieBin();
  // 套件存在,则优先输出套件帮助信息
  if (toolkit) {
    const mod = yield fieModule.get(fieModuleName.toolkitFullName(toolkit));
    if (mod && mod.help) {
      if (isGeneratorFunction(mod.help)) {
        yield mod.help();
      } else {
        mod.help();
      }

      console.log(chalk.cyan(intl.get('helpList', { tool })));
    }
    outFieHelpInfo();
  } else {
    outFieHelpInfo(true);
  }
};
