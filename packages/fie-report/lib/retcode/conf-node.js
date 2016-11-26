/**
 * @desc 配置retcode for node
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 * @memberOf fie-report
 * @exports conf-node
 */

'use strict';

module.exports = {
  sendRequest: require('./request-node'),
  getCookie(wpo) {
    return wpo.config.cookie;
  },
  getSpmId() {
    return this.spmId;
  }
};
