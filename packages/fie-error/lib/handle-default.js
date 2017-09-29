/**
 * Created by hugo on 16/11/16.
 */

'use strict';

const log = require('fie-log')('fie-error');
const env = require('fie-env');


module.exports = function* (e) {
  const ERROR_MSG = env.isIntranet() ?
    ' 请在 https://aone.alibaba-inc.com/project/500969/issue/new?toPage=1 或钉钉群 11751953 反馈问题' :
    ' 请在这里反馈问题给 @擎空 @宇果 https://github.com/fieteam/fie/issues/new ';

  log.error(`运行报错,${ERROR_MSG}`);
  e.stack && console.log(e.stack);
  return true;
};
