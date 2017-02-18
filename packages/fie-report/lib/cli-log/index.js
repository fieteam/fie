'use strict';

const request = require('request');
const fieEnv = require('fie-env');
const log = require('fie-log')('fie-report');

// const API = 'http://fie-api.alibaba.net/flowlog.do';// fie start fieteam/fie-api pro: http://127.0.0.1:6001/flowlog.do
let host = 'http://fie-api.alibaba.net';
if(process.env.NODE_ENV === 'local'){
	host = 'http://127.0.0.1:6001'
}


/**
 * 发送fie流程日志
 * @param {object} flowlog
 * @param {string} flowlog.git 仓库地址(可选参数)
 * @param {string} flowlog.branch 仓库分支(可选参数)
 * @param {string} flowlog.tool 工具名称如fie/tap/tdd(可选参数)
 * @param {string} flowlog.command 命令串或工具名(必填)
 * @param {string} flowlog.message 消息(可选参数)
 * @param {number} flowlog.beginTime 执行开始, 格式Date.now() (可选参数)
 * @param {number} flowlog.endTime 执行结束时间, 格式Date.now() (可选参数)
 * @param {number} flowlog.status 操作状态(可选参数)
 * @returns {object} object, object.sucess 是否成功, object.msg 消息
 */
function send(data) {

	log.debug('send log for api = %s', host);
	setTimeout(function () {
		request.post({
			url: `${host}/log/cli`,
			json: true,
			form: data
		}, (err,result) => {
			// 请求是否成功暂时不做处理
			// console.log("外网请忽略：fie日志发送失败,fie-api.alibaba.net/flowlog.do接口导常! 请联系@六韬");
		});
	},200)
}

module.exports = {
  send
};
