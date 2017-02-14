'use strict';
const request = require('request');
const HOST = 'http://fie-api.alibaba.net/flowlog.do';// fie start fieteam/fie-api pro: http://127.0.0.1:6001/flowlog.do


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
let sendFlowLog = function(flowLog){
    let data = Object.assign({
        git: "git",
        branch: "the branch",
        tool: "fie|tookit|plugin|",
        beginTime: Date.now(),
        endTime: Date.now(),
        operator: "@fie",
        status: 1, // 1为操作成功 0 为操作失败
        command: "the command",
        message: "msg",
        type: 1 //操作类型： 1为info，2为warn，3为error
    },flowLog);

    request.get({
        url: HOST,
        json: true,
        qs: data
    }, (err, result) => {
        if(err){
            console.log(err, "fie日志发送失败,fie-api.alibaba.net/flowlog.do接口导常! 请联系@六韬");
        }
    });

    return {
        success: true,
        msg: "成功"
    }
}

module.exports = {
    send: sendFlowLog
}