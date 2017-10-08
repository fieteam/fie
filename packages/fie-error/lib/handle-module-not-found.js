'use strict';

/**
 * Created by hugo on 16/11/16.
 */
const log = require('fie-log')('core-error');
const utils = require('./utils');
const fieHome = require('fie-home');
const fieNpm = require('fie-npm');
const Intl = require('fie-intl');
const message = require('../locale/index');

// 处理
module.exports = function* (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    return false;
  }
  const match = e.message.match(/'(.*)'/);
  const intl = new Intl(message);
  const cwd = process.cwd();
  // 排除 相对路径 ../ & ./ 的情况( . 开头)
  if (match && match[0] && match[0].indexOf('.') !== 1) {
    const module = utils.pureModuleName(match[1]);
    log.error(intl.get('moduleNotFound', { module }));

    let moduleCwd = fieHome.getHomePath();
    // 判断一下如果是项目文件中抛出的报错,则需要安装在项目文件夹中
    if (e.stack && e.stack.toString().indexOf(cwd) !== -1) {
      moduleCwd = cwd;
      // 这种情况下极有可能是本地的相关依赖没有安装,先全部执行一次安装
      yield fieNpm.installDependencies();
      log.success(intl.get('installSuccess'));
    }

    try {
      // 安装所需的依赖
      yield fieNpm.install(module, {
        cwd: moduleCwd
      });
      log.success(intl.get('installDone', { module, moduleCwd }));
      log.success(intl.get('installDoneTips'));
      return true;
    } catch (err) {
      log.error(intl.get('installError'));
      return false;
    }
  } else if (match && match.length === 2) {
    log.error(intl.get('notFound', { file: match[1] }));
    if (e.stack) {
      log.error(intl.get('detailError'));
      console.log(e.stack);
    }
    return true;
  }
  return false;
};
