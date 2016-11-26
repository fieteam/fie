'use strict';

const fs = require('fs-extra');
const log = require('fie-log')('fie-fs');

function move(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
  log.success(`${oldPath} 成功移至 ${newPath}`);
}

module.exports = move;
