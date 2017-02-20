'use strict';

const request = require('request');
const debug = require('debug')('fie-report');
const __WPO = require('../retcode/log-node');

let host = 'http://fie-api.alibaba.net';
if (process.env.NODE_ENV === 'local') {
  host = 'http://127.0.0.1:6001';
}


/**
 * 发送fie流程日志
 * @param {object} data
 */
function send(data) {
  debug('send log for api = %s', host);
  setTimeout(() => {
    request.post({
      url: `${host}/log/cli`,
      json: true,
      form: data
    }, (err, result) => {
      if (!err && result.body && result.body.code === 200) {
        debug('日志发送成功');
      } else {
        debug('日志发送失败', err || result.body);
        // 发送失败的话，就用retcode发送一下存起来
        __WPO.setConfig({ spmId: 'fie-api-error' });
        const logMsg = [];
        Object.keys(data).forEach((item) => {
          logMsg.push(`${item}=${JSON.stringify(data[item])}`);
        });

        __WPO.log(logMsg.join('&'), 1);
      }
    });
  }, 500);
}

module.exports = {
  send
};
