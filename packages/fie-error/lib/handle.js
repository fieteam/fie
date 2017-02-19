/**
 * @desc 错误处理,先会调用之前注册过的错误处理,最后执行默认的处理
 * @author 擎空 <zernmal@foxmail.com>
 * @memberOf fie-error
 * @namespace handle
 * @exports handle
 */

'use strict';

const co = require('co');
const log = require('fie-log')('fie-error');
const report = require('fie-report');
const utils = require('./utils');

const innerList = [
  require('./handle-npm-not-found'),
  require('./handle-module-not-found'),
  require('./handle-enoent'),
  require('./handle-default')
];

/**
 * 错误处理器
 * @param {error} e 错误对象
 */
function handle(e) {
  co(function* () {
    log.debug('error code = %s', e.code);
    log.debug(e.stack || e);
    const handList = utils.getHandleList().concat(innerList);
    // 发送错误日志
    report.error(e.code || 'fie-error', e.stack || e, true);

    for (let i = 0; i < handList.length; i += 1) {
      const res = yield handList[i](e);
      if (res === true) {
        // 说明错误已被处理, 可以直接返回了
        return;
      }
    }
  }).catch((err) => { console.log(err); });
}

module.exports = handle;
