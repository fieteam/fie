'use strict';


const log = require('fie-log')('fie-user');
const spawn = require('cross-spawn');
const fieHome = require('fie-home');
const fs = require('fs-extra');
const path = require('path');

/**
 * 从配置文件中获取用户信息
 */
exports.getUserFromFile = function () {
  const userInfo = {
    name: '',
    email: ''
  };
  // 获取home下的fie.user.json
  const userFile = path.join(fieHome.getHomePath(), 'fie.user.json');
  if (fs.existsSync(userFile)) {
    const user = fs.readJsonSync(userFile);
    userInfo.name = user.name;
    userInfo.email = user.email;
  }

  return userInfo;
};

/**
 * 从git的配置文件中获取用户信息
 */
exports.getUserFromGit = function () {
  const userInfo = {
    name: '',
    email: ''
  };

  const reg = /user\.name=([^\n]+)\nuser\.email=([^\n]+)/;
  try {
    const results = spawn.sync('git', ['config', '--list']);
    if (results.stdout) {
      const match = results.stdout.toString().match(reg);
      if (match && match.length > 1) {
        userInfo.name = match[1];
        userInfo.email = match[2];
      } else {
        const msg = 'git config --list 没有git 信息,请检查git是否正确配置了用户名和email';
        log.debug(msg);
      }
    } else {
      const msg = '没有安装git';
      log.debug(msg);
    }
  } catch (ex) {
    log.debug('fie-user', ex);
    throw ex;
  }
  return userInfo;
};

