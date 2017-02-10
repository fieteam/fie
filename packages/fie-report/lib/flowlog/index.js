'use strict';
const request = require('request');
const auth = require('@ali/fie-auth');

/**
 * 发送fie流程日志
 * @param 
 * @returns null
 */
let sendFlowLog = function(type, flowLog){
    const token = auth.token();
    request.get({
        url: `http://api.fie.alibaba.com/api/flowlog.do`,
        json: true,
        qs: Object.assign({
            token: token,
            git: "git",
            branch: "the branch",
            tool: "fie|tookit|plugin|",
            beginTime: Date.now(),
            endTime: Date.now(),
            operator: "@fie",
            status: "true",
            command: "the command",
            message: "msg",
            type: type
        },flowLog)
      }, (err, result) => {
          console.log(result.body, "发送成功")
      });
}

module.exports = {
    log: function(flowLog){
        sendFlowLog("sucess", flowLog);
    },
    error: function(flowLog){
        sendFlowLog("error", flowLog);
    }
}