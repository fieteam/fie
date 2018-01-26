'use strict';

const log = require('fie-log')('core-error');
const Intl = require('fie-intl');
const message = require('../locale/index');

/**
 * 未找到npm包或安装 npm 包时出现其他错误时,进行提示
 */
module.exports = function*(e) {
  const errMsg = e ? e.toString() : '';
  const intl = new Intl(message);
  const regx = /install\s(.+)\serror/;
  const match = errMsg.match(regx);

  if (match) {
    log.debug('npm-not-found 捕获');
    log.error(intl.get('npmNotFound', { module: match[1] }));
    return true;
  }
  return false;
};
