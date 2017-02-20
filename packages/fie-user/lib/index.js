/**
 * @desc 根据用户当前 git 信息去获取用户相关信息
 * @see http://fie.alibaba.net/doc?package=fie-user
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-user
 */

'use strict';

const utils = require('./utils');


function getUser() {
  let userInfo = utils.getUserFromFile();
  if (!userInfo.email) {
    userInfo = utils.getUserFromGit();
  }
  return userInfo;
}


/**
 * @exports fie-user
 */
module.exports = {
  /**
   * 获取用户信息
   * @returns {Object} userInfo 返回用户信息
   * @returns {string} userInfo.name 用户名
   * @returns {string} userInfo.email 用户Email
   */
  getUser,

  /**
   * 获取当前用户的Email
   * @returns {user.email|{type, allowNull}}
   */
  getEmail() {
    const user = getUser();
    return user.email;
  },

  /**
   * 获取当前用户的用户名
   * 该名称不准确，有可能是花名，也有可能是git的用户名
   * @returns {user.name|{type, allowNull}}
   */
  getName() {
    const user = getUser();
    return user.name;
  }
};
