'use strict';

const home = require('fie-home');
const npm = require('fie-npm');
const log = require('fie-log')('fie-module');
const utils = require('./utils');

function* installOne(name, options) {
  options = Object.assign({}, {
    type: 'install'
  }, options);
  name = utils.fullName(name);
  yield npm.install(name, {
    cwd: home.getHomePath()
  });
  if (options.type === 'install') {
    log.success(`${name} 安装成功`);
  } else {
    log.success(`${name} 更新成功`);
  }
}

module.exports = installOne;
