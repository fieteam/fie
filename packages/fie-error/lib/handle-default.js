/**
 * Created by hugo on 16/11/16.
 */

'use strict';

const log = require('fie-log')('core-error');
const env = require('fie-env');
const Intl = require('fie-intl');
const message = require('../locale/index');

module.exports = function*(e) {
  const intl = new Intl(message);
  const ERROR_MSG = env.isIntranet() ? intl.get('intranetTips') : intl.get('extranetTips');

  log.error(ERROR_MSG);
  e.stack && console.log(e.stack);
  return true;
};
