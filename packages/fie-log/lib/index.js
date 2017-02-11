/**
 * @file 获取fie及模块的相关路径，不建议插件直接对 fie 家目录里面的内容直接进行操作
 * @see http://fie.alibaba.net/doc?package=fie-home
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-log
 */

'use strict';

const chalk = require('chalk');
const debug = require('debug');
const fieHome = require('fie-home');


/**
 * @exports fie-log
 */
module.exports = (moduleName) => {
  const message = (content, color, entryType) => {
    const isEntry = process.env[fieHome.getEntryModuleEnvName()] === moduleName;
    let _content = '';

    entryType = entryType || 0;
    if (moduleName) {
      _content += chalk[color](`[${moduleName}] `);
    }
    _content += chalk[color](content);

    // entryType 为 1 代表只有当前模块做为入口模块时才打印
    // entryType 为 2 代表只有当前模块不是入口模块时才打印
    if ((entryType === 1 && !isEntry) || (entryType === 2 && isEntry)) {
      // 返回布尔值,主要是留个勾子写单测
      return false;
    }
    console.log(_content);
    return true;
  };
  return {
    info(content, entryType) {
      return message(content, 'magenta', entryType);
    },
    success(content, entryType) {
      return message(content, 'green', entryType);
    },
    warn(content, entryType) {
      return message(content, 'yellow', entryType);
    },
    error(content, entryType) {
      return message(content, 'red', entryType);
    },
    debug: debug(moduleName)
  };
};
