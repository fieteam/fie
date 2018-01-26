'use strict';

const fieModuleName = require('fie-module-name');
const log = require('fie-log')('core-module');
const localExist = require('./local-exist');
const onlineExist = require('./online-exist');

/**
 * 获取实际可执行的套件或插件名称
 * 获取逻辑: 自定义本地套件/插件 -> FIE本地套件/插件 -> 自定义线上套件/插件 -> FIE线上套件/插件
 * @param name 套件或插件名，必须带上 toolkit 或 plugin
 */
module.exports = function*(name) {
  const prefix = fieModuleName.prefix();
  // 如果是自定义prefix的插件
  const isCustomPrefix = prefix !== 'fie';
  // 是否使用的是fie插件
  let isUseFieModule = false;
  // 传入的插件名
  const fullName = fieModuleName.fullName(name);
  // fie的模块名称 @ali/fie-plugin-xxx
  const fieName = fullName.replace(prefix, 'fie');
  // 实际调用的插件名
  let reallyName = fullName;
  // 执行插件的方法
  let exist = localExist(fullName);
  log.debug(`本地 ${fullName} 模块: ${exist}`);
  if (!exist) {
    // 判断一下是不是自定义prefix的情况
    if (isCustomPrefix) {
      exist = localExist(fieName);
      log.debug(`本地 ${fieName} 模块: ${exist}`);
      if (!exist) {
        // 查找线上版本
        exist = yield onlineExist(fullName);
        log.debug(`线上 ${fullName} 模块: ${exist}`);
        if (!exist) {
          exist = yield onlineExist(fieName);
          log.debug(`线上 ${fieName} 模块: ${exist}`);
          if (exist) {
            reallyName = fieName;
            isUseFieModule = true;
          }
        }
      } else {
        reallyName = fieName;
        isUseFieModule = true;
      }
    } else {
      exist = yield onlineExist(fullName);
      log.debug(`线上 ${fullName} 模块: ${exist}`);
    }
  }

  const moduleInfo = {
    exist, // 模块是否存在
    isUseFieModule, // 是否使用fie原生模块
    reallyName, // 实际运行的模块名称
    fullName, // 传入的模块名称（当prefix不是fie时，该值可能与reallyName不同）
  };

  log.debug('当前实际的模块信息 %o', moduleInfo);

  return moduleInfo;
};
