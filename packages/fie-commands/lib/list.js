/**
 * 列出所有的fie套件,插件
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const log = require('fie-log')('core-commands');
const chalk = require('chalk');
const argv = require('yargs').argv;
const Intl = require('fie-intl');
const message = require('../locale/index');

/**
 * 设置字符串边距
 * @param str
 * @param width
 * @returns {string}
 */
function getPadding(str, width) {
  const spaceLen = (typeof width === 'undefined' ? 30 : width) - str.length;
  let padding = '';

  padding += '  ';
  for (let i = 2; i < spaceLen; i += 1) {
    padding += '-';
  }
  padding += '  ';
  return padding;
}


function printListByType(type, modules) {
  let tmpString;
  const prefix = fieModuleName.prefix();
  modules.filter(item => !!item.name.match(`${prefix}-${type}`))
    .forEach((item) => {
      const padding = getPadding(item.name, 35);

      tmpString = [
        '  ',
        chalk.green(item.name),
        chalk.gray(padding),
        item.chName ? item.chName : '暂无描述'
      ].join('');

      console.log(tmpString);
    });
}


/**
 * 显示套件列表
 * @param cliArgs
 * @param options
 * @param options.callback
 */
module.exports = function* (cliArgs, options) {
  const type = cliArgs.pop();
  const intl = new Intl(message);
  const fixType = type === 'plugin' || type === 'toolkit' ? type : null;
  const textMap = {
    plugin: intl.get('plugin'),
    toolkit: intl.get('toolkit'),
    all: intl.get('toolkitAndPlugin')
  };
  const text = textMap[fixType || 'all'];
  const star = fixType ? '**' : '';
  const param = { fixType };

  options = options || {};
  log.debug('module params = %o', param);
  const local = yield fieModule.localList(param);
  const online = yield fieModule.onlineList(param);
  let newList = [];

  // merge list
  const onlineKeys = online.map((item) => {
    newList.push(item);
    return item.name;
  });

  local.forEach((item) => {
    if (onlineKeys.indexOf(item.name) === -1) {
      newList.push(item);
    }
  });

  newList = newList.filter(item => !!(argv.all || item.shared));

  console.log(chalk.italic.magenta(`\r\n${star}************** ${text} ${intl.get('list')} ******************${star}\r\n`));

  if (!type) {
    console.log(chalk.magenta(intl.get('toolkitList')));
    printListByType('toolkit', newList, options);
    console.log(chalk.magenta(intl.get('pluginList')));
    printListByType('plugin', newList, options);
  } else {
    printListByType(type, newList, options);
  }
  console.log(chalk.italic.magenta('\r\n***************************************************\r\n'));
};
