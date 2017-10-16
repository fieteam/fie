'use strict';

const fs = require('fs-extra');
const log = require('fie-log')('core-fs');

function remove(file) {
  if (!fs.existsSync(file)) {
    return log.warn(`${file} Directory or file does not exist, no need to delete`);
  }
  fs.removeSync(file);
  return log.success(`${file} successfully deleted`);
}

module.exports = remove;
