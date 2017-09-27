/**
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const log = require('fie-log')('fie-core');
const fieModule = require('fie-module');

module.exports = function* (cliArgs) {
  const name = cliArgs.pop();

  if (name) {
    yield fieModule.install(name);
  } else {
    log.warn('请输入需要安装的fie模块名!');
  }
};
