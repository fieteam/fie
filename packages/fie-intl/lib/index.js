/**
 * @author 宇果 <baofen14787@gmail.com>
 * @desc fie 多语言方案
 */

'use strict';

const IntlMessageFormat = require('intl-messageformat');
const log = require('fie-log')('core-intl');
const home = require('fie-home');
const fs = require('fs-extra');
const path = require('path');

// fie env的配置文件
const FILE_LOCALE = 'fie.locale.json';
let cacheLocale = null;

function intl(message) {
  this.message = message;
  // 语言类型
  this.locale = this.getLocale();
}

intl.prototype = {

  /**
   * 获取语言信息
   */
  getLocale() {
    // 如果有环境变量,则优先使用环境变量的值
    const fieLocaleGlobal = process.env.FIE_LOCALE;
    if (fieLocaleGlobal) {
      return fieLocaleGlobal;
    }
    // 由于该方法调用频繁,在这里使用一个cache对象做为缓存,避免频繁的IO操作
    let localeData;
    if (cacheLocale) {
      localeData = cacheLocale;
    } else {
      const localeFile = path.join(home.getHomePath(), FILE_LOCALE);
      if (fs.existsSync(localeFile)) {
        localeData = fs.readJsonSync(localeFile);
        cacheLocale = localeData;
      }
    }

    // 默认返回英文
    if (!localeData) return 'en-us';
    return localeData.locale;
  },

  /**
   * 设置语言信息
   */
  setLocale(locale) {
    const localeFile = path.join(home.getHomePath(), FILE_LOCALE);
    const localeData = {
      locale
    };
    log.debug('set fie locale data : %o', localeData);
    log.debug('set fie to : %s', localeFile);
    cacheLocale = null;
    fs.outputJsonSync(localeFile, localeData);
  },

  /**
   * 获取所需的语言
   * @param key
   * @param values 语言中的变量信息
   */
  get(key, values) {
    let msg = this.message[this.locale][key];
    if (msg) {
      msg = new IntlMessageFormat(msg, this.locale);
      return msg.format(values);
    }
    log.warn(`intl key : ${key} not defined!`);
    return null;
  }
};

module.exports = intl;
