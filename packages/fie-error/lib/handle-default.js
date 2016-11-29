/**
 * Created by hugo on 16/11/16.
 */

'use strict';

const log = require('fie-log')('fie-error');


const ERROR_MSG = ' 请在这里反馈问题给 @擎空 @宇果 https://github.com/fieteam/fie/issues/new ';

module.exports = function* (e) {
  log.error(`运行报错,${ERROR_MSG}`);
  e.stack && console.log(e.stack);
  return true;
};
