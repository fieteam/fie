'use strict';

const semver = require('semver');
const env = require('fie-env');
const log = require('fie-log')('fie-module');
const chalk = require('chalk');
const emoji = require('node-emoji');

const isIntranet = env.isIntranet();

/**
 * 获取套件模块完整名字
 * @param name
 * @returns {string}
 */
function toolkitFullName(name) {
  let full = '';
  name = name.replace('@ali/', '');
  if (name.indexOf('fie-toolkit') === 0) {
    full = name;
  } else if (name.indexOf('toolkit') === 0) {
    full = `fie-${name}`;
  } else {
    full = `fie-toolkit-${name}`;
  }
  return isIntranet ? `@ali/${full}` : full;
}


/**
 * 获取插件模块完整名字
 * @returns {string}
 */
function pluginFullName(name) {
  let full = '';
  name = name.replace('@ali/', '');
  if (name.indexOf('fie-plugin') === 0) {
    full = name;
  } else if (name.indexOf('plugin') === 0) {
    full = `fie-${name}`;
  } else {
    full = `fie-plugin-${name}`;
  }
  return isIntranet ? `@ali/${full}` : full;
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
  /**
   * 根据传入的插件名称缩写,获取模块名称
   * @param name
   * @returns {*}
   */
  fullName(name) {
    if (name.indexOf('plugin-') > -1) {
      return pluginFullName(name);
    } else if (name.indexOf('toolkit-') > -1) {
      return toolkitFullName(name);
    }
    return name;
  },
  pluginFullName,
  toolkitFullName,
  UPDATE_CHECK_PRE: 'fieModuleCheck_',
  ONLINE_MODULE_CACHE_KEY_IN: 'onlineModuleListIn',
  ONLINE_MODULE_CACHE_KEY_OUT: 'onlineModuleListOut',
  updateLog,
  NO_TIP_PERIOD: 3600000
};

module.exports = utils;
