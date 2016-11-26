/**
 * @desc http(s) 请求
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 * @memberOf fie-report
 * @exports conf-node
 */

'use strict';

const http = require('https');

/**
 * @desc 发送http请求方法
 * @param {string} url
 * @returns {void}
 */
const httpRequest = function (url) {
  if (url.indexOf('https:') != 0 && url.indexOf('//') == 0) {
    url = `https:${url}`;
  }

  const sendRequest = http.request(url, (res) => {
    // 发送即可暂时考虑不需做处理
  });

  // 加异常捕获避免影响业务
  sendRequest.on('error', (err) => {
    // 暂时考虑不需做处理
  });
  sendRequest.end();
};


module.exports = httpRequest;
