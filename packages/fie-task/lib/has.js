'use strict';

const utils = require('./utils');

function has(tasks, when) {
  if (!tasks) {
    return false;
  }
  if (!when) {
    if (tasks.length) {
      return true;
    }
    return false;
  }
  return !!utils.classify(tasks)[when].length;
}

module.exports = has;
