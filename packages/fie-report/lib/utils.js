'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const fieHome = require('fie-home');
const debug = require('debug')('core-report');
const fieUser = require('fie-user');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const cache = require('fie-cache');

/**
 * 环境变量获取
 */
const cacheEnvGetter = {
  fieVersion() {
    return (
      process.env.FIE_VERSION ||
      execSync('npm view fie version')
        .toString()
        .replace(/[\nv]/g, '')
    );
  },
  email() {
    return fieUser.getEmail();
  },
  nodeVersion() {
    return execSync('node -v')
      .toString()
      .replace(/[\nv]/g, '');
  },
  npmVersion() {
    try {
      return execSync('npm -v')
        .toString()
        .replace('\n', '');
    } catch (e) {
      return null;
    }
  },
  tnpmVersion() {
    try {
      return execSync('tnpm -v')
        .toString()
        .split('\n')[0]
        .match(/\d+\.\d+\.\d+/)[0];
    } catch (ex) {
      // 外网无tnpm
      return null;
    }
  },
  system() {
    return `${os.platform()} ${os.release()}`;
  },
};

/**
 * 获取当前分支版本
 * @param cwd
 * @returns {string}
 */
exports.getCurBranch = function(cwd) {
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
 * @returns {*}
 */
exports.getProjectUrl = function() {
  let url;
  try {
    url = (
      spawn
        .sync('git', ['config', '--get', 'remote.origin.url'], { silent: true })
        .stdout.toString() || ''
    ).trim();
    // 有些git的url是http开头的，需要格式化为git@格式，方便统一处理
    const match = url.match(/http:\/\/gitlab.alibaba-inc.com\/(.*)/);
    if (match && match[1]) {
      url = `git@gitlab.alibaba-inc.com:${match[1]}`;
    }
  } catch (err) {
    debug('git config 错误：', err.message);
  }

  return url;
};

/**
 * 获取项目相关环境
 */
exports.getProjectInfo = function(cwd) {
  const branch = exports.getCurBranch(cwd);
  const pkgPath = path.join(cwd, 'package.json');
  const CONFIG_FILE = process.env.FIE_CONFIG_FILE || 'fie.config.js';
  const fiePath = path.join(cwd, CONFIG_FILE);
  // 这里不能使用fieConfig这个包，会循环引用
  let pkg;
  let fie;
  let repository = exports.getProjectUrl();
  // 判断pkg是否存在
  if (fs.existsSync(pkgPath)) {
    pkg = fs.readJsonSync(pkgPath, { throws: false });
  }
  // 判断fie.config.js是否存在
  if (fs.existsSync(fiePath)) {
    delete require.cache[fiePath];
    try {
      fie = require(fiePath);
    } catch (e) {
      fie = null;
    }
  }

  // 如果git中没有则尝试从pkg中获取
  if (pkg && pkg.repository && pkg.repository.url) {
    repository = pkg.repository.url;
  }

  return {
    cwd,
    branch,
    pkg,
    fie,
    repository,
  };
};

/**
 * 获取项目的环境信息
 * @param force 为true时 则获取实时信息，否则读取缓存
 * 对 tnpm, node 版本等重新获取,一般在报错的时候才传入 true
 * @returns {*}
 */
exports.getProjectEnv = function(force) {
  let cacheEnv = cache.get('reportEnvCache');

  if (!cacheEnv || force) {
    cacheEnv = {};
    const cacheEnvKeys = Object.keys(cacheEnvGetter);
    cacheEnvKeys.forEach(item => {
      cacheEnv[item] = cacheEnvGetter[item]();
    });
    // 缓存三天
    cache.set('reportEnvCache', cacheEnv, { expires: 259200000 });
  }
  return cacheEnv;
};

/**
 * 获取当前执行的命令,移除用户路径
 */
exports.getCommand = function(arg) {
  let argv = arg || process.argv;
  argv = argv.map(item => {
    const match = item.match(/\\bin\\(((?!bin).)*)$|\/bin\/(.*)/);

    // mac
    if (match && match[3]) {
      // 一般 node fie -v  这种方式则不需要显示 node
      return match[3] === 'node' ? '' : match[3];
    } else if (match && match[1]) {
      // 一般 node fie -v  这种方式则不需要显示 node
      return match[1] === 'node.exe' ? '' : match[1];
    } else if (!match && item.indexOf('node.exe') !== -1) {
      // fix如果C:\\node.exe 这种不带bin的路径
      // TODO 当然这里的正则可以再优化兼容一下
      return '';
    }

    return item;
  });
  return argv.join(' ').trim();
};

/**
 * 获取模块的类型和版本
 */
exports.getFieModuleVersion = function(mod) {
  const modPkgPath = path.join(fieHome.getModulesPath(), mod, 'package.json');
  let pkg = {};
  if (fs.existsSync(modPkgPath)) {
    pkg = fs.readJsonSync(modPkgPath, { throws: false }) || {};
  }

  return pkg.version;
};
