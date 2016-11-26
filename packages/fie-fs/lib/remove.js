'use strict';

const fs = require('fs-extra');
const log = require('fie-log')('fie-fs');

function remove(file) {
  if (!fs.existsSync(file)) {
    return log.warn(`${file} 目录或文件不存在,无须删除`);
  }
  fs.removeSync(file);
  return log.success(`${file} 删除成功`);
}

module.exports = remove;
