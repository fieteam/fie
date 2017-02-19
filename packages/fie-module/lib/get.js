'use strict';

const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const log = require('fie-log')('fie-module');
const home = require('fie-home');
const npm = require('fie-npm');
const cache = require('fie-cache');
const report = require('fie-report');
const installOne = require('./install-one');
const utils = require('./utils');


function* get(name) {
  let returnPkg = false;
  if (/\/package\.json$/.test(name)) {
    name = name.replace('/package.json', '');
    returnPkg = true;
  }
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
              type: 'update',
              localPkg,
              lastPkg
            });
          } else {
            // 更新提示
            const shortName = name.replace('@ali/', '').replace('fie-', '');
            log.warn(`${name} 的最新版本为 ${lastPkg.version}, 您可以执行 fie install ${shortName} 进行更新`);
            utils.updateLog(name, {
              localPkg,
              lastPkg,
              level: 'warn'
            });
          }
        }
      }
    }
  } else {
    log.info(`本地尚未安装  ${name},正在执行自动安装...`);
    yield installOne(name);
  }
  const pkg = fs.readJsonSync(pkgPath);
  const mod = require(modulePath);

  //TODO 发送log记录，由于调用插件时，也会调用到套件，所以这里只有插件调用的时候才发送log
  //套件调用，在fie-core all.js文件
  if(!returnPkg && name.indexOf('fie-plugin') !== -1){
    log.debug(`${name} 插件开始发送日志...`);
		report.moduleUsage(utils.fullName(name));
  }

  return returnPkg ? pkg : mod;
}

module.exports = get;
