/**
 * @desc fie配置文件(fie.config.js)读写等操作
 * @see ttp://fie.alibaba.net/doc?package=fie-config
 * @namespace fie-config
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const report = require('fie-report');
const log = require('fie-log')('core-config');
const astAnalyze = require('./ast-analyze');


// 先从环境变量里获取fie配置文件的目录，这样方便做调试
const CWD = process.cwd();


const fieConfig = {

  /**
   * 当前目录下是否存在fie.config.js文件
   * @param {string} dir 需要判断文件是否存在的目录,可选,默认取值:当前运行目录
   */
  exist(dir) {
    const cwd = dir || this.getConfigPath();
    const fieConfigPath = path.join(cwd, this.getConfigName());
    return fs.existsSync(fieConfigPath);
  },

  /**
   * 根据key获取fie.config.js的单个对象
   * @param key 配置的键名
   * @param dir 配置文件的路径
   * @return object
   */
  get(key, dir) {
    const cwd = dir || this.getConfigPath();
    const file = this.getAll(cwd);
    log.debug('key = %s ,all config = %o', key, file);

    return file ? file[key] : null;
  },

  /**
   * 获取整个fie.config.js文件的内容
   */
  getAll(dir) {
    const cwd = dir || this.getConfigPath();
    const configName = this.getConfigName();
    // 先判断文件是否存在,存在的话才读取
    if (!this.exist(cwd)) {
      return null;
    }
    // 直接使用require的话,会有缓存， 需要先删除 require 的缓存
    const configPath = path.join(cwd, configName);
    delete require.cache[configPath];
    try {
      const file = require(configPath);
      log.debug('get %s , file = %o', configName, file);
      return file;
    } catch (e) {
      log.error(`读取配置文件失败，请确认 ${configName} 文件是否有错误`);
      log.error('详细报错信息如下：');
      log.error(e && e.stack);
      report.error(e.code || 'config-error', e.stack || e, true);
      return process.exit(1);
    }
  },

  /**
   * 设置fie.config.js的属性值,写入相关内容
   * @param key fie.config.js中的key
   * @param value key对应的value
   * @param dir 配置文件路径
   */
  set(key, value, dir) {
    const cwd = dir || this.getConfigPath();
    const configName = this.getConfigName();
    const filePath = path.join(cwd, configName);
    // 读取文件
    const code = fs.readFileSync(filePath, 'utf8');
    const source = astAnalyze(code, key, value);
    log.debug('set %s file source string = %o', configName, source);
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
  },

  /**
   * 获取配置文件的名称
   * @returns {string|string}
   */
  getConfigName(){
    return process.env.FIE_CONFIG_FILE || 'fie.config.js';
  },

  /**
   * 获取config.js的文件路径
   */
  getConfigPath(){
    return process.env.FIE_CONFIG_PATH || CWD;
  }

};

/**
 * @exports fie-config
 */
module.exports = fieConfig;
