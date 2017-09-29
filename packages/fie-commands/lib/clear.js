/**
 * 清除FIE缓存
 */

'use strict';


const fieHome = require('fie-home');
const log = require('fie-log')('fie-commands');
const fieEnv = require('fie-env');
const cache = require('fie-cache');

module.exports = function* () {
  log.info('开始清除缓存模块...');
  fieHome.cleanHomeDir();
  fieEnv.removeConfigFile();
  cache.clear();
  log.success('缓存模块清除完成');
};

