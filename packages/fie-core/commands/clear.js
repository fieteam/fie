/**
 */

'use strict';


const fieHome = require('fie-home');
const log = require('fie-log')('fie-core');
const fieEnv = require('fie-env');

module.exports = function* () {
  log.info('开始清除 fie 缓存模块...');
  fieHome.cleanHomeDir();
  fieEnv.removeConfigFile();
  log.success('fie 缓存模块清除完成');
};

