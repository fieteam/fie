'use strict';
const request = require('request');
const fieEnv = require('fie-env');

const HOST = 'http://fie-api.alibaba.net/flowlog.do';// fie start fieteam/fie-api pro: http://127.0.0.1:6001/flowlog.do
/**
 * 发送fie流程日志
 * @param 
 * @returns null
 */
let sendFlowLog = function(flowLog){
    if(!fieEnv.isIntranet()){
        //外网暂时不发流程日志
        return false;
    }

    let data = Object.assign({
        git: "git",
        branch: "the branch",
        tool: "fie|tookit|plugin|",
        beginTime: Date.now(),
        endTime: Date.now(),
        operator: "@fie",
        status: 1,// 1为操作成功 0 为操作失败
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
            //console.log(err, "发送失败");
        }
        else{
            //console.log(result.body, "发送成功");
        }
    });

}

module.exports = {
    send: function(flowLog){
        sendFlowLog(flowLog);
    }
}