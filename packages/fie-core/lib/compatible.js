'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const npm = require('fie-npm');
const semver = require('semver');
const cache = require('fie-cache');
const log = require('fie-log')('fie-core');
const childProcess = require('child_process');

const TIP_CACHE_KEY = '__fieVersionTip';

function* updateTip() {
  if (cache.get(TIP_CACHE_KEY)) {
    return;
  }

  const current = require('../package.json');

  const latest = yield npm.latest(current.name);

  // 缓存设置为3小时
  cache.set(TIP_CACHE_KEY, true, {
    expires: 108000000
  });

  log.debug('%s current-version: %s, latest-version: %s', current.name, current.version, latest.version);

  if (!semver.lt(current.version, latest.version)) {
    return;
  }
  const installer = current.name.indexOf('@ali') !== -1 ? 'tnpm' : 'npm';

  console.log('\n');
  log.warn(`******************** ${emoji.get('warning')} ${emoji.get('warning')}   升级提示  ${emoji.get('warning')} ${emoji.get('warning')} **********************`);
  log.warn(`FIE推荐的版本是 ${chalk.green.bold(latest.version)} , 本地版本是 ${current.version}, 建议升级后再使用,保证功能的稳定性`);
  log.warn(`请执行 ${emoji.get('point_right')}  ${chalk.bgRed.bold(` ${installer} install -g ${current.name} `)} 来升级FIE`);
  log.warn(`如果提示没有权限，请尝试 ${chalk.red.bold(`sudo ${installer} install -g ${current.name} `)}`);
  log.warn(`******************************${emoji.get('point_up_2')} ${emoji.get('point_up_2')} ******************************`);
  console.log('\n');
}

function checkNode() {
  let nodeVersion;

  try {
    nodeVersion = String(childProcess.execSync('node -v'));
    if (!semver.gte(nodeVersion, '4.0.0')) {
      log.error('您当前使用的node版本小于4.x,请升级后再使用FIE。');
      // log.error('升级node版本可以参考：');
      // TODO 新增node版本升级方案
      // log.error('http://node.alibaba-inc.com/env/README.html');
      process.exit(0);
    }
  } catch (e) {
    log.error(`${e}\n`);
  }
}

module.exports = {
  updateTip,
  checkNode
};
