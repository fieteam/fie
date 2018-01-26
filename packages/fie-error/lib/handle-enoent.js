'use strict';

/**
 * Created by hugo on 16/11/16.
 */
const log = require('fie-log')('core-error');
const fieEnv = require('fie-env');
const _ = require('lodash');
const Intl = require('fie-intl');
const message = require('../locale/index');

module.exports = function*(e) {
  if (e.code !== 'ENOENT') {
    return false;
  }
  // 目前可能的值有spawn xx ENOENT;spawnSync xx ENOENT
  const match = e.message.match(/\s(.*)ENOENT/);
  const intl = new Intl(message);
  if (match && match[0]) {
    const module = match[1].trim();
    const isIntranet = fieEnv.isIntranet();
    const installer = isIntranet ? 'tnpm' : 'npm';
    log.error(intl.get('commandNotFound', { module }));
    // 本地模块
    if (module.indexOf('node_modules') !== -1) {
      const cmdArr = module.split('/');
      const startIdx = _.indexOf(cmdArr, 'node_modules');
      let runModule;

      // 直接运行命令
      if (module.indexOf('node_modules/.bin/') !== -1) {
        runModule = cmdArr[cmdArr.length - 1];
      } else if (module.indexOf('node_modules/@ali') !== -1 && cmdArr.length >= 2) {
        // 本地文件直接运行
        runModule = `${cmdArr[startIdx + 1]}/${cmdArr[startIdx + 2]}`;
      } else {
        runModule = cmdArr[startIdx + 1];
      }
      log.error(intl.get('fixLocalTips', { installer, runModule }));
    } else {
      log.error(intl.get('fixGlobalTips', { installer, module }));
    }
    return true;
  }
  return false;
};
