/**
 * @desc 异常处理中心,扑获常见的异常 并人性化展示
 * @requires fie-error/handle
 * @requires fie-error/register
 * @author 擎空 <zernmal@foxmail.com>
 * @namespace fie-error
 */

'use strict';

const handle = require('./handle');
const register = require('./register');

module.exports = {
  handle,
  register
};
