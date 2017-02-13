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
  /**
   * 根据颜色打印
   * @param content
   * @param color
   * @param entryType
   * @returns {boolean}
   */
  function message() {
    const isEntry = process.env[fieHome.getEntryModuleEnvName()] === moduleName;
    const color = this.color;
    const content = arguments[0];
    let _content = '';

    if (moduleName) {
      _content += chalk[color](`[${moduleName}] `);
    }
    _content += chalk[color](content);

    // entryType 为 cli 代表只有当前模块做为入口模块时才打印
    // entryType 为 func 代表只有当前模块不是入口模块时才打印
    if ((this.entryType === 'cli' && !isEntry) || (this.entryType === 'func' && isEntry)) {
      // 返回布尔值,主要是留个勾子写单测
      return false;
    }

    console.log(_content);
    return true;
  }

  function getLeaves(entryType) {
    const methods = { info: 'magenta', success: 'green', warn: 'yellow', error: 'red' };
    const leaves = {};

    Object.keys(methods).forEach((key) => {
      function leafFunc() {
        const color = methods[key];
        const args = Array.prototype.slice.call(arguments);
        return message.apply({
          entryType,
          color
        }, args);
      }
      leaves[key] = leafFunc;
    });
    return leaves;
  }

  return Object.assign({}, {
    cli: getLeaves('cli'),
    func: getLeaves('func'),
    debug: debug(moduleName)
  }, getLeaves('all'));
};
