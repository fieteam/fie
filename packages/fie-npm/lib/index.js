'use strict';

const debug = require('debug')('fie-npm');
const _ = require('lodash');
const request = require('co-request');
const fieEnv = require('fie-env');
const npminstall = require('npminstall');


const isIntranet = fieEnv.isIntranet();
const registry = isIntranet ? 'http://registry.npm.alibaba-inc.com/' : 'http://registry.npm.taobao.org/';

/**
 * 安装包
 * @param pkg {array} 需要安装的包列表, [{name: 'foo', version: '~1.0.0' }], 为空则安装 package.json 依赖
 * @param options
 */
function* runInstall(options) {
  debug('options = %o', options);
  options.root = options.cwd;
  options = _.defaults(options || {}, {
    registry,
    root: process.cwd()
  });

  yield npminstall(options);
}

module.exports = {

  /**
   * 安装npm 包
   * @param pkg {string}
   * @param options
   */
  * install(pkg, options) {
    options.pkgs = [{
      name: pkg
    }];
    yield runInstall(options);
  },

  /**
   * 移除npm包
   */
  * unInstall(pkg, options) {
    options.pkgs = [{
      name: pkg
    }];
    yield runInstall(options);
  },

  /**
   * 安装package.json 中的依赖
   */
  * installDependencies(options) {
    yield runInstall(options);
  },

  /**
   * 获取最新的包信息
   */
  * latest(name, options) {
    options = Object.assign({}, {
      registry
    }, options);

    let body = null;
    try {
      const res = yield request(`${options.registry}${encodeURIComponent(name)}/latest`);
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
  * has(name, options) {
    options = Object.assign({}, {
      registry
    }, options);
    const url = `${options.registry}${encodeURIComponent(name)}/latest`;
    debug('check module has =%s', url);
    const res = yield request({
      url: `${options.registry}${encodeURIComponent(name)}/latest`,
      method: 'HEAD'
    });
    return /4\d\d/.test(res.statusCode) === false;
  }


};
