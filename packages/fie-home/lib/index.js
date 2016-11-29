/**
 * @desc 获取fie及模块的相关路径，不建议插件直接对 fie 家目录里面的内容直接进行操作
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-home
 */

'use strict';

const debug = require('debug')('fie-home');
const path = require('path');
const fs = require('fs-extra');
const userHome = require('os-homedir')();



/**
 * @exports fie-home
 */
const fieHome = {

  /**
   * 获取FIE的home路径
   * @returns {string} 返回路径字符串
   */
  getHomePath() {
    const home = path.resolve(process.env.FIE_HOME || userHome, '.fie');
    debug('fie home = %s', home);
    return home;
  },

  /**
   * 获取FIE模块的安装路径
   * @returns {string} 返回路径字符串
   */
  getModulesPath() {
    const fiePath = fieHome.getHomePath();
    const modulesPath = path.resolve(fiePath, 'node_modules');
    debug('fie module path = %s', modulesPath);
    return modulesPath;
  },

  /**
   * 初始化FIE的home目录
   */
  initHomeDir: () => {
    const fiePath = fieHome.getHomePath();
    if (!fs.existsSync(fiePath)) {
      fs.mkdirsSync(fiePath);
    }
  },

  /**
   * 清理Home目录内容
   * 用户手工删除是没影响的，fie 会验证并初始化
   */
  cleanHomeDir: () => {
    const fieModulesPath = fieHome.getModulesPath();
    if (fs.existsSync(fieModulesPath)) {
      debug('remove fie modules path = %s', fieModulesPath);
      fs.removeSync(fieModulesPath);
    }
  }

};

module.exports = fieHome;
