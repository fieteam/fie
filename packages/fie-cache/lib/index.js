/**
 * @desc 缓存模块
 * @see http://fie.alibaba.net/doc?package=fie-cache
 * @author 擎空 <zernmal@foxmail.com>
 * @namespace fie-cache
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const home = require('fie-home');

const cacheFile = path.resolve(home.getHomePath(), 'fie.cache.json');


/**
 * @exports fie-cache
 */
module.exports = {
  /**
   * 获取缓存内容,如果不存在或已过期则返回 null
   * @param {string} key 缓存的键
   * @returns {mix}
   */
  get(key) {
    if (!key || !fs.existsSync(cacheFile)) {
      return null;
    }
    const data = fs.readJsonSync(cacheFile);

    // 有效期判断
    if (data.__expires && data.__expires[key]) {
      if (data.__expires[key] < Date.now()) {
        return null;
      }
    }
    return data[key];
  },

  /**
   * 设置缓存内容
   * @param key {string} 缓存的键
   * @param value {mix} 缓存的值
   * @param options {object}
   * @param options.expires {number} 有效时长,毫秒为单位, 如 1分钟为 360000
   * @returns {boolean}
   */
  set(key, value, options) {
    if (!key) {
      return false;
    }

    options = Object.assign({}, {
      expires: null
    }, options);

    let data = {};
    if (fs.existsSync(cacheFile)) {
      data = fs.readJsonSync(cacheFile);
    }

    // 有效期处理
    data.__expires = data.__expires || {};
    if (options.expires) {
      data.__expires[key] = Date.now() + options.expires;
    } else {
      data.__expires[key] = null;
    }

    data[key] = value;

    fs.outputJsonSync(cacheFile, data);
    return true;
  },

  /**
   * 清除所有的缓存
   */
  clear() {
    fs.removeSync(cacheFile);
  }
};
