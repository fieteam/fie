/**
 * Created by hugo on 17/4/21.
 * 端口被占用时的错误处理
 */
const log = require('fie-log')('core-error');
const chalk = require('chalk');
const os = require('os');
const Intl = require('fie-intl');
const message = require('../locale/index');

function handleSolution(port) {
  const isWin = os.type().match(/^Win/);
  const intl = new Intl(message);
  if (!isWin) {
    return chalk.yellow(intl.get('winPidTips', { port }));
  }

  return chalk.yellow(intl.get('macPidTips', { port }));
}

// 处理
module.exports = function* (e) {
  if (e.code !== 'EADDRINUSE') {
    return false;
  }

  const match = e.message.match(/listen EADDRINUSE(.*):(\d+)/);


  if (match && match[2]) {
    const port = match[2];
    const intl = new Intl(message);
    log.error(intl.get('helpTips', { port: chalk.green(port), solution: handleSolution(port) }));
    return true;
  }
  return false;
};
