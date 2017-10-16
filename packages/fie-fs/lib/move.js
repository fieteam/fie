'use strict';

const fs = require('fs-extra');
const log = require('fie-log')('core-fs');

function move(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
  log.success(`${oldPath} move to ${newPath}`);
}

module.exports = move;
