/**
 * Created by hugo on 17/4/20.
 * 安装模块后，初始化一下工作环境
 */

const co = require('co');
const npm = require('fie-npm');
const log = require('fie-log')('fie');
const fieEnv = require('fie-env');
const fieHome = require('fie-home');
const ping = require('ping');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

function onError(err) {
  console.error('[Error]');
  console.error(err.stack || err);
}


co(function* () {
  const hasInitEnv = fieEnv.hasConfigFile();
  const pingRes = yield ping.promise.probe('fie-api.alibaba-inc.com');
  const isIntranet = pingRes && pingRes.alive;
  const userFile = path.join(fieHome.getHomePath(), 'fie.user.json');

  // 若没有初始化过，则初始化一下
  if (!hasInitEnv) {
    // 内网环境
    if (isIntranet) {
      fieEnv.setIntranetEnv();
      log.success('检测到当前安装的 fie 为内网版本，现默认将 fie 的工作环境切换至内网环境');

      // 若内网环境下，没有登录的话，则登录一下
      if (!fs.existsSync(userFile)) {
        yield npm.install('@ali/fie-auth', {
          cwd: path.join(__dirname, '..')
        });

        const auth = require('@ali/fie-auth');

        yield auth.login();
      }
    } else {
      // 外网环境
      fieEnv.setExtranetEnv();
      log.success('检测到当前安装的 fie 为外网版本，现默认将 fie 的工作环境切换至外网环境');
    }

    log.success(`也可以使用 ${chalk.yellow.bold('$ fie switch')} 命令进行FIE开发环境的切换!`);
  }
}).catch(onError);

