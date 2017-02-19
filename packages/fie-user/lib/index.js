/**
 * @desc 根据用户当前 git 信息去获取用户相关信息
 * @see http://fie.alibaba.net/doc?package=fie-user
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-user
 */

'use strict';

const log = require('fie-log')('fie-user');
const spawn = require('cross-spawn');
const fieHome = require('fie-home');
const fs = require('fs-extra');
const path = require('path');
/**
 * 从配置文件中获取用户信息
 */
function getUserFromFile() {
	const userInfo = {
		name: '',
		email: ''
	};
  //获取home下的fie.user.json
  const userFile = path.join( fieHome.getHomePath(),'fie.user.json' );
  if(fs.existsSync(userFile)){
    const user = fs.readJsonSync(userFile);
		userInfo.name = user.name;
		userInfo.email = user.email
  }
  return userInfo;
}

/**
 * 从git的配置文件中获取用户信息
 */
function getUserFromGit() {
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
}

function getUser() {
	let userInfo = getUserFromFile();
	if(!userInfo.email){
		userInfo = getUserFromGit()
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
	getEmail : function () {
		const user = getUser();
		return user.email
	},

	/**
	 * 获取当前用户的用户名
	 * 该名称不准确，有可能是花名，也有可能是git的用户名
	 * @returns {user.name|{type, allowNull}}
	 */
	getName : function () {
		const user = getUser();
		return user.name;
	}
};
