/**
 * @desc fie对 所有套件和插件 选择性透出的数据/API 都在这里, 这里的透出应该是不因为套件或插件不同而改变
 * @author 六韬 <yubhbh@gmail.com>
 */

'use strict';

const open = require('open');
const inquirer = require('inquirer');
const co = require('co');
const fieLog = require('fie-log');
const fieModule = require('fie-module');
const home = require('fie-home');
const config = require('fie-config');
const npm = require('fie-npm');
const report = require('fie-report');
const fs = require('fie-fs');
const argv = require('yargs').argv;


const apiList = {
  /**
   * 是否在控制台调用
   * @param {string} currentModuleName  如 @ali@fie-plugin-git,@ali@fie-toolkit-next
   * @returns {boolean}
   */
  isCallByConsole(currentModule) {
    return this.moduleName === fieModule.fullName(currentModule);
  },

  getFieModule(name, cb) {
    return new Promise((resolve, reject) => {
      co(function* () {
        const mod = yield fieModule.get(name);
        const pkg = yield fieModule.get(`${name}/package.json`);
        typeof cb === 'function' && cb(null, mod, pkg);
        resolve(moduleInfo);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  tnpmInstall(options, cb) {
    return new Promise((resolve, reject) => {
      co(function* () {
        if (typeof options === 'function') {
          cb = options;
          options = {};
        }
        options = options || {};
        if (options.name) {
          yield npm.install(options.name, options);
        } else {
          yield npm.installDependencies(options);
        }
        typeof cb === 'function' && cb(null);
        resolve();
      }).catch(err => reject(err));
    });
  },

  getModuleConfig(key) {
    key = key || 'toolkitConfig';
    return Object.assign({}, argv, config.get(key));
  },

  setModuleConfig: config.set,

  dirCopy: fs.copyDirectory,

  fileCopy: fs.copyTpl,

  fileRewrite: fs.rewriteFile,

  getFieModulesPath: home.getModulesPath,

  report,

  open,

  inquirer
};

module.exports = {
  getApi(moduleName) {
    // API透出前预处理
    moduleName = moduleName && fieModule.fullName(moduleName);
    if (!moduleName) {
      moduleName = 'fie-core';
    } else {
      moduleName = moduleName
        .replace('@ali/', '');
    }

    const log = fieLog(moduleName);
    apiList.logInfo = log.info;
    apiList.logError = log.error;
    apiList.logWarn = log.warn;
    apiList.logSuccess = log.success;
    apiList.logDebug = log.debug;

    return apiList;
  }
};

