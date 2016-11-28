'use strict';

const log = require('fie-log')('fie-module');
const env = require('fie-env');
const cache = require('fie-cache');
const utils = require('./utils');
const request = require('co-request');

const isIntranet = env.isIntranet();


const searchApi = (key) => {
  const end = `browse/keyword/${encodeURIComponent(key)}?type=json&__t=${Date.now()}`;
  return isIntranet ? `http://web.npm.alibaba-inc.com/${end}` : `https://npm.taobao.org/${end}`;
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
  const keyword = isIntranet ? '@ali/fie-' : 'fie-';

  try {
    if (!moduleList.length) {
      const res = yield request(searchApi(keyword));
      const body = JSON.parse(res.body);

      body.packages.forEach((item) => {
        // 名字不符合规则 或 已删除的包不再显示
        if (item.description !== 'delete' && regx.test(item.name)) {
          moduleList.push(item);
        }
      });
      cache.set(cacheKey, moduleList, {
        expries: 3600000
      });
    }
  } catch (e) {
    // 返回数据出错, 可能是没网
  }


  moduleList = options.type ? utils.moduleFilter(moduleList, options.type) : moduleList;

  log.debug('所有线上模块: %o', moduleList);

  return moduleList;
}

module.exports = onlineList;
