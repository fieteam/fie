/**
 * @author 擎空 <zernmal@foxmail.com>
 */

'use strict';

const fieModule = require('fie-module');
const log = require('fie-log')('fie-core');

module.exports = function* (cliArgs) {
  const options = {
    name: cliArgs.pop()
  };

  if (options.name) {
    options.name = options.name.replace('@ali/', '');
    options.name = (options.name.indexOf('fie-') === -1) ? `fie-${options.name}` : options.name;
    yield fieModule.unInstall(options.name);
    log.success(`卸载 ${options.name} 成功`);
  } else {
    log.error('请输入需要卸载的fie模块名');
  }
};

