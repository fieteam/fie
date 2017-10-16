/**
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const fieModule = require('fie-module');

module.exports = function* (cliArgs) {
  const name = cliArgs.pop();
  yield fieModule.update(name);
};
