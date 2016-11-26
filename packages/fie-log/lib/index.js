/**
 * @file 获取fie及模块的相关路径，不建议插件直接对 fie 家目录里面的内容直接进行操作
 * @see http://fie.alibaba.net/doc?package=fie-home
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-log
 */

'use strict';

const chalk = require('chalk');
const debug = require('debug');

/**
 * @exports fie-log
 */
module.exports = (moduleName) => {
  const message = (content, color) => {
    let _content = '';

    if (moduleName) {
      _content += chalk[color](`[${moduleName}] `);
    }
    _content += chalk[color](content);
    console.log(_content);
  };
  return {
    info(content) {
      message(content, 'magenta');
    },
    success(content) {
      message(content, 'green');
    },
    warn(content) {
      message(content, 'yellow');
    },
    error(content) {
      message(content, 'red');
    },
    debug: debug(moduleName)
  };
};
