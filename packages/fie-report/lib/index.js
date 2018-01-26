/**
 * @desc 信息上报retcode
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 */

'use strict';

const debug = require('debug')('core-report');
const fieHome = require('fie-home');
const fieModuleName = require('fie-module-name');
const fieEnv = require('fie-env');
const utils = require('./utils');
const __WPO = require('./retcode/log-node');
const fieCliLog = require('./cli-log/index');

const cwd = process.cwd();
/**
 * 发送流程日志到FIE平台
 * @param {number} type 操作类型： 1为info，2为warn，3为error
 * @param {object} flowlog
 * @param {string} flowlog.command 命令串或工具名
 * @param {string} flowlog.message 消息
 * @param {number} flowlog.beginTime 执行开始, 格式Date.now()
 * @param {number} flowlog.endTime 执行结束时间, 格式Date.now()
 * @param {number} flowlog.status 操作状态
 */
const generateEntityAndSend = (type, flowlog, foces) => {
  const isIntranet = fieEnv.isIntranet();
  const project = utils.getProjectInfo(cwd);
  const env = utils.getProjectEnv(foces);
  const command = utils.getCommand();
  const map = {
    'fie-core-command': 1,
    'fie-module-use': 2,
    'fie-error': 3,
  };

  // log.debug(`当前项目信息 = %o`,project);
  // log.debug(`当前运行环境信息 = %o`,env);

  const defaultData = {
    userEmail: env.email,
    node: env.nodeVersion,
    fie: env.fieVersion,
    npm: env.npmVersion,
    tnpm: env.tnpmVersion,
    system: env.system,
    git: project.repository,
    branch: project.branch,
    command,
    content: Object.assign(
      {
        cwd: project.cwd,
        pkg: project.pkg,
        fie: project.fie,
      },
      flowlog.content
    ),
    type, // 操作类型
  };

  const data = Object.assign({}, defaultData, flowlog);

  debug('最终发送的数据 = %o', data);

  if (isIntranet) {
    debug('内网发送...');
    fieCliLog.send(data);
  } else {
    debug('外网发送...');
    let logMsg = '';
    Object.keys(data).forEach(key => {
      logMsg += `${key}=${JSON.stringify(data[key])}`;
    });
    __WPO.setConfig({ spmId: map[type] });
    __WPO.log(logMsg, 1);
  }
  return {
    success: true,
    data,
  };
};

/**
 * @exports fie-report
 */
module.exports = {
  /**
   * 根据核心命令发送日志(spmId: fie-core-command)
   */
  coreCommand() {
    return generateEntityAndSend(1, {});
  },

  /**
   * 根据模块名称发送日志
   * @param {string} name 模块名
   */
  moduleUsage(name) {
    const moduleVersion = utils.getFieModuleVersion(name);
    const moduleEntry = process.env[fieHome.getEntryModuleEnvName()];
    const toolkitPrefix = fieModuleName.toolkitPrefix();
    const pluginPrefix = fieModuleName.pluginPrefix();
    let data = {};
    // 是插件
    if (name.indexOf(pluginPrefix) !== -1) {
      data = {
        fiePluginName: name,
        fiePluginVersion: moduleVersion,
      };
    } else if (name.indexOf(toolkitPrefix) !== -1) {
      data = {
        fieToolkitName: name,
        fieToolKitVersion: moduleVersion,
      };
    }
    // TODO 判断如果名称一致的话，则不显示入口
    if (moduleEntry) {
      data.fieModuleEntry = moduleEntry;
    }

    return generateEntityAndSend(2, data);
  },

  /**
   * 发送错误日志
   * @param {string} type 错误类型
   * @param {object|string} err 信息
   * @param focus bool 是否重新获取系统相关信息而不是读缓存
   */
  error(type, err, focus) {
    return generateEntityAndSend(
      3,
      {
        errorType: type,
        error: err,
      },
      focus
    );
  },
};
