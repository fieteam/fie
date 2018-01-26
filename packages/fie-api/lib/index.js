/**
 * @author 擎空 <zernmal@foxmail.com>
 * @desc 整合fie相关的包，统一暴露接口，避免单个单个使用麻烦
 * @exports fie-api
 */

'use strict';

const cache = require('fie-cache');
const config = require('fie-config');
const env = require('fie-env');
const fs = require('fie-fs');
const home = require('fie-home');
const log = require('fie-log');
const fieModule = require('fie-module');
const fieModuleName = require('fie-module-name');
const npm = require('fie-npm');
const task = require('fie-task');
const user = require('fie-user');
const Intl = require('fie-intl');
const git = require('fie-git');
const coreConfig = require('fie-core-config');

module.exports = {
  cache,
  log,
  fs,
  home,
  npm,
  task,
  user,
  config,
  git,
  env,
  module: fieModule,
  moduleName: fieModuleName,
  Intl,
  coreConfig
};
