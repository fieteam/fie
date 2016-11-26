/**
 * @desc 汇集系统操作基本方法
 * @see http://fie.alibaba.net/doc?package=fie-home
 * @requires fie-task/run
 * @requires fie-task/funFunction
 * @author 擎空 <qingkong@alibaba-inc.com>
 * @namespace fie-fs
 */

'use strict';


module.exports = {
  run: require('./run'),
  runFunction: require('./run-function'),
  has: require('./has')
};
