'use strict';

const semver = require('semver');
const log = require('fie-log')('core-module');
const chalk = require('chalk');
const emoji = require('node-emoji');
const fieModuleName = require('fie-module-name');
const Intl = require('fie-intl');
const message = require('../locale/index');

/**
 * 获取fie的实际命令
 * @returns {*|string}
 */
function getFieBin() {
  return process.env.FIE_BIN || 'fie';
}

/**
 * 版本更新日志打印
 * @param name
 * @param opt
 * @param opt.localPkg
 * @param opt.lastPkg
 * @param opt.level
 */
function updateLog(name, opt) {
  const ulog = log[opt.level || 'success'];
  const intl = new Intl(message);
  let pre = '';
  let localVersion = '';
  const lastVersion = opt.lastPkg.version;

  if (opt.localPkg && opt.localPkg.version !== lastVersion) {
    localVersion = opt.localPkg.version;
    pre = intl.get('updateTo', { localVersion, lastVersion });
  } else {
    pre = intl.get('updateVersion', { lastVersion });
    localVersion = lastVersion;
  }

  if (opt.lastPkg.changeLog) {
    const changeLog = opt.lastPkg.changeLog.sort(
      (a, b) => (semver.lt(a.version, b.version) ? 1 : -1)
    );

    // 在警告模式下加重提示样式
    if (opt.level === 'warn') {
      const tool = getFieBin();
      const localVTip = localVersion ? intl.get('localVersion', { localVersion }) : '';
      const installTip = `${tool} install ${opt.lastPkg.name}`;

      console.log('\n');
      ulog(
        `******************** ${emoji.get('warning')} ${emoji.get('warning')}   ${intl.get(
          'updateTips'
        )}  ${emoji.get('warning')} ${emoji.get('warning')} **********************`
      );
      ulog(
        `${intl.get('recommendVersion', { name, version: chalk.green(lastVersion) })}${localVTip}`
      );
      ulog(
        intl.get('recommendInstall', {
          icon: emoji.get('point_right'),
          installTip: chalk.bgRed.bold(installTip),
        })
      );
    }

    ulog(`${name} ${pre}, ${intl.get('includeUpdate')}`);
    changeLog.forEach(item => {
      if (!item.log || !item.log.length) {
        return;
      }
      if (lastVersion === localVersion) {
        if (item.version !== lastVersion) {
          return;
        }
      } else if (!semver.lte(item.version, lastVersion) || !semver.gt(item.version, localVersion)) {
        return;
      }

      // 显示未更新的这几个版本log
      item.log.forEach(itemLog => {
        ulog(` --${itemLog}`);
      });
    });

    // 在警告模式下加重提示样式
    if (opt.level === 'warn') {
      ulog(
        `******************************${emoji.get('point_up_2')} ${emoji.get(
          'point_up_2'
        )} ******************************`
      );
      console.log('\n');
    }
  }
}

const utils = {
  moduleFilter(list, type) {
    return list.filter(item => item.name.indexOf(`${type}-`) > -1);
  },

  fullName: fieModuleName.fullName,
  pluginFullName: fieModuleName.pluginFullName,
  toolkitFullName: fieModuleName.toolkitFullName,
  modPrefix: fieModuleName.prefix,
  toolkitPrefix: fieModuleName.toolkitPrefix,
  pluginPrefix: fieModuleName.pluginPrefix,
  UPDATE_CHECK_PRE: 'fieModuleCheck_',
  ONLINE_MODULE_CACHE_KEY_IN: 'onlineModuleListIn',
  ONLINE_MODULE_CACHE_KEY_OUT: 'onlineModuleListOut',
  updateLog,
  NO_TIP_PERIOD: 3600000,
};

module.exports = utils;
