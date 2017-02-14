/**
 * @desc 信息上报retcode
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 */

'use strict';

const execSync = require('child_process').execSync;
const log = require('fie-log')('fie-report');
const path = require('path');
const os = require('os');
const fieUser = require('fie-user');
const fieEnv = require('fie-env');
const cache = require('fie-cache');

const __WPO = require('./retcode/log-node');
const fieFlowLog = require('./flowlog');

let UserInfo = null;
const cacheEnv = {};


/**
 * 调用时再用git 生成用户信息,尽量减少无用执行
 */
const userInfoGetter = () => {
  if (!UserInfo) {
    UserInfo = fieUser.getUser();
  }
};

/**
 * 环境变量获取
 */
const cacheEnvGetter = {
  fieVersion() {
    let fv = cacheEnv.fieVersion;
    try {
      fv = execSync('fie -v').toString().replace('\n', '');
    } catch (e) {
      fv = '';
    }
    return fv;
  },
  name() {
    userInfoGetter();
    return UserInfo.name;
  },
  email() {
    userInfoGetter();
    return UserInfo.email;
  },
  nodeVersion() {
    return execSync('node -v').toString().replace('\n', '');
  },
  npmVersion() {
    return execSync('npm -v').toString().replace('\n', '');
  },
  tnpmVersion() {
    try {
      return execSync('tnpm -v').toString().split('\n')[0].match(/\d+\.\d+\.\d+/)[0];
    } catch (ex) {
      // 外网无tnpm
      return 'tnpm not install';
    }
  },
  system() {
    return `${os.platform()} ${os.release()}`;
  }
};

const getNetEnv = () => ({
  netEnv: fieEnv.isIntranet() ? 'intranet' : 'extranet'
});



/**
 * 获取项目相关环境
 */
const getProjectEnv = () => {
  const projectData = {
    cwd: process.cwd(),
    argv: encodeURIComponent(process.argv.join(' ')),
    branch: ""
  };

  try {
    const pkg = require(path.resolve(projectData.cwd, 'package.json'));
    projectData.project = pkg.name;
    projectData.repository = pkg.repository.url;
  } catch (e) {
    // no package.json
  }

  if(!projectData.repository){
      var regRem = /remote\.origin\.url=([^\n]+)/;
      var matchRem =  execSync('git info').toString().match(regRem);
      if (matchRem && matchRem.length > 1) {
          projectData.repository = matchRem[1];
      } 
  }

  try{
    const branchArray = execSync('git branch').toString().match(/\*\s+(.*)/);
    if(branchArray && branchArray.length > 1){
      projectData.branch = branchArray[1];
    }
  }
  catch(ex){
    console.log("get git branch err",ex);
  }
  return projectData;
};

/**
 * 获取上报所需的通用参数
 * @param force 为 true时, 对 tnpm, node 版本等重新获取,一般在报错的时候才传入 true
 * @returns {string}
 */
const getCommonData = (force, getJsonFormat) => {
  const commonDataStr = [];
  let commonData = Object.assign({}, getNetEnv(), getProjectEnv());
  let globalCacheEnv = cache.get('reportEnvCache');

  if (!globalCacheEnv || force) {
    globalCacheEnv = {};
    Object.keys(cacheEnvGetter).forEach((item) => {
      commonData[item] = cacheEnvGetter[item]();
      cacheEnv[item] = commonData[item];
    });
    // 缓存三天
    cache.set('reportEnvCache', globalCacheEnv, 259200000);
  } else {
    commonData = Object.assign({}, commonData, globalCacheEnv);
  }

  Object.keys(commonData).forEach((key) => {
    commonDataStr.push(`${key}=${commonData[key]}`);
  });

  if(getJsonFormat){
    return commonData;
  }
  else{
    return commonDataStr.join('&');
  }
};

/**
 *  发送流程日志到FIE平台
 * @param {number} type 操作类型： 1为info，2为warn，3为error
 * @param {object} flowlog
 * @param {string} flowlog.command 命令串或工具名
 * @param {string} flowlog.message 消息
 * @param {number} flowlog.beginTime 执行开始, 格式Date.now() 
 * @param {number} flowlog.endTime 执行结束时间, 格式Date.now() 
 * @param {number} flowlog.status 操作状态
*/
const generateEntityAndSend = (type, flowlog) => {
  //todo:字段验证判断
  let commonData = getCommonData(false, true);
  let flowLogEntiy = {
      git: commonData.repository,
      branch: commonData.branch,
      tool: flowlog.command.split(' ')[0],
      beginTime: flowlog.beginTime || Date.now(),
      endTime: flowlog.endTime || Date.now(),
      operator: commonData.name,
      status: flowlog.status || 1,// 1为操作成功 0 为操作失败
      command: flowlog.command,
      message: flowlog.message,
      type: type //操作类型： 1为info，2为warn，3为error
  }
  return fieFlowLog.send(flowLogEntiy);
}


const flowLog = {
  log: (logEntity) => {
    generateEntityAndSend(1, logEntity);
  },
  warn: (logEntity) => {
    generateEntityAndSend(2, logEntity);
  },
  error: (logEntity) => {
    generateEntityAndSend(3, logEntity);
  }
}

/**
 * @exports fie-report
 */
module.exports = {
  /* 向外暴露flowLog.log,flowLog.warn,flowLog.error 接口 */
  flowLog: flowLog,

  /**
   * 根据核心命令发送日志(spmId: fie-core-command)
   * @param {string} command 命令串
   */
  coreCommand(command) {
    __WPO.setConfig({ spmId: 'fie-core-command' });
    const logMsg = `command=${command}&${getCommonData()}`;
    log.debug('发送日志(coreCommand): %s', logMsg);
    __WPO.log(logMsg, 1);

    flowLog.log({ command: command, message: logMsg });
    return {
      success: true,
      msg: logMsg
    };
  },

  /**
   * 根据模块名称发送retcode日志(spmId: fie-module-use)
   * @param {string} command 命令串
   */
  moduleUsage(name) {
    __WPO.setConfig({ spmId: 'fie-module-use' });
    const logMsg = `moduleName=${name}&${getCommonData()}`;
    log.debug('发送日志(moduleUsage): %s', logMsg);
    __WPO.log(logMsg, 1);

    flowLog.log({ command: name, message: logMsg });
    return {
      success: true,
      msg: logMsg
    };
  },

  /**
   * 自定义retcode发送日志 (spmId: fie-error)
   * @param {string} type 错误类型
   * @param {object|string} error 信息
   */
  error(type, err) {
    if (typeof err === 'object') {
      err = JSON.stringify(err);
    } else if (typeof err !== 'string') {
      err = err.toString();
    }
    __WPO.setConfig({ spmId: 'fie-error' });
    const logMsg = `type=${type}&err=${err}&${getCommonData(true)}`;
    log.debug('发送日志(error): %s', logMsg);
    __WPO.log(logMsg, 1);

    flowLog.error({ command: type, message: logMsg});
    return {
      success: true,
      msg: logMsg
    };
  }
};
