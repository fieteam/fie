/**
 * @desc 信息上报retcode
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 */

'use strict';

const execSync = require('child_process').execSync;
const path = require('path');
const os = require('os');
const fieUser = require('fie-user');
const fieEnv = require('fie-env');
const cache = require('fie-cache');

const __WPO = require('./retcode/log-node');


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
    argv: encodeURIComponent(process.argv.join(' '))
  };

  try {
    const pkg = require(path.resolve(projectData.cwd, 'package.json'));
    projectData.project = pkg.name;
    projectData.repository = pkg.repository.url;
  } catch (e) {
    // no package.json
  }
  return projectData;
};

/**
 * 获取上报所需的通用参数
 * @param force 为 true时, 对 tnpm, node 版本等重新获取,一般在报错的时候才传入 true
 * @returns {string}
 */
const getCommonData = (force) => {
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

  return commonDataStr.join('&');
};

/**
 * @exports fie-report
 */
module.exports = {

  /**
   * 根据核心命令发送日志(spmId: fie-core-command)
   * @param {string} command 命令串
   */

  coreCommand(command) {
    __WPO.setConfig({ spmId: 'fie-core-command' });
    const logMsg = `command=${command}&${getCommonData()}`;
    __WPO.log(logMsg, 1);
    return {
      success: true,
      logMsg
    };
  },

  /**
   * 根据模块名称发送retcode日志(spmId: fie-module-use)
   * @param {string} command 命令串
   */
  moduleUsage(name) {
    __WPO.setConfig({ spmId: 'fie-module-use' });

    const logMsg = `moduleName=${name}&${getCommonData()}`;
    __WPO.log(logMsg, 1);
    return {
      success: true,
      logMsg
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
    __WPO.log(logMsg, 1);
    return {
      success: true,
      logMsg
    };
  }
};
