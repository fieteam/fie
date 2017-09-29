'use strict';

const home = require('fie-home');
const npm = require('fie-npm');
const utils = require('./utils');

function* unInstall(name) {
  if (!name) {
    return;
  }
  yield npm.unInstall(utils.fullName(name), {
    cwd: home.getHomePath()
  });
}

module.exports = unInstall;
