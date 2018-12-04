'use strict';

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const home = require('fie-home');
const fieEnv = require('fie-env');
const chalk = require('chalk');
const log = require('fie-log')('core-commands');
const Intl = require('fie-intl');
const message = require('../locale/index');

/**
 * 切换内外网后，home目录的package.json内容可能会无法安装，比如从内网切换到外网时
 */
function removePackageFile(){
  const homeCwd = home.getHomePath();
  const pkgPath = path.join(homeCwd, 'package.json');
  if (!fs.existsSync(pkgPath)) return;
  fs.remove(pkgPath);
}

/**
 * 初始化环境
 */
module.exports = function*() {
  const intl = new Intl(message);
  const divider = '-    ';
  const answers = yield inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: intl.get('switchEnvTips'),
      choices: [
        {
          name: `${intl.get('aliIntranet')}   ${divider}${chalk.gray(intl.get('aliIntranetTips'))}`,
          value: 'intranet',
          short: intl.get('aliIntranet'),
        },
        {
          name: `${intl.get('aliExtranet')}   ${divider}${chalk.gray(intl.get('aliExtranetTips'))}`,
          value: 'extranet',
          short: intl.get('aliExtranet'),
        },
      ],
    },
  ]);

  // 设置env环境
  fieEnv.setEnv(answers.name);
  log.success(intl.get('initEnvSuccess'));
  removePackageFile();
};
