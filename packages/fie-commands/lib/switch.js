'use strict';


const inquirer = require('inquirer');
const fieEnv = require('fie-env');
const chalk = require('chalk');
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
    message: intl.get('switchEnvTips'),
    choices: [{
      name: `${intl.get('aliIntranet')}   ${divider}${chalk.gray(intl.get('aliIntranetTips'))}`,
      value: 'intranet',
      short: intl.get('aliIntranet')

    }, {
      name: `${intl.get('aliExtranet')}   ${divider}${chalk.gray(intl.get('aliExtranetTips'))}`,
      value: 'extranet',
      short: intl.get('aliExtranet')
    }]
  }]);

  // 设置env环境
  fieEnv.setEnv(answers.name);
  log.success(intl.get('initEnvSuccess'));
};
