/**
 *
 * 所有的套件/插件都走这个命令
 */

'use strict';

const co = require('co');
const log = require('fie-log')('fie-core');
const fieTask = require('fie-task');
const fieConfig = require('fie-config');
const fieModule = require('fie-module');
const fieError = require('fie-error');
const fieNpm = require('fie-npm');
const api = require('../lib/api');
const fieHome = require('fie-home');
const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const report = require('fie-report');

let fieObject;

function setEntryModule(name) {
  process.env[fieHome.getEntryModuleEnvName()] = name.replace('@ali/', '');
}
/**
 * 运行插件命令
 * @param name
 * @param cliArgs
 */
function* runPlugin(name, cliArgs) {
  name = fieModule.pluginFullName(name);
  fieObject = api.getApi(name);

  // 执行插件的方法
  let exist = fieModule.localExist(name);
  log.debug(`${name} 插件本地是否存在: ${exist}`);
  if (!exist) {
    exist = yield fieModule.onlineExist(name);
    log.debug(`${name} 线上是否存在: ${exist}`);
  }

  if (exist) {
    setEntryModule(name);
    const plugin = yield fieModule.get(name);
    let method;
    let pluginCmd = '';
    log.debug(' 插件信息 %o', plugin);
    if (typeof plugin === 'function') {
      method = plugin;
    } else if (typeof plugin === 'object') {
      if (cliArgs.length) {
        pluginCmd = cliArgs.shift();
        if (typeof plugin[pluginCmd] === 'function') {
          method = plugin[pluginCmd];
        }
      } else if (typeof plugin.default === 'function') {
        method = plugin.default;
      }
    }
    if (!method) {
      const msg = `未找到 ${name} 插件对应的命令 ${pluginCmd}`;
      log.error(msg);
      report.error(name, msg);
      return;
    }

    yield fieTask.runFunction({
      method,
      args: [fieObject, {
        clientArgs: cliArgs,
        clientOptions: argv
      }]
    });
  } else {
    const msg = `${name} 插件不存在`;
    log.error(msg);
    report.error(name, msg);
  }
}

/**
 * 展示版本号
 */
function* showVersion(name) {
  let existsOne = false;
  const logOne = function* (n) {
    n = fieModule.fullName(n);
    const localExist = fieModule.localExist(n);
    let mod = '';
    if (localExist) {
      mod = fs.readJsonSync(path.resolve(fieHome.getModulesPath(), n, 'package.json'));
    } else {
      mod = yield fieNpm.latest(n);
    }
    if (mod && mod.version) {
      existsOne = true;
      console.log(chalk.magenta(`\n${n} 对应版本为 ${mod.version}\n`));
    }
  };
  if (name.indexOf('toolkit-') > -1 || name.indexOf('plugin-') > -1) {
    yield logOne(name);
    return;
  }

  yield logOne(`toolkit-${name}`);
  yield logOne(`plugin-${name}`);

  if (!existsOne) {
    const msg = `未找到 toolkit-${name} 或 plugin-${name} 模块`;
    log.error(msg);
    report.error('plugin-not-found', msg);
  }
}

/**
 * 执行命令, 调用优先级是 core > task > toolkit > plugin
 * @param command
 * @param cliArgs
 * @returns {*}
 */
module.exports = function* (command, cliArgs) {
  const tasks = fieConfig.get('tasks') || {};
  const hasBeforeTask = fieTask.has(tasks[command], 'before');
  const hasAfterTask = fieTask.has(tasks[command], 'after');

  log.debug(' tasks = %o , command = %s, cliArgs = %o', tasks, command, cliArgs);
  log.debug(`before task ${hasBeforeTask}`);


  // 如果第一个参数为 plugin, 强制执行某个插件, 并且忽略所有的前置,后置任务
  if (command === 'plugin') {
    if (cliArgs.length < 1) {
      log.error('请输入您要运行的插件名');
      return;
    }
    command = cliArgs.splice(0, 1)[0];

    log.debug('new tasks = %o , command = %s, cliArgs = %o', tasks, command, cliArgs);
    yield runPlugin(command, cliArgs);
    return;
  }

  // ------------- 展示版本号, 并中止后面的任务 ---------------
  if (cliArgs.length === 0 && (argv.v || argv.version)) {
    yield showVersion(command);
    return;
  }

  // ------------- 执行前置任务 ---------------
  if (hasBeforeTask) {
    yield fieTask.run({
      tasks: tasks[command],
      args: [api.getApi(), {
        clientArgs: cliArgs,
        clientOptions: argv
      }],
      when: 'before',
      command
    });
  }


  // -------------- 执行套件任务 ---------------
  let toolkitName = fieConfig.exist() ? (fieConfig.get('toolkit') || fieConfig.get('toolkitName')) : '';
  let toolkitExist;
  let toolkit;
  if (toolkitName) {
    toolkitName = fieModule.toolkitFullName(toolkitName);
    toolkitExist = toolkitName ? (fieModule.localExist(toolkitName) || fieModule.onlineExist(toolkitName)) : false;
    toolkit = toolkitExist ? yield fieModule.get(toolkitName) : null;
  }

  // 如果判断到有套件且有对应命令的方法,那么直接执行并返回, 否则向下执行插件逻辑
  if (toolkit && toolkit[command]) {
    log.debug(`找到套件 ${toolkitName} 对应的 ${command} 方法`);
    fieObject = api.getApi(toolkitName);
    if (command === 'add') {
      cliArgs.type = cliArgs.length > 0 ? cliArgs[0] : '';
      cliArgs.name = cliArgs.length > 1 ? cliArgs[1] : '';
    }
    // 套件发送log
    log.debug(`套件 ${toolkitName} LOG开始发送...`);
    report.moduleUsage(fieModule.fullName(toolkitName));
    setEntryModule(toolkitName);
    const afterToolCommand = () => {
      // -------------- 执行后置任务 ---------------
      // next 是异步的方法, run 是 generator方法,所以需要用 co 包一层
      hasAfterTask && co(function* () {
        yield fieTask.run({
          tasks: tasks[command],
          args: [fieObject, cliArgs],
          when: 'after',
          command
        });
      }).catch((err) => {
        fieError.handle(err);
      });
    };
    yield fieTask.runFunction({
      method: toolkit[command],
      args: [
        fieObject,
        {
          clientArgs: cliArgs,
          clientOptions: argv,
          // 兼容未使用 generator 版本套件和插件
          callback: afterToolCommand
        },
        // 传入第三个参数 ,兼容未使用 generator 版本的套件和插件
        afterToolCommand],
      // fieTask 模块调用
      next: afterToolCommand
    });
    return;
  } else if (hasAfterTask) {
    log.debug('未找到对应的套件及方法');
    // 只有后置命令, 却没有套件模块的给个提示
    const msg = `未找到 ${command} 对应的套件命令,后置任务无法执行`;
    log.error(msg);
    report.error('plugin-not-found', msg);
    return;
  }

  // -------------- 执行插件任务 ---------------
  // 在已经执行了任务流的情况下,直接不执行插件逻辑
  if (!hasBeforeTask && !hasAfterTask) {
    log.debug('尝试执行插件方法');
    yield runPlugin(command, cliArgs);
  }
};
