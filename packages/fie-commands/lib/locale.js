/**
 * 初始化FIE语言
 */

'use strict';


const inquirer = require('inquirer');
const log = require('fie-log')('core-commands');
const Intl = require('fie-intl');
const message = require('../locale/index');
/**
 * 初始化环境
 */
module.exports = function* () {
  const intl = new Intl(message);
  const divider = '-    ';
  const answers = yield inquirer.prompt([{
    type: 'list',
    name: 'name',
    message: intl.get('switchLocaleTips'),
    choices: [{
      name: `zh_CH    ${divider}中文`,
      value: 'zh_CH',
      short: 'zh_CH'

    }, {
      name: `en_US    ${divider}英文`,
      value: 'en_US',
      short: 'en_US'
    }]
  }]);

  // 设置env环境
  intl.setLocale(answers.name);
  log.success(intl.get('initLocalSuccess'));
};
