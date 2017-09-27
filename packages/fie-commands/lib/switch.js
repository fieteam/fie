'use strict';


const inquirer = require('inquirer');
const fieEnv = require('fie-env');
const chalk = require('chalk');
const log = require('fie-log')('fie-core');
/**
 * 初始化环境
 */
module.exports = function* () {
  const divider = '-    ';
  const answers = yield inquirer.prompt([{
    type: 'list',
    name: 'name',
    message: '请选择FIE的开发环境:',
    choices: [{
      name: `阿里内网环境   ${divider}${chalk.gray('阿里员工/可使用VPN登录阿里内网的用户')}`,
      value: 'intranet',
      short: '阿里内网环境'

    }, {
      name: `外网环境        ${divider}${chalk.gray('ISV/无法访问阿里内网的用户')}`,
      value: 'extranet',
      short: '外网环境'
    }]
  }]);

  // 设置env环境
  fieEnv.setEnv(answers.name);
  log.success('成功初始化FIE的开发环境!');
};
