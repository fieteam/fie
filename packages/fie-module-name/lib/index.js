/**
 * 获取模块名字的相关信息，和 前缀
 */

'use strict';

const env = require('fie-env');

const utils = {

  /**
   * 获取模块的前缀
   * @returns {string|string}
   */
  prefix() {
    return process.env.FIE_MODULE_PREFIX || 'fie';
  },


  /**
   * 获取套件的前缀
   */
  toolkitPrefix() {
    const prefix = utils.prefix();
    return `${prefix}-toolkit-`;
  },

  /**
   * 获取插件的前缀
   */
  pluginPrefix() {
    const prefix = utils.prefix();
    return `${prefix}-plugin-`;
  },

  /**
   * 获取套件模块完整名字
   * @param name 可传入的参数可能是：xxx,toolkit-xxx,@ali/fie-toolkit-xxx
   * @returns {string}
   */
  toolkitFullName(name) {
    let full = '';
    const prefix = utils.prefix();
    const tPrefix = utils.toolkitPrefix();
    const isIntranet = env.isIntranet();
    name = name.replace('@ali/', '');
    if (name.indexOf(tPrefix) === 0 || name.indexOf('toolkit') > 0) {
      full = name;
    } else if (name.indexOf('toolkit') === 0) {
      full = `${prefix}-${name}`;
    } else {
      full = `${tPrefix}${name}`;
    }
    return isIntranet ? `@ali/${full}` : full;
  },


  /**
   * 获取插件模块完整名字
   * 传入的可能是 @ali/fie-plugin-xxx plugin-xxx
   * @returns {string}
   */
  pluginFullName(name) {
    let full = '';
    const prefix = utils.prefix();
    const pPrefix = utils.pluginPrefix();
    const isIntranet = env.isIntranet();
    name = name.replace('@ali/', '');
    // fie-plugin-xxx 的情况，和 另外有个 lzd-plugin-xxx 的情况(即name不是prefix开头的)
    if (name.indexOf(pPrefix) === 0 || name.indexOf('plugin') > 0) {
      full = name;
    } else if (name.indexOf('plugin') === 0) {  // plugin-xxx 的情况
      full = `${prefix}-${name}`;
    } else {
      full = `${pPrefix}${name}`;
    }
    return isIntranet ? `@ali/${full}` : full;
  },


  /**
   * 根据传入的插件名称缩写,获取模块名称
   * @param name
   * @returns {*}
   */
  fullName(name) {
    if (name.indexOf('plugin-') > -1) {
      return utils.pluginFullName(name);
    } else if (name.indexOf('toolkit-') > -1) {
      return utils.toolkitFullName(name);
    }
    return name;
  },


};

module.exports = utils;

