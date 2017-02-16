/**
 * fie log 模块
 * @author 擎空 <zernmal@foxmail.com>
 * @namespace fie-log
 */

'use strict';

const chalk = require('chalk');
const debug = require('debug');
const fieHome = require('fie-home');
const util = require('util');


// 定义 Object 类型的格式化工具函数
const formatters = {
  o(v) {
    return util.inspect(v).replace(/\s*\n\s*/g, ' ');
  },
  O(v) {
    return util.inspect(v);
  }
};


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

    // entryType 为 cli 代表只有当前模块做为入口模块时才打印
    // entryType 为 func 代表只有当前模块不是入口模块时才打印
    if ((this.entryType === 'cli' && !isEntry) || (this.entryType === 'func' && isEntry)) {
      // 返回布尔值,主要是留个勾子写单测
      return false;
    }

    const color = this.color;
    const _self = message;
    let args = Array.prototype.slice.call(arguments);

    if (args[0] instanceof Error) {
      args[0] = args[0].stack || args[0].message;
    }

    if (typeof args[0] !== 'string') {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    let index = 0;
    let originFormatCount = 0;

    // 获取第一个参数的所有占位字符, 遇到有自定义的,便调用自定义的进行转换
    args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') {
        return match;
      }
      index += 1;
      originFormatCount += 1;
      const formatter = formatters[format];
      if (typeof formatter === 'function') {
        const val = args[index];
        match = formatter.call(_self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index -= 1;
        originFormatCount -= 1;
      }
      return match;
    });

    // 将所有字符串加上颜色
    args = args.map((val, idx) => {
      if (idx === 0 || idx > originFormatCount) {
        return chalk[color](idx === 0 ? `[${moduleName}] ${val}` : val);
      }
      return val;
    });

    // format args
    console.log.bind(console).apply(_self, args);

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
