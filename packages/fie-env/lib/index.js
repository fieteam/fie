'use strict';

/**
 * @desc FIE的内外网环境获取与设置
 * @requires fie-env
 * @author 宇果 <baofen14787@gmail.com>
 * @namespace fie-env
 */
const debug = require('debug')('fie-env');
const home = require('fie-home');
const fs = require('fs-extra');
const path = require('path');

// fie env的配置文件
const FILE_ENV = 'fie.env.json';
let cacheEnv = null;


/**
 * 设置FIE的运行环境,设置成功后写入到FILE_ENV文件里
 * @param {('extranet'|'intranet')} env - 内外网环境变量,枚举可选的值有:extranet / intranet
 * @private
 */
function setEnv(env) {
  home.initHomeDir();
  const envFile = path.join(home.getHomePath(), FILE_ENV);
  const envData = {
    env
  };
  debug('set fie env data : %o', envData);
  debug('set fie to : %s', envFile);
  cacheEnv = null;
  fs.outputJsonSync(envFile, envData);
}

/**
 * @exports fie-env
 */
module.exports = {

  /**
   * 设置FIE的运行环境,设置成功后写入到FILE_ENV文件里
   * @param {('extranet'|'intranet')} env - 内外网环境变量,枚举可选的值有:extranet / intranet
   */
  setEnv,


  /**
   * 设置FIE的运行环境为外网环境
   */
  setExtranetEnv() {
    setEnv('extranet');
  },

  /**
   * 设置FIE的运行环境为内网环境
   */
  setIntranetEnv() {
    setEnv('intranet');
  },

  /**
   * 是否是内网环境
   * 优先判断process.env.FIE_ENV变量,值为intranet,则返回true
   * @returns {boolean} 若是公司内网,则返回true,否则为false
   */
  isIntranet() {
    // 如果有环境变量,则优先使用环境变量的值
    const fieEnvGlobal = process.env.FIE_ENV;
    if (fieEnvGlobal && fieEnvGlobal === 'intranet') {
      return true;
    } else if (fieEnvGlobal && fieEnvGlobal === 'extranet') {
      return false;
    }

    // 内外网判断
    // 由于该方法调用频繁,在这里使用一个cacheEnv对象做为缓存,避免频繁的IO操作
    let envData;
    if (cacheEnv) {
      envData = cacheEnv;
    } else {
      const envFile = path.join(home.getHomePath(), FILE_ENV);

      if (fs.existsSync(envFile)) {
        envData = fs.readJsonSync(envFile);
        cacheEnv = envData;
      }
    }
    // 注意: 若json文件不存在时,默认视为内网环境,向下兼容
    return !(envData && envData.env === 'extranet');
  },

  /**
   * 判断FIE环境配置文件(fie.env.json)是否存在
   * 可用做FIE环境是否已初始化的判断
   * @returns {boolean}
   */
  hasConfigFile() {
    const envFile = path.join(home.getHomePath(), FILE_ENV);
    return fs.existsSync(envFile);
  },

  /**
   * 删除FIE环境配置文件(fie.env.json)
   */
  removeConfigFile() {
    fs.removeSync(path.join(home.getHomePath(), FILE_ENV));
    cacheEnv = null;
  }

};
