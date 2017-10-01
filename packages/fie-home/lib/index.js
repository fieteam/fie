/**
 * @desc 获取fie及模块的相关路径，不建议插件直接对 fie 家目录里面的内容直接进行操作
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-home
 */

'use strict';

const debug = require('debug')('core-home');
const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const rimraf = require('rimraf');
const home = require('os-homedir')();

let userHomeFolder;
let userHome;
/**
 * @exports fie-home
 */
const fieHome = {

  /**
   * 获取FIE的home路径
   * FIE_HOME_FOLDER 作用：可以自定义fie的核心目录，方便开发第三方cli工具进行定制
   * FIE_HOME 作用：方便单元测试时更改目录结构
   * @returns {string} 返回路径字符串
   */
  getHomePath() {
    userHomeFolder = process.env.FIE_HOME_FOLDER || '.fie';
    userHome = process.env.FIE_HOME || home;
    const homePath = path.resolve(userHome, userHomeFolder);
    debug('fie home = %s', homePath);
    return homePath;
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
    //缓存home信息到env里面
    if(!process.env.FIE_HOME_FOLDER){
      process.env.FIE_HOME_FOLDER = userHomeFolder;
    }
    if(!process.env.FIE_HOME){
      process.env.FIE_HOME = userHome;
    }
  },

  /**
   * 清理Home目录内容
   * 用户手工删除是没影响的，fie 会验证并初始化
   */
  cleanHomeDir: () => {
    const fieHomePath = fieHome.getHomePath();
    const fieModulesPath = fieHome.getModulesPath();
    if (fs.existsSync(fieModulesPath)) {
      debug('remove fie modules path = %s', fieModulesPath);
      // 清除fie.*.json的配置文件
      const paths = globby.sync([
        `${fieHomePath}/fie.*.json`
      ]);
      debug('clear fie.*.json = %o', paths);
      paths.forEach((item) => {
        fs.removeSync(item);
      });
      // TODO windows下可能存在路径过长无法清除的情况，报错后则直接改个文件夹名字
      rimraf.sync(fieModulesPath);
    }
  },

  /**
   *
   */
  getEntryModuleEnvName() {
    return 'FIE_ENTRY_MODULE';
  }
};

module.exports = fieHome;
