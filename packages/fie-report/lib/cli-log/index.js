'use strict';

const request = require('request');
const debug = require('debug')('fie-report');
const __WPO = require('../retcode/log-node');
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

	debug('send log for api = %s', host);
	setTimeout(function () {
		request.post({
			url: `${host}/log/cli`,
			json: true,
			form: data
		}, (err,result) => {

			if(!err && result.body && result.body.code === 200){
				debug(`日志发送成功`)
			}else {
				debug(`日志发送失败`,err || result.body);
				//发送失败的话，就用retcode发送一下存起来
				__WPO.setConfig({ spmId: 'fie-api-error' });
				let logMsg = [];
				Object.keys(data).forEach(item => {
					logMsg.push(`${item}=${JSON.stringify(data[item])}`)
				});

				__WPO.log(logMsg.join('&'), 1);

			}
		});
	},500)
}

module.exports = {
  send
};
