/**
 * @desc FIE高阶命令
 * @namespace fie-commands
 */

'use strict';


/**
 * @exports fie-modules
 */
module.exports = {
  all: require('./all'),
  clear: require('./clear'),
  help: require('./help'),
  ii: require('./ii'),
  init: require('./init'),
  install: require('./install'),
  list: require('./list'),
  switch: require('./switch'),
  update : require('./update'),
  version : require('./version')
};
