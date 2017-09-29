'use strict';

const log = require('fie-log')('fie-module');
const env = require('fie-env');
const cache = require('fie-cache');
const request = require('co-request');
const utils = require('./utils');
const ping = require('ping');



const searchApi = () => {
  const isIntranet = env.isIntranet();
  const prefix = utils.modPrefix();
  const end = `browse/keyword/${encodeURIComponent(`${prefix}-`)}?type=json&__t=${Date.now()}`;
  const listApi = isIntranet ? 'http://fie-api.alibaba-inc.com/modules/simple' : `https://npm.taobao.org/${end}`;
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

  const isIntranet = env.isIntranet();
  const cacheKey = isIntranet ? utils.ONLINE_MODULE_CACHE_KEY_IN : utils.ONLINE_MODULE_CACHE_KEY_OUT;

  log.debug('get online list from cache %o', cache.get(cacheKey));

  let moduleList = options.cache && cache.get(cacheKey);

  if (!moduleList) {
    moduleList = [];
  }

  try {
    if (!moduleList.length) {
      //先ping一下，看是否有网络
      const pingRes = yield ping.promise.probe(isIntranet ? 'fie-api.alibaba-inc.com' : 'npm.taobao.org');

      if (!pingRes || !pingRes.alive) {
        throw Error('网络连接错误');
      }

      const res = yield request({
        url : searchApi(),
        method : 'get',
        json : true
      });

      log.debug('search body = ',res.body);
      const body = res.body;
      // 内外网数据源不同,格式稍有差异
      const list = isIntranet ? body.data : body.packages;

      const tPrefix = utils.toolkitPrefix();
      const pPrefix = utils.pluginPrefix();
      const pkgPrefix = isIntranet ? '@ali/' : '';
      list.forEach((item) => {
        // 内外网数据源不同,格式稍有差异
        item.name = isIntranet ? item.moduleName : item.name;
        item.chName = item.chName ? item.chName : item.description;
        item.shared = isIntranet ? item.shared : true;

        // 名字不符合规则 或 已删除的包不再显示
        if( item.description !== 'delete' &&
            (item.name.indexOf(`${pkgPrefix}${tPrefix}`) === 0 ||
            item.name.indexOf(`${pkgPrefix}${pPrefix}` === 0))
        ) {
          moduleList.push(item);
        }

      });

      //如果没有列表，就不缓存了
      if(!moduleList.length){
        cache.set(cacheKey, moduleList, {
          expires: 3600000
        });
      }
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
