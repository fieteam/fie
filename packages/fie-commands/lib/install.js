/**
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const log = require('fie-log')('core-commands');
const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const Intl = require('fie-intl');
const message = require('../locale/index');

module.exports = function* (cliArgs) {
  let name = cliArgs.pop();
  if (name) {
    name = fieModuleName.fullName(name);
    yield fieModule.install(name);
  } else {
    const intl = new Intl(message);
    log.warn(intl.get('installTips'));
  }
};
