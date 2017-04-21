/**
 * Created by hugo on 17/4/21.
 * 端口被占用时的错误处理
 */
const log = require('fie-log')('fie-error');
const chalk = require('chalk');
const os = require('os');

function handleSolution(port) {
  const isWin = os.type().match(/^Win/);
  if (!isWin) {
    return chalk.yellow(`   # 看下是哪个PID占用的端口
   $ lsof -i :${port}
   # 杀进程
   $ kill -9 【pid】`);
  }

  chalk.yellow(`   # 看下是哪个PID占用的端口
   $ netstat -anop tcp | find /i ":${port}" |  find "LISTENING"
   # 杀进程
   $ taskkill /F /pid 【pid】`);
}

// 处理
module.exports = function* (e) {
  if (e.code !== 'EADDRINUSE') {
    return false;
  }

  const match = e.message.match(/listen EADDRINUSE(.*):(\d+)/);


  if (match && match[2]) {
    const port = match[2];
    log.error(`运行失败，检测到当前端口号 ${chalk.green(port)} 已被其他程序占用
修复建议：
  1. 切换到其他端口再试试
  2. 请按下面的方法关闭占用端口的程序
  
${handleSolution(port)}
`);
    return true;
  }
};
