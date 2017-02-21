'use strict';

const log = require('fie-log')('fie-module');
const env = require('fie-env');
const cache = require('fie-cache');
const utils = require('./utils');
const request = require('co-request');
const ping = require('ping');

const isIntranet = env.isIntranet();


const searchApi = () => {
  const end = `browse/keyword/${encodeURIComponent('fie-')}?type=json&__t=${Date.now()}`;
  const listApi = isIntranet ? 'http://fie-api.alibaba.net/modules/simple' : `https://npm.taobao.org/${end}`;
  log.debug(`获取列表访问的 api 地址: ${listApi}`);
  return listApi;
};

/**
 * 获取列表, 缓存机制
 * @returns {*|Request|Array}
 */
function* onlineList(options) {
  options = Object.assign({}, {
    cache: true
  }, options);
  const cacheKey = isIntranet ? utils.ONLINE_MODULE_CACHE_KEY_IN : utils.ONLINE_MODULE_CACHE_KEY_OUT;

  log.debug('get online list from cache %o', cache.get(cacheKey));

  let moduleList = options.cache && cache.get(cacheKey);

  if (!moduleList) {
    moduleList = [];
  }

  const regx = isIntranet ? /^@ali\/fie-(plugin|toolkit)-/ : /^fie-(plugin|toolkit)-/;

  try {
    if (!moduleList.length) {
      const pingRes = yield ping.promise.probe(isIntranet ? 'fie-api.alibaba.net' : 'npm.taobao.org');

      if (!pingRes || !pingRes.alive) {
        throw Error('网络连接错误');
      }

      const res = yield request(searchApi());
      const body = JSON.parse(res.body);

      // 内外网数据源不同,格式稍有差异
      const list = isIntranet ? body.data : body.packages;


      list.forEach((item) => {
        // 内外网数据源不同,格式稍有差异
        item.name = isIntranet ? item.moduleName : item.name;
        item.chName = item.chName ? item.chName : item.description;
        item.shared = isIntranet ? item.shared : true;

        // 名字不符合规则 或 已删除的包不再显示
        if (regx.test(item.name)) {
          moduleList.push(item);
        }
      });
      cache.set(cacheKey, moduleList, {
        expires: 3600000
      });
    }
  } catch (e) {
    // 返回数据出错, 可能是没网
    log.debug(e);
  }


  moduleList = options.type ? utils.moduleFilter(moduleList, options.type) : moduleList;

  log.debug('所有线上模块: %o', moduleList);

  return moduleList;
}

module.exports = onlineList;
