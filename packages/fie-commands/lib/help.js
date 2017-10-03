/**
 * 查看FIE 及 套件的 帮助信息
 */

'use strict';


const fieConfig = require('fie-config');
const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const fieEnv = require('fie-env');
const chalk = require('chalk');

const help = `
 fie 使用帮助:  $ fie [command] [options]

    $  fie                     显示fie帮助信息,若目录下有使用的套件,则会同时显示套件的帮助信息
    $  fie init [toolkitName]  初始化套件
    $  fie install [name]      安装FIE模块
    $  fie update [name]       更新FIE模块
    $  fie list [type]         插件列表
    $  fie ii                  安装npm模块，功能等同于npm install，但安装速度更快更稳定
    $  fie clear               清空 fie 的本地缓存
    $  fie switch              切换 fie 的开发环境
    $  fie help                显示套件帮助信息
    $  fie [name]              其他调用插件命令

   Options:

     -h, --help                显示fie帮助信息
     -v, --version             显示fie版本

`;


/**
 * 显示FIE帮助
 */
function outFieHelpInfo(needToolkit) {
  const tips = fieEnv.isIntranet() ? '阿里内网环境' : '外网环境';

  // 打印帮助信息
  console.log(chalk.cyan(help));

  console.log(chalk.yellow(' 提示: '));
  needToolkit && console.log(chalk.yellow('   套件 - 若想查看项目中所使用的套件帮助信息,请在项目根目录执行该命令.'));
  console.log(chalk.yellow('   插件 - 若想查看插件的帮助信息,请使用 fie [name] help 命令, eg : fie git help'));
  console.log(chalk.yellow(`   环境 - 当前FIE开发环境为: ${tips} , 可使用 $ fie switch 进行切换`));
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
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') return true;
  return isGenerator(constructor.prototype);
}

module.exports = function* () {
  const toolkit = fieConfig.getToolkitName();

  // 套件存在,则优先输出套件帮助信息
  if (toolkit) {
    const mod = yield fieModule.get(fieModuleName.toolkitFullName(toolkit));
    if (mod && mod.help) {
      if (isGeneratorFunction(mod.help)) {
        yield mod.help();
      } else {
        mod.help();
      }

      console.log(chalk.cyan(' ------- 以下是 fie 自身的命令 ------- '));
    }
    outFieHelpInfo();
  } else {
    outFieHelpInfo(true);
  }
};
