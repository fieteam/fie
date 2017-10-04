/**
 * 套件 generate 初始化模板操作
 */

'use strict';

const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const report = require('fie-report');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const fieConfig = require('fie-config');
const log = require('fie-log')('core-commands');
const task = require('fie-task');
const api = require('fie-api/lib/old-api');

const cwd = process.cwd();

function* runInit(name) {
  const module = yield fieModule.getReallyName(name);

  if (module.exist) {
    const moduleInfo = yield fieModule.get(module.reallyName);
    yield task.runFunction({
      method: moduleInfo.init,
      // 这里是为了兼容fie老版本传入fie对象进去，新版本建议是使用fie-api包
      args: moduleInfo.init.length > 1 ? [api.getApi(name), {}] : [api.getApi(name)]
    });
  } else {
    const msg = `${module.fullName} 套件不存在`;
    log.error(msg);
    report.error(module.fullName, msg);
  }
}


function* getName() {
  const choices = [];
  const onlineList = yield fieModule.onlineList({ type: 'toolkit' });
  const localList = fieModule.localList({ type: 'toolkit' });
  const toolkitPrefix = fieModuleName.toolkitPrefix();
  const onlineMap = {};
  const addChoice = (item) => {
    const n = item.name.replace('@ali/', '').replace(toolkitPrefix, '');
    choices.push({
      name: n + chalk.gray(` -  ${item.chName}`),
      value: n
    });
  };

  onlineList.forEach((item) => {
    addChoice(item);
    onlineMap[item.name] = true;
  });

  localList.forEach((item) => {
    if (!onlineMap[item.name]) {
      addChoice(item);
    }
  });


  const answers = yield inquirer.prompt([{
    type: 'list',
    name: 'name',
    message: '请选择一个适合您项目的套件进行初始化:',
    choices
  }]);
  return answers.name;
}

module.exports = function* (args) {
  let name = args.pop();

  if (!name) {
    // 未传入套件名,提示并列出可用套件名
    name = yield getName();
  }

  name = fieModuleName.toolkitFullName(name);

  // 先判断fie.config.js 是否存在
  // 存在的话,提示已初始化过了
  // 不存在的话再判断文件夹是否为空
  // 不为空的话则提示覆盖
  if (fieConfig.exist(cwd)) {
    log.warn('该项目已初始化过,无需再次进行init');
    log.warn(`若想重新初始化,请删除项目中的 ${fieConfig.getConfigName()} 文件`);
    return;
  }

  // 排除那些以点开头的文件
  // TODO 貌似排除的判断有问题
  const files = fs.readdirSync(cwd).filter(file => file !== '.' && file !== '..');

  if (files.length > 0) {
    log.warn('当前目录下已存在文件,继续执行初始化会覆盖已存在的同名文件');
    const questions = [{
      type: 'input',
      name: 'check',
      message: '确认需要继续执行初始化,请输入(y)'
    }];
    const answers = yield inquirer.prompt(questions);
    if (answers.check === 'y' || answers.check === 'Y') {
      yield runInit(name);
    }
  } else {
    yield runInit(name);
  }
};
