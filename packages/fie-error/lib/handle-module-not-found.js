'use strict';

/**
 * Created by hugo on 16/11/16.
 */
const log = require('fie-log')('fie-error');
const utils = require('./utils');
const fieHome = require('fie-home');
const fieNpm = require('fie-npm');
// 处理
module.exports = function* (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    return false;
  }
  const match = e.message.match(/'(.*)'/);
  const cwd = process.cwd();
  // 排除 相对路径 ../ & ./ 的情况( . 开头)
  if (match && match[0] && match[0].indexOf('.') !== 1) {
    const module = utils.pureModuleName(match[1]);

    log.error(`运行插件或套件时出现了错误, 未找到 ${module} 模块! FIE正在尝试自动修复...`);

    let moduleCwd = fieHome.getHomePath();
    // 判断一下如果是项目文件中抛出的报错,则需要安装在项目文件夹中
    if (e.stack && e.stack.toString().indexOf(cwd) !== -1) {
      moduleCwd = cwd;
      // 这种情况下极有可能是本地的相关依赖没有安装,先全部执行一次安装
      yield fieNpm.installDependencies();
      log.success('成功安装当前项目中的依赖,请重新运行命令!');
    }

    try {
      // 安装所需的依赖
      yield fieNpm.install(module, {
        cwd: moduleCwd
      });
      log.success(`已将 ${module} 模块安装至 ${moduleCwd} ,自动修复成功,请重新运行命令!`);
      return true;
    } catch (err) {
      log.error('sorry 自动修复失败, 请手动修复');
      return false;
    }
  } else if (match && match.length === 2) {
    log.error(`运行时出现了错误, 未找到 ${match[1]} 文件,请确认 ${match[1]} 是否存在!`);
    if (e.stack) {
      log.error('详细错误堆栈信息如下:');
      console.log(e.stack);
    }
    return true;
  }
  return false;
};
