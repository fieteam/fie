/**
 *
 * 所有的套件/插件都走这个命令
 * 自定义prefix 本地套件/插件 -> FIE本地套件/插件 -> 自定义线上套件/插件 -> FIE线上套件/插件
 *
 */

'use strict';

const co = require('co');
const log = require('fie-log')('core-commands');
const fieTask = require('fie-task');
const fieConfig = require('fie-config');
const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const fieError = require('fie-error');
const api = require('fie-api/lib/old-api');
const fieHome = require('fie-home');
const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const report = require('fie-report');
const Intl = require('fie-intl');
const message = require('../locale/index');

let fieObject;
const clientOptions = Object.assign({}, argv);

function setEntryModule(name) {
  process.env[fieHome.getEntryModuleEnvName()] = name.replace('@ali/', '');
}

/**
 * 获取fie的实际命令
 * @returns {*|string}
 */
function getFieBin() {
  return process.env.FIE_BIN || 'fie';
}

/**
 * 运行插件命令
 * 运行逻辑：自定义本地插件 -> FIE本地插件 -> 自定义线上插件 -> FIE线上插件
 * 先走本地已安装，速度快一些
 * @param name
 * @param cliArgs
 */
function* runPlugin(name, cliArgs) {
  const module = yield fieModule.getReallyName(`plugin-${name}`);
  const intl = new Intl(message);
  if (module.exist) {
    setEntryModule(module.reallyName);
    const plugin = yield fieModule.get(module.reallyName);
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
      const msg = `未找到 ${module.reallyName} 插件对应的命令 ${pluginCmd}`;
      log.error(msg);
      report.error(module.reallyName, msg);
      return;
    }

    const optionsArg = { clientArgs: cliArgs, clientOptions };
    fieObject = api.getApi(module.reallyName);

    yield fieTask.runFunction({
      method,
      args: method.length > 1 ? [fieObject, optionsArg] : [Object.assign({}, fieObject, optionsArg)]
    });
  } else {
    const msg = intl.get('pluginNotFound', { plugin: module.fullName() });
    log.error(msg);
    report.error(module.fullName, msg);
  }
}

/**
 * 展示本地版本号，显示查找逻辑：自定义prefix本地模块 -> FIE本地模块
 * break: 2.x版本的逻辑是若本地没有模块则显示线上版本模块的逻辑，而3.x的逻辑是显示本地模块的逻辑
 */
function* showVersion(name) {
  let existsOne = false;
  const intl = new Intl(message);
  const logOne = function* (n) {
    n = fieModuleName.fullName(n);
    const prefix = fieModuleName.prefix();
    const localExist = fieModule.localExist(n);
    let mod = '';

    if (localExist) {
      mod = fs.readJsonSync(path.resolve(fieHome.getModulesPath(), n, 'package.json'), { throws: false });
    } else if (prefix !== 'fie') {
      n = n.replace(prefix, 'fie');
      mod = fs.readJsonSync(path.resolve(fieHome.getModulesPath(), n, 'package.json'), { throws: false });
    }
    if (mod && mod.version) {
      existsOne = true;
      console.log(chalk.magenta(intl.get('moduleVersion', { module: n, version: mod.version })));
    }
  };
  if (name.indexOf('toolkit-') > -1 || name.indexOf('plugin-') > -1) {
    yield logOne(name);
    return;
  }

  yield logOne(`toolkit-${name}`);
  yield logOne(`plugin-${name}`);

  if (!existsOne) {
    const msg = intl.get('localNotFound', { name });
    log.error(msg);
    report.error('plugin-not-found', msg);
  }
}


/**
 * 当遇到 start , build 命令时,判断用户是否在正确的目录
 * @param command
 * @returns {boolean}
 */
