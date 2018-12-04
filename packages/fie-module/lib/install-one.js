'use strict';

const home = require('fie-home');
const npm = require('fie-npm');
const log = require('fie-log')('core-module');
const cache = require('fie-cache');
const Intl = require('fie-intl');
const message = require('../locale/index');
const utils = require('./utils');



function* installOne(name, options) {
  const prefix = utils.modPrefix();
  const homeCwd = home.getHomePath();
  let version = 'latest';
  const intl = new Intl(message);
  let pureName = '';
  options = Object.assign(
    {},
    {
      type: 'install',
    },
    options
  );
  // 匹配套件名称，其中需要判断前缀是否是自定义的
  const match = name.match(/^(@ali\/)?([A-Za-z0-9_-]*)-(toolkit|plugin)-/);
  // 判断逻辑：前缀存在 且 前缀为自定义设置的 或者前缀是fie
  if (!(match && match[2] && (match[2] === prefix || match[2] === 'fie'))) {
    log.error(intl.get('importPkgError'));
    return;
  }

  if (!/^(@ali\/)?.+@.+$/.test(name)) {
    // 没带版本号
    pureName = name;

    if (options.lastPkg && options.lastPkg.version) {
      version = options.lastPkg.version;
    }
    name += `@${version}`;
  } else {
    pureName = name.split('@');
    version = pureName.pop();
    pureName = pureName.join('@');
  }

  // 开始安装
  log.debug(`开始安装 ${name}`);
  utils.addModuleToDependencies(homeCwd, pureName, version);
  try{
    yield npm.installDependencies({
      cwd: homeCwd,
    });
  }catch (e) {
    utils.removeModuleToDependencies(homeCwd,pureName);
    log.error(intl.get('installError',{name : pureName}));
    process.exit(1);
  }


  // 设置缓存, 1小时内不再检查
  cache.set(`${utils.UPDATE_CHECK_PRE}${pureName}`, true, {
    expires: utils.NO_TIP_PERIOD,
  });

  // 提示安装成功
  if (options.type === 'install') {
    log.success(intl.get('installSuccess', { name }));
    return;
  }

  log.success(intl.get('updateSuccess', { name }));
  // 打印更新日志
  if (!options.lastPkg) {
    options.lastPkg = yield npm.latest(pureName);
  }
  if (!options.lastPkg) {
    return;
  }
  utils.updateLog(name, {
    localPkg: options.localPkg,
    lastPkg: options.lastPkg,
    level: 'success',
  });
}

module.exports = installOne;
