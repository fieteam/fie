/**
 * 列出所有的fie套件,插件
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const fieModule = require('fie-module');
const chalk = require('chalk');
const argv = require('yargs').argv;

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

  modules.filter(item => !!item.name.match(`fie-${type}`))
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
  const fixType = type === 'plugin' || type === 'toolkit' ? type : null;
  const textMap = {
    plugin: '插件',
    toolkit: '套件',
    all: '套件/插件'
  };
  const text = textMap[fixType || 'all'];
  const star = fixType ? '**' : '';
  const param = { fixType };

  options = options || {};

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

  newList = newList.filter((item) => {
    if (argv.all || item.shared) {
      return true;
    }
    return false;
  });

  console.log(chalk.italic.magenta(`\r\n${star}************** fie ${text}列表 ******************${star}\r\n`));

  if (!type) {
    console.log(chalk.magenta('- 套件列表 \r\n'));
    printListByType('toolkit', newList, options);
    console.log(chalk.magenta('\r\n- 插件列表 \r\n'));
    printListByType('plugin', newList, options);
  } else {
    printListByType(type, newList, options);
  }
  console.log(chalk.italic.magenta('\r\n***************************************************\r\n'));
};
