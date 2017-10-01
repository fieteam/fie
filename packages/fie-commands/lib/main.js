/**
 *
 * 所有的套件/插件都走这个命令
 */

'use strict';

const co = require('co');
const log = require('fie-log')('core-commands');
const fieTask = require('fie-task');
const fieConfig = require('fie-config');
const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const fieError = require('fie-error');
const fieNpm = require('fie-npm');
const api = require('fie-api/lib/old-api');
const fieHome = require('fie-home');
const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const report = require('fie-report');

let fieObject;
const clientOptions = Object.assign({}, argv);

function setEntryModule(name) {
  process.env[fieHome.getEntryModuleEnvName()] = name.replace('@ali/', '');
}
/**
 * 运行插件命令
 * @param name
 * @param cliArgs
 */
function* runPlugin(name, cliArgs) {
  name = fieModuleName.pluginFullName(name);
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

    const optionsArg = { clientArgs: cliArgs, clientOptions };
    yield fieTask.runFunction({
      method,
      args: method.length > 1 ? [fieObject, optionsArg] : [Object.assign({}, fieObject, optionsArg)]
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
    n = fieModuleName.fullName(n);
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
 * 当遇到 start , build 命令时,判断用户是否在正确的目录
 * @param command
 * @returns {boolean}
 */
function isErrorDirectory(command) {
  // 如果当前目录下不存在fie.config.js 则提示
  if (['start', 'build'].indexOf(command) !== -1 && !fieConfig.exist()) {
    log.debug('error directory');
    log.error(`未检测到 ${fieConfig.getConfigName()} 文件, 请确认当前命令是否在项目根目录下执行`);
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
      log.error('请输入您要运行的插件名');
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
    const msg = `未找到 ${command} 对应的套件命令,后置任务无法执行`;
    log.error(msg);
    report.error('plugin-not-found', msg);
    return;
  }

  // start build 错误提示
  if (['start', 'build'].indexOf(command) !== -1) {
    if (toolkit) {
      log.error(`该套件尚未实现 ${command} 命令，请检查拼写是否正确或执行 fie -h 查看可用命令`);
    } else {
      // 存在fie.config.js文件且文件中有对应的 start、build、publish时则不需要提示
      if (!(hasBeforeTask || hasAfterTask)) {
        log.error(`${fieConfig.getConfigName()} 文件中尚不存在 ${command} 命令，请检查拼写是否正确`);
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
