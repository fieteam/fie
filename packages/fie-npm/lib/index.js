'use strict';

const log = require('fie-log')('core-npm');
const spawn = require('cross-spawn');
const _ = require('lodash');
const dargs = require('dargs');
const request = require('co-request');
const fieEnv = require('fie-env');

/**
 * 根据内外网区分来获取npm地址
 * @returns {string}
 */
function getRegistry() {
  const isIntranet = fieEnv.isIntranet();
  const registry = isIntranet
    ? 'http://registry.npm.alibaba-inc.com/'
    : 'http://registry.npm.taobao.org/';
  log.debug(registry);
  return registry;
}

/**
 * 安装 npm 包
 * @param installer {string} 安装工具路径
 * @param paths {string|array} 需要安装的包或包列表,需要带版本号直接在包名后面 @ 版本号即可, 留空安装当前目录下的 package.json 依赖
 * @param options
 */
function* runInstall(installer, paths, options) {
  const registry = getRegistry();
  // npm默认值
  const option = _.defaults(options || {}, {
    registry,
    china: true,
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  // 云构建下，使用npminstall包，有时候会卡住装不上。
  // 还是使用云构建自带的tnpm版本进行安装吧。
  if (process.env.BUILD_ENV === 'cloud') {
    installer = 'tnpm';
    paths = ['ii'].concat(paths);
    delete option.registry;
    delete option.china;
  }

  log.debug('installer = %s', installer);

  // 将pkg进行扁平化
  if (!Array.isArray(paths) && paths) {
    paths = paths.split(' ') || [];
  }

  // TODO 确认一下是不是这样用法
  const args = paths.concat(
    dargs(option, {
      aliases: {
        S: '-save',
        D: '-save-dev',
        O: '-save-optional',
        E: '-save-exact',
      },
    })
  );
  log.debug('args = %o', args);
  log.debug('options = %o', option);
  return new Promise((resolve, reject) => {
    spawn(installer, args, option)
      .on('error', e => {
        reject(e);
      })
      .on('exit', err => {
        if (err) {
          reject(new Error(`install ${paths} error`));
        } else {
          resolve();
        }
      });
  });
}

module.exports = {
  /**
   * 安装 npm 包
   * @param pkg {string|array} 需要安装的包或包列表, 需要带版本号直接在包名后面 @ 版本号即可
   * @param options
   */
  *install(pkg, options) {
    const installer = require.resolve('npminstall/bin/install.js');

    yield runInstall(installer, pkg, options);
  },

  /**
   * 移除npm包
   */
  *unInstall(pkg, options) {
    const installer = require.resolve('npminstall/bin/uninstall.js');
    yield runInstall(installer, pkg, options);
  },

  /**
   * 安装package.json 中的依赖
   */
  *installDependencies(options) {
    const installer = require.resolve('npminstall/bin/install.js');
    yield runInstall(installer, [], options);
  },

  /**
   * 获取最新的包信息
   */
  *latest(name, options) {
    const registry = getRegistry();
    options = Object.assign(
      {},
      {
        registry,
        version: 'latest',
      },
      options
    );

    let body = null;
    try {
      const url = `${options.registry}${encodeURIComponent(name)}/${options.version}`;
      log.debug(`get ${name} url = %s`, url);
      const res = yield request(url);
      body = JSON.parse(res.body);
      if (body.error) {
        body = null;
      }
    } catch (e) {
      // 返回数据出错
      body = null;
    }
    return body;
  },

  /**
   * 是否存在模块
   * @param name
   */
  *has(name, options) {
    const registry = getRegistry();
    options = Object.assign(
      {},
      {
        registry,
      },
      options
    );
    const url = `${options.registry}${encodeURIComponent(name)}/latest`;
    log.debug('check module has =%s', url);
    const res = yield request({
      url: `${options.registry}${encodeURIComponent(name)}/latest`,
      method: 'HEAD',
    });
    return /4\d\d/.test(res.statusCode) === false;
  },
};
