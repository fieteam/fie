'use strict';


const getModule = require('./get');
const install = require('./install');
const unInstall = require('./un-install');
const update = require('./update');
const onlineList = require('./online-list');
const localList = require('./local-list');
const utils = require('./utils');
const localExist = require('./local-exist');
const onlineExist = require('./online-exist');


module.exports = {
  get: getModule,
  install,
  unInstall,
  update,
  onlineList,
  localList,
  localExist,
  onlineExist,
  fullName: utils.fullName,
  toolkitFullName: utils.toolkitFullName,
  pluginFullName: utils.pluginFullName
};
