'use strict';

const env = require('fie-env');

const isIntranet = env.isIntranet();

/**
 * 获取套件模块完整名字
 * @param name
 * @returns {string}
 */
function toolkitFullName(name) {
  let full = '';
  name = name.replace('@ali/', '');
  if (name.indexOf('fie-toolkit') === 0) {
    full = name;
  } else if (name.indexOf('toolkit') === 0) {
    full = `fie-${name}`;
  } else {
    full = `fie-toolkit-${name}`;
  }
  return isIntranet ? `@ali/${full}` : full;
}


/**
 * 获取插件模块完整名字
 * @returns {string}
 */
function pluginFullName(name) {
  let full = '';
  name = name.replace('@ali/', '');
  if (name.indexOf('fie-plugin') === 0) {
    full = name;
  } else if (name.indexOf('plugin') === 0) {
    full = `fie-${name}`;
  } else {
    full = `fie-plugin-${name}`;
  }
  return isIntranet ? `@ali/${full}` : full;
}


const utils = {
  moduleFilter(list, type) {
    return list.filter(item => item.name.indexOf(`${type}-`) > -1);
  },
  /**
   * 根据传入的插件名称缩写,获取模块名称
   * @param name
   * @returns {*}
   */
  fullName(name) {
    if (name.indexOf('plugin-') > -1) {
      return pluginFullName(name);
    } else if (name.indexOf('toolkit-') > -1) {
      return toolkitFullName(name);
    }
    return name;
  },
  pluginFullName,
  toolkitFullName,
  UPDATE_CHECK_PRE: 'fieModuleCheck_',
  ONLINE_MODULE_CACHE_KEY: 'onlineModuleList'
};

module.exports = utils;
