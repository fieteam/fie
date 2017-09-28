'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const npm = require('fie-npm');
const semver = require('semver');
const cache = require('fie-cache');
const log = require('fie-log')('fie-up');

const TIP_CACHE_KEY = '__fieVersionTip';

/**
 * 升级提示，若发布新版本，会定时提醒是否需要更新
 * @param data object { "name" : 包名, "version" : 当前版本}
 */
function* updateTip(data) {
  if (cache.get(TIP_CACHE_KEY)) {
    return;
  }


  const latest = yield npm.latest(data.name);

  // 缓存设置为3小时，过了3小时才重新提示升级 FIE
  cache.set(TIP_CACHE_KEY, true, {
    expires: 108000000
  });

  // latest 没有值，可能没有网络
  if (!latest) {
    return;
  }

  log.debug('%s current-version: %s, latest-version: %s', data.name, data.version, latest.version);

  if (!semver.lt(data.version, latest.version)) {
    return;
  }
  const installer = data.name.indexOf('@ali') !== -1 ? 'tnpm' : 'npm';

  console.log('\n');
  log.warn(`******************** ${emoji.get('warning')} ${emoji.get('warning')}   升级提示  ${emoji.get('warning')} ${emoji.get('warning')} **********************`);
  log.warn(`FIE推荐的版本是 ${chalk.green.bold(latest.version)} , 本地版本是 ${data.version}, 建议升级后再使用,保证功能的稳定性`);
  log.warn(`请执行 ${emoji.get('point_right')}  ${chalk.bgRed.bold(` ${installer} install -g ${data.name} `)} 来升级FIE`);
  log.warn(`如果提示没有权限，请尝试 ${chalk.red.bold(`sudo ${installer} install -g ${data.name} `)}`);
  log.warn(`******************************${emoji.get('point_up_2')} ${emoji.get('point_up_2')} ******************************`);
  console.log('\n');
}


module.exports = updateTip;
