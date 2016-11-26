/**
 * @desc 汇集文件操作的基本方法
 * @see http://fie.alibaba.net/doc?package=fie-fs
 * @requires fie-fs/copy-director
 * @requires fie-fs/copy-tpl
 * @requires fie-fs/rewrite-fie
 * @requires fie-fs/remove
 * @requires fie-fs/move
 * @author 擎空 <zernmal@foxmail.com>
 * @namespace fie-fs
 */

'use strict';


module.exports = {
  copyDirectory: require('./copy-directory'),
  copyTpl: require('./copy-tpl'),
  rewriteFile: require('./rewrite-file'),
  remove: require('./remove'),
  move: require('./move')
};
