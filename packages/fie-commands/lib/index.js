/**
 * @desc FIE高阶命令
 * @namespace fie-commands
 */

'use strict';


/**
 * @exports fie-commands
 */

module.exports = {
  main: require('./main'),
  clear: require('./clear'),
  help: require('./help'),
  ii: require('./ii'),
  init: require('./init'),
  install: require('./install'),
  list: require('./list'),
  switch: require('./switch'),
  update: require('./update'),
  version: require('./version'),
  locale: require('./locale')
};