function isErrorDirectory(command) {
  const intl = new Intl(message);
  // 如果当前目录下不存在fie.config.js 则提示
  if (['start', 'build'].indexOf(command) !== -1 && !fieConfig.exist()) {
    log.debug('error directory');
    log.error(intl.get('configFileNotFound', { file: fieConfig.getConfigName() }));
    return false;
  }
  return true;
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
  const intl = new Intl(message);
  log.debug(' tasks = %o , command = %s, cliArgs = %o', tasks, command, cliArgs);
  log.debug(`before task ${hasBeforeTask}`);

  // 去掉 clientOptions 里面多余的字段
  delete clientOptions._;
  delete clientOptions.$0;

  // 错误提示提前判断

  if (!isErrorDirectory(command)) {
    return;
  }

  // 如果第一个参数为 plugin, 强制执行某个插件, 并且忽略所有的前置,后置任务
  if (command === 'plugin') {
    if (cliArgs.length < 1) {
      log.error(intl.get('runPlugin'));
      return;
    }
    command = cliArgs.splice(0, 1)[0];

    log.debug('new tasks = %o , command = %s, cliArgs = %o', tasks, command, cliArgs);
    yield runPlugin(command, cliArgs);
    return;
  }

  // ------------- 展示版本号, 并中止后面的任务 ---------------
  if (cliArgs && cliArgs.length === 0 && (clientOptions.v || clientOptions.version)) {
    yield showVersion(command);
    return;
  }

  // ------------- 执行前置任务 ---------------
  if (hasBeforeTask) {
    // 目前推荐只传一个 options 参数， 第一个参数 merge fieObject 及仍传第二个参数，是用于向下兼容

    const optionsArg = {
      clientArgs: cliArgs,
      clientOptions
    };

    yield fieTask.run({
      tasks: tasks[command],
      args: [Object.assign({}, api.getApi(), optionsArg), optionsArg],
      when: 'before',
      command
    });
  }


  // -------------- 执行套件任务 ---------------
  let toolkitName = fieConfig.exist() ? (fieConfig.get('toolkit') || fieConfig.get('toolkitName')) : '';
  let toolkitExist;
  let toolkit;
  if (toolkitName) {
    toolkitName = fieModuleName.toolkitFullName(toolkitName);
    toolkitExist = toolkitName ? (fieModule.localExist(toolkitName) || fieModule.onlineExist(toolkitName)) : false;
    toolkit = toolkitExist ? yield fieModule.get(toolkitName) : null;
  }

  // 如果判断到有套件且有对应命令的方法,那么直接执行并返回, 否则向下执行插件逻辑

  if (toolkit && toolkit[command]) {
    log.debug(`找到套件 ${toolkitName} 对应的 ${command} 方法`);
    fieObject = api.getApi(toolkitName);
    // 历史遗留问题，对 add 命令进行特殊处理
    if (command === 'add') {
      cliArgs.type = cliArgs.length > 0 ? cliArgs[0] : '';
      cliArgs.name = cliArgs.length > 1 ? cliArgs[1] : '';
    }
    // 套件发送log
    log.debug(`套件 ${toolkitName} LOG开始发送...`);
    report.moduleUsage(fieModuleName.fullName(toolkitName));
    setEntryModule(toolkitName);
    const afterToolCommand = () => {
      // -------------- 执行后置任务 ---------------
      // next 是异步的方法, run 是 generator方法,所以需要用 co 包一层
      hasAfterTask && co(function* () {
        // 目前推荐只传一个 options 参数， 第一个参数 merge fieObject 及仍传第二个参数，是用于向下兼容
        const optionsArg = {
          clientArgs: cliArgs,
          clientOptions
        };
        yield fieTask.run({
          tasks: tasks[command],
          args: [Object.assign({}, fieObject, optionsArg), optionsArg],
          when: 'after',
          command
        });
      }).catch((err) => {
        fieError.handle(err);
      });
    };

    // 传入 callback ,兼容未使用 generator 版本套件和插件
    // 目前推荐只传一个 options 参数， 第一个参数 merge fieObject 及仍传第二个参数，是用于向下兼容
    const optionsArg = { clientArgs: cliArgs, clientOptions, callback: afterToolCommand };
    yield fieTask.runFunction({
      method: toolkit[command],
      args: toolkit[command].length > 1 ? [fieObject, optionsArg, afterToolCommand] : [Object.assign({}, fieObject, optionsArg)],
      // fieTask 模块调用
      next: afterToolCommand
    });
    return;
  } else if (hasAfterTask) {
    log.debug('未找到对应的套件及方法');
    // 只有后置命令, 却没有套件模块的给个提示
    const msg = intl.get('notRunTips', { command });
    log.error(msg);
    report.error('plugin-not-found', msg);
    return;
  }

  // start build 错误提示
  if (['start', 'build'].indexOf(command) !== -1) {
    if (toolkit) {
      const tool = getFieBin();
      log.error(intl.get('startNotRunTips', { command, tool }));
    } else {
      // 存在fie.config.js文件且文件中有对应的 start、build、publish时则不需要提示
      if (!(hasBeforeTask || hasAfterTask)) {
        log.error(intl.get('configNotRunTips', { file: fieConfig.getConfigName(), command }));
      }
    }
    return;
  }

  // -------------- 执行插件任务 ---------------
  // 在已经执行了任务流的情况下,直接不执行插件逻辑
  if (!hasBeforeTask && !hasAfterTask) {
    log.debug('尝试执行插件方法');
    yield runPlugin(command, cliArgs);
  }
};
