'use strict';

const home = require('fie-home');
const npm = require('fie-npm');
const log = require('fie-log')('fie-module');
const utils = require('./utils');

function* installOne(name, options) {
  let pureName = '';
  options = Object.assign({}, {
    type: 'install'
  }, options);
  name = utils.fullName(name);
  if (!/^(@ali\/)?.+@.+$/.test(name)) {
    // 没带版本号
    pureName = name;
    name += '@latest';
  } else {
    pureName = name.split('@');
    pureName.pop();
    pureName = pureName.join('@');
  }

  // 开始安装
  log.debug(`开始安装 ${name}`);
  yield npm.install(name, {
    cwd: home.getHomePath()
  });

  // 提示安装成功
  if (options.type === 'install') {
    log.success(`${name} 安装成功`);
    return;
  }

  log.success(`${name} 更新成功`);
  // 打印更新日志
  if (!options.lastPkg) {
    options.lastPkg = yield npm.latest(pureName);
  }
  if (!options.lastPkg) {
    return;
  }
  utils.updateLog(name, {
    localPkg: options.localPkg,
    lastPkg: options.lastPkg,
    level: 'success'
  });
}

module.exports = installOne;
