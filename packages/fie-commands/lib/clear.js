/**
 * @author hugohua
 * @desc 清除FIE缓存
 */

'use strict';


const fieHome = require('fie-home');
const log = require('fie-log')('core-commands');
const fieEnv = require('fie-env');
const cache = require('fie-cache');
const Intl = require('fie-intl');
const message = require('../locale/index');

module.exports = function* () {
  const intl = new Intl(message);

  log.info(intl.get('startClear'));

  fieHome.cleanHomeDir();
  fieEnv.removeConfigFile();
  cache.clear();
  log.success(intl.get('finishClear'));
};

