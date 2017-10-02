/**
 * Created by hugo on 16/11/20.
 */

'use strict';

const npm = require('fie-npm');
const utils = require('./utils');

/**
 * 模块是否存在
 */
function* onlineExist(name) {
  //TODO 在外层处理模块名就好了
  // name = utils.fullName(name);
  const latest = yield npm.latest(name);
  // 如果description 为 delete的话，则排查掉该模块，因为publish 之后，是不允许unpublish的
  return !!(latest && latest.description !== 'delete');
}

module.exports = onlineExist;
