'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const fieHome = require('fie-home');
const debug = require('debug')('fie-report');
const ini = require('ini');
const fieUser = require('fie-user');
const execSync = require('child_process').execSync;
const cache = require('fie-cache');

/**
 * 环境变量获取
 */
const cacheEnvGetter = {
  fieVersion() {
    return process.env.FIE_VERSION || execSync('npm view fie version').toString().replace(/[\nv]/g, '');
  },
  email() {
    return fieUser.getEmail();
  },
  nodeVersion() {
    return execSync('node -v').toString().replace(/[\nv]/g, '');
  },
  npmVersion() {
    return execSync('npm -v').toString().replace('\n', '');
  },
  tnpmVersion() {
    try {
      return execSync('tnpm -v').toString().split('\n')[0].match(/\d+\.\d+\.\d+/)[0];
    } catch (ex) {
      // 外网无tnpm
      return null;
    }
  },
  system() {
    return `${os.platform()} ${os.release()}`;
  }
};

/**
 * 获取当前分支版本
 * @param cwd
 * @returns {string}
 */
exports.getCurBranch = function (cwd) {
  const headerFile = path.join(cwd, '.git/HEAD');
  let version = '';
  if (fs.existsSync(headerFile)) {
    const gitVersion = fs.readFileSync(headerFile, { encoding: 'utf8' });
    const arr = gitVersion.split(/refs[\\\/]heads[\\\/]/g);
    if (arr && arr.length > 1) {
      version = arr[1];
    }
  }
  return version.trim();
};


/**
 * 获取项目URL
 * @param cwd
 * @returns {*}
 */
exports.getProjectUrl = function (cwd) {
  // TODO 是否需要考虑在项目子目录执行命令的情况？
  const gitLocalPath = path.join(cwd, '.git/config');
  let url;
  if (fs.existsSync(gitLocalPath)) {
    try {
      const gitLocalConfig = ini.parse(fs.readFileSync(gitLocalPath, 'utf-8'));
      url = (gitLocalConfig['remote "origin"'] || {}).url;
    } catch (err) {
      debug('git config 错误：', err.message);
    }
  }
  return url;
};

/**
 * 获取项目相关环境
 */
exports.getProjectInfo = function (cwd) {
  const branch = exports.getCurBranch(cwd);
  const pkgPath = path.join(cwd, 'package.json');
  let pkg;
  // 判断pkg是否存在
  if (fs.existsSync(pkgPath)) {
    pkg = fs.readJsonSync(path.join(cwd, 'package.json'), { throws: false });
  }
  const info = {
    cwd,
    branch,
    pkg,
    repository: ''
  };

  // 分支存在 则可继续获取git地址
  if (branch) {
    info.repository = exports.getProjectUrl(cwd);
  }

  return info;
};

/**
 * 获取项目的环境信息
 * @param force 为true时 则获取实时信息，否则读取缓存
 * 对 tnpm, node 版本等重新获取,一般在报错的时候才传入 true
 * @returns {*}
 */
exports.getProjectEnv = function (force) {
  let cacheEnv = cache.get('reportEnvCache');

  if (!cacheEnv || force) {
    cacheEnv = {};
    const cacheEnvKeys = Object.keys(cacheEnvGetter);
    cacheEnvKeys.forEach((item) => {
      cacheEnv[item] = cacheEnvGetter[item]();
    });
    // 缓存三天
    // TODO expires 错别字需要改
    cache.set('reportEnvCache', cacheEnv, { expires: 259200000 });
  }
  return cacheEnv;
};

/**
 * 获取当前执行的命令,移除用户路径
 */
exports.getCommand = function () {
  let argv = process.argv;
  argv = argv.map((item) => {
    const match = item.match(/\\bin\\(.*)|\/bin\/(.*)/);
    if (match && match[2]) {
      // 一般 node fie -v  这种方式则不需要显示 node
      if (match[2] === 'node') {
        return '';
      }
      return match[2];
    }
    return item;
  });
  return argv.join(' ').trim();
};

/**
 * 获取模块的类型和版本
 */
exports.getFieModuleVersion = function (mod) {
  const modPkgPath = path.join(fieHome.getModulesPath(), mod, 'package.json');
  let pkg = {};
  if (fs.existsSync(modPkgPath)) {
    pkg = fs.readJsonSync(modPkgPath, { throws: false }) || {};
  }

  return pkg.version;
};
