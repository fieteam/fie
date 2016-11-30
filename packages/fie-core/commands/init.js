/**
 * 套件 generate 初始化模板操作
 */

'use strict';

const fieModule = require('fie-module');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const log = require('fie-log')('fie-core');
const task = require('fie-task');
const api = require('../lib/api');
const path = require('path');

const cwd = process.cwd();

function* runInit(name) {
  const moduleInfo = yield fieModule.get(name);
  yield task.runFunction({
    method: moduleInfo.init,
    args: [api.getApi(name), {}]
  });
}


function* getName() {
  const choices = [];
  const onlineList = yield fieModule.onlineList({ type: 'toolkit' });
  const localList = fieModule.localList({ type: 'toolkit' });
  const onlineMap = {};
  const addChoice = (item) => {
    const n = item.name.replace('@ali/', '').replace('fie-toolkit-', '');
    choices.push({
      name: n + chalk.gray(` -  ${item.description}`),
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

  name = fieModule.toolkitFullName(name);

  // 先判断fie.config.js 是否存在
  // 存在的话,提示已初始化过了
  // 不存在的话再判断文件夹是否为空
  // 不为空的话则提示覆盖
  if (fs.existsSync(path.join(cwd, 'fie.config.js'))) {
    log.warn('该项目已初始化过,无需再次进行init');
    log.warn('若想重新初始化,请删除项目中的 fie.config.js 文件');
    return;
  }

  // 排除那些以点开头的文件
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
