/**
 * @author 宇果 <baofen14787@gmail.com>
 * @desc fie运行时，格式化fie在控制台输入的参数
 */

'use strict';

const argv = require('yargs').argv;
const report = require('fie-report');
const log = require('fie-log')('core-argv');


module.exports = () => {
  // fie所需的命令
  let command;
  // fie命令所需的参数
  let newArgv = [];

  // 特殊处理一下传入的参数
  // fie -v 时候的处理
  if (!argv._.concat().pop() && (argv.v || argv.version)) {
    // 没有传入任何参数, 且有 -v 或 --version
    // 如果有传了参数,说明希望看到套件插件的版本,套件插件版本在 all.js 里面进行处理
    command = 'version';
  } else if (argv.help || argv.h) {
    // 执行 fie -h 或 fie -help 的时候
    // 删除了代码，感觉没啥用： && coreCommands.indexOf(argv._[0]) === -1
    if (argv._.length === 1) {
      // 显示插件帮助信息
      command = argv._[0];
      newArgv = ['help'];
    } else {
      command = 'help';
    }
  } else if (argv._.length === 0) {
    command = 'help';
  } else {
    newArgv = argv._.concat();
    command = newArgv.splice(0, 1).pop();
  }

  log.debug('控制台传入的原始参数: %o', argv);
  log.debug('即将执行的fie命令: %o', command);
  log.debug('fie命令的参数: %o', newArgv);


  // 初次执行命令, FIE_IS_CHILD_ENTRY 将会传到子进程
  // 用于初次执行命令的上报
  log.debug(`是否子命令 ${process.env.FIE_IS_CHILD_ENTRY}`);
  if (!process.env.FIE_IS_CHILD_ENTRY) {
    process.env.FIE_IS_CHILD_ENTRY = true;
    report.coreCommand();
  }

  return {
    command,
    argv: newArgv
  };
};
