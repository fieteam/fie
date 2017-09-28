'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const npm = require('fie-npm');
const semver = require('semver');
const cache = require('fie-cache');
const log = require('fie-log')('fie-up');

const TIP_CACHE_KEY = '__fieVersionTip';




module.exports = {

  /**
   * 获取所有的FIE_相关的运行时变量
   */
  get : function () {

  },

  /**
   * 设置运行时变量
   * 将变量全部缓存于process.env里，方便其他fie模块进行调用
   */
  set : function (obj) {
    //一些默认值
    const defaultConfig = {
      "FIE_HOME_FOLDER" : ".fie",
      "FIE_CONFIG_FILE" : "fie.config.js"
    };
    //注意she的时候，需要将所有key大写，符合FIE规范
    Object.keys(obj).forEach(function (key) {
      process.env[key] = obj[key]
    })
  }

};
