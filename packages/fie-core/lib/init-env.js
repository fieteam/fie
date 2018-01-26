'use strict';

const fieEnv = require('fie-env');
const log = require('fie-log')('core-core');
const Intl = require('fie-intl');
const message = require('../locale/index');

/**
 * 获取fie的实际命令
 * @returns {*|string}
 */
function getFieBin() {
  return process.env.FIE_BIN || 'fie';
}

/**
 * 初始化环境
 */
module.exports = function*() {
  const hasInitEnv = fieEnv.hasConfigFile();
  const intl = new Intl(message);
  const tool = getFieBin();
  // 已经初始化过了,则退出
  // 如果是云构建，则不检测
  if (hasInitEnv || process.env.BUILD_ENV === 'cloud') {
    return;
  }

  log.warn(intl.get('notInitEnv', { tool }));

  yield require('fie-commands/lib/switch')();

  log.success(intl.get('useCommand', { tool }));

  process.exit(10);
};
