/**
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const log = require('fie-log')('core-commands');
const fieModule = require('fie-module');
const Intl = require('fie-intl');
const message = require('../locale/index');

module.exports = function* (cliArgs) {
  const name = cliArgs.pop();
  const intl = new Intl(message);
  if (name) {
    yield fieModule.install(name);
  } else {
    log.warn(intl.get('installTips'));
  }
};
