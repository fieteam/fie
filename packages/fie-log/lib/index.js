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
  const message = (content, color, entryOnly) => {
    let _content = '';

    if (moduleName) {
      _content += chalk[color](`[${moduleName}] `);
    }
    _content += chalk[color](content);
    console.log(moduleName, fieHome.getEntryModuleEnvName(), process.env[fieHome.getEntryModuleEnvName()])
    if (entryOnly && process.env[fieHome.getEntryModuleEnvName()] !== moduleName) {
      return;
    }
    console.log(_content);
  };
  return {
    info(content, entryOnly) {
      message(content, 'magenta', entryOnly);
    },
    success(content, entryOnly) {
      message(content, 'green', entryOnly);
    },
    warn(content, entryOnly) {
      message(content, 'yellow', entryOnly);
    },
    error(content, entryOnly) {
      message(content, 'red', entryOnly);
    },
    debug: debug(moduleName)
  };
};
