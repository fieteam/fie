/**
 * @desc 上报日志入口(this.__WPO)
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 * @memberOf fie-report
 * @exports log-node
 */

'use strict';

require('./core')(this.__WPO || {}, this, require('./conf-node'));
require('./sampling')(this.__WPO || {});
require('./apis')(this.__WPO || {});
this.__WPO.ready(true);

module.exports = this.__WPO;
