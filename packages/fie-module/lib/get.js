'use strict';

const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const log = require('fie-log')('fie-module');
const home = require('fie-home');
const npm = require('fie-npm');
const cache = require('fie-cache');
const installOne = require('./install-one');
const utils = require('./utils');



function* get(name) {
  name = utils.fullName(name);
  const modulePath = path.resolve(home.getModulesPath(), name);
  const pkgPath = path.resolve(modulePath, 'package.json');

  if (fs.existsSync(pkgPath)) {
    log.debug(`存在本地模块 ${pkgPath}`);
    // 本地存在, 判断是否需要更新
    if (!cache.get(`${utils.UPDATE_CHECK_PRE}${name}`)) {
      // 获取最新版本
      const lastPkg = yield npm.latest(name);
      const localPkg = fs.readJsonSync(pkgPath);

      // 有可能网络错误,这里进行判断一下看是否需要再进行更新操作
      if (lastPkg) {
        if (semver.lt(localPkg.version, lastPkg.version)) {
          if (localPkg.fieOption && localPkg.fieOption.update) {
            // 自动更新
            log.info(`${name} 设置了自动更新,正在执行更新操作...`);
            yield installOne(name, {
              type: 'update'
            });
          } else {
            // 更新提示
            const shortName = name.replace('@ali/', '').replace('fie-', '');
            log.warn(`${name} 的最新版本为 ${lastPkg.version}, 您可以执行 fie install ${shortName} 进行更新`);
          }
        }
      }
    }
  } else {
    log.info(`本地尚未安装  ${name},正在执行自动安装...`);
    yield installOne(name);
  }
  const pkg = fs.readJsonSync(pkgPath);
  const fieOptions = Object.assign({}, { version: pkg.version }, pkg.fieOption);
  const mod = require(modulePath);
  return {
    mod,
    options: fieOptions
  };
}

module.exports = get;
