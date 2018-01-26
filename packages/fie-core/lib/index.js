'use strict';
require('../lib/config');

const home = require('fie-home');
const log = require('fie-log')('core-core');
const Intl = require('fie-intl');
const fieCommands = require('fie-commands');


module.exports = {
  run : function* (command , newArgv) {
    // fie 家目录存在性检查
    home.initHomeDir();

    //初始化语言环境
    const intl = new Intl();
    intl.initLocale();
    //fie 核心运行命令
    const coreCommands = Object.keys(fieCommands).filter( (item) =>{
      return item !== 'main';
    });

    if (coreCommands.indexOf(command) === -1) {
      log.debug('进入套件,插件分支');
      yield fieCommands.main.apply(this, [command, newArgv]);
    } else {
      log.debug('进入核心命令分支');
      // init, install, install, uninstall, update ,version 等命令
      // 对 fie.config.js 没有依赖, 也不考虑兼容旧版, 也不执行自定义命令流
      yield fieCommands[command].apply(null, [newArgv]);
    }
  }
}