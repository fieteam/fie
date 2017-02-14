/**
 * @desc fie配置文件(fie.config.js)读写等操作
 * @see ttp://fie.alibaba.net/doc?package=fie-config
 * @namespace fie-config
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const debug = require('debug')('fie-config');
const astAnalyze = require('./ast-analyze');

// fie配置文件
const CONFIG_FILE = 'fie.config.js';
const CWD = process.cwd();


const fieConfig = {

  /**
   * 当前目录下是否存在fie.config.js文件
   * @param {string} dir 需要判断文件是否存在的目录,可选,默认取值:
   */
  exist(dir) {
    const cwd = dir || CWD;
    const fieConfigPath = path.join(cwd, CONFIG_FILE);
    return fs.existsSync(fieConfigPath);
  },

  /**
   * 根据key获取fie.config.js的单个对象
   * @param key 配置的键名
   * @param dir 配置文件的路径
   * @return object
   */
  get(key, dir) {
    const cwd = dir || CWD;
    const file = this.getAll(cwd);
    debug('key = %s ,all config = %o', key, file);

    return file ? file[key] : null;
  },

  /**
   * 获取整个fie.config.js文件的内容
   */
  getAll(dir) {
    const cwd = dir || CWD;
    // 先判断文件是否存在,存在的话才读取
    if (!this.exist(cwd)) {
      return null;
    }
    // 直接使用require的话,会有缓存， 需要先删除 require 的缓存
    const configPath = path.join(cwd, CONFIG_FILE);
    delete require.cache[configPath];
    const file = require(configPath);
    debug('get %s , file = %o', CONFIG_FILE, file);
    return file;
  },

  /**
   * 设置fie.config.js的属性值,写入相关内容
   * @param key fie.config.js中的key
   * @param value key对应的value
   * @param dir 配置文件路径
   */
  set(key, value, dir) {
    const cwd = dir || CWD;
    const filePath = path.join(cwd, CONFIG_FILE);
    // 读取文件
    const code = fs.readFileSync(filePath, 'utf8');
    const source = astAnalyze(code, key, value);
    debug('set %s file source string = %o', CONFIG_FILE, source);
    fs.writeFileSync(filePath, source);
    return true;
  },

  /**
   * 获取套件的名字
   */
  getToolkitName(dir) {
    const cwd = dir || CWD;
    const config = this.getAll(cwd);
    if (!config) {
      return null;
    }
    if (config.toolkit) {
      return config.toolkit;
    } else if (config.toolkitName) {
      return config.toolkitName;
    }
    return null;
  }

};

/**
 * @exports fie-config
 */
module.exports = fieConfig;
