'use strict';

const log = require('fie-log')('fie-error');


/**
 * 未找到npm包或安装 npm 包时出现其他错误时,进行提示
 */
module.exports = function* (e) {
  const errMsg = e ? e.toString() : '';
  const regx = /install\s(.+)\serror/;
  const match = errMsg.match(regx);

  if (match) {
    log.debug('npm-not-found 捕获');
    log.error(`安装 ${match[1]} 出错,请确认网络是否正常及包名是否输入正确`);
    return true;
  }
  return false;
};
