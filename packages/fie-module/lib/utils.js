'use strict';

const semver = require('semver');
const log = require('fie-log')('core-module');
const chalk = require('chalk');
const emoji = require('node-emoji');
const fieModuleName = require('fie-module-name');

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
  let pre = '';
  let localVersion = '';
  const lastVersion = opt.lastPkg.version;

  if (opt.localPkg && opt.localPkg.version !== lastVersion) {
    localVersion = opt.localPkg.version;
    pre = `从 ${localVersion} 升级至 ${lastVersion}`;
  } else {
    pre = `${lastVersion} 版本`;
    localVersion = lastVersion;
  }

  if (opt.lastPkg.changeLog) {
    const changeLog = opt.lastPkg.changeLog.sort((a, b) => (semver.lt(a.version, b.version) ? 1 : -1));


    // 在警告模式下加重提示样式
    if (opt.level === 'warn') {
      const localVTip = localVersion ? ` , 本地版本是 ${localVersion} ` : '';
      const installTip = `fie install ${opt.lastPkg.name.replace(/^(@ali\/)?fie\-/, '')}`;

      console.log('\n');
      ulog(`******************** ${emoji.get('warning')} ${emoji.get('warning')}   升级提示  ${emoji.get('warning')} ${emoji.get('warning')} **********************`);
      ulog(`${name} 推荐的版本是 ${chalk.green(lastVersion)}${localVTip}`);
      ulog(`请执行 ${emoji.get('point_right')}  ${chalk.bgRed.bold(installTip)} 来升级模块`);
    }

    ulog(`${name} ${pre}包含以下更新:`);
    changeLog.forEach((item) => {
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
      item.log.forEach((itemLog) => {
        ulog(` --${itemLog}`);
      });
    });

    // 在警告模式下加重提示样式
    if (opt.level === 'warn') {
      ulog(`******************************${emoji.get('point_up_2')} ${emoji.get('point_up_2')} ******************************`);
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
  NO_TIP_PERIOD: 3600000
};

module.exports = utils;
