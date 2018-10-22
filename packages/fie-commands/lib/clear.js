/**
 * @author hugohua
 * @desc 清除FIE缓存
 */

'use strict';

const fieHome = require('fie-home');
const log = require('fie-log')('core-commands');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const fieEnv = require('fie-env');
const cache = require('fie-cache');
const Intl = require('fie-intl');
const message = require('../locale/index');

module.exports = function*() {
  const intl = new Intl(message);
  const cdnPath = path.join(fieHome.getHomePath(),'LocalCDNPath');
  log.info(intl.get('startClear'));
  fieHome.cleanHomeDir();
  fieEnv.removeConfigFile();
  if (fs.existsSync(cdnPath)) {
    rimraf.sync(cdnPath);
  }
  cache.clear();
  // 删除LocalCDNPath目录

  log.success(intl.get('finishClear'));
};
