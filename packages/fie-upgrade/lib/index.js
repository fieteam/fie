'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const npm = require('fie-npm');
const semver = require('semver');
const cache = require('fie-cache');
const log = require('fie-log')('core-upgrade');
const Intl = require('fie-intl');
const message = require('../locale/index');

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
    expires: 108000000,
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
  const intl = new Intl(message);
  console.log('\n');
  log.warn(
    `******************** ${emoji.get('warning')} ${emoji.get('warning')}   ${intl.get(
      'updateTips'
    )}  ${emoji.get('warning')} ${emoji.get('warning')} **********************`
  );
  log.warn(
    intl.get('recommendVersion', {
      latest: chalk.green.bold(latest.version),
      localVersion: data.version,
    })
  );
  log.warn(
    intl.get('updateCommand', {
      icon: emoji.get('point_right'),
      command: chalk.bgRed.bold(` ${installer} install -g ${data.name} `),
    })
  );
  log.warn(
    `${intl.get('ifUpdateError')} ${chalk.red.bold(`sudo ${installer} install -g ${data.name} `)}`
  );
  log.warn(
    `******************************${emoji.get('point_up_2')} ${emoji.get(
      'point_up_2'
    )} ******************************`
  );
  console.log('\n');
}

module.exports = updateTip;
