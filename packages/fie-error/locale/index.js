/**
 * 语言文件
 */

module.exports = {
  'zh-cn': {
    // handle-default.js
    intranetTips: '运行报错, 请在 https://aone.alibaba-inc.com/project/500969/issue/new?toPage=1 或钉钉群 11751953 反馈问题',
    extranetTips: '运行报错, 请在这里反馈问题给 hugohua https://github.com/fieteam/fie/issues/new ',
    winPidTips: `   # 看下是哪个PID占用的端口
   $ lsof -i :{port}
   # 杀进程
   $ kill -9 【pid】`,
    macPidTips: `   # 看下是哪个PID占用的端口
   $ netstat -anop tcp | find /i ":{port}" |  find "LISTENING"
   # 杀进程
   $ taskkill /F /pid 【pid】`,
    helpTips: `运行失败，检测到当前端口号 {port} 已被其他程序占用
修复建议：
  1. 切换到其他端口再试试
  2. 请按下面的方法关闭占用端口的程序
 
{solution}  
`,
    commandNotFound: '运行插件或套件时出现了错误, 未找到 {module} 命令,请看下是否有安装!',
    fixLocalTips: '修复建议: 在控制台执行 {installer} install {runModule} 试试!',
    fixGlobalTips: '修复建议: 在控制台执行 {installer} install -g {module} 试试!',
    moduleNotFound: '运行插件或套件时出现了错误, 未找到 {module} 模块! 正在尝试自动修复...',
    installSuccess: '成功安装当前项目中的依赖,请重新运行命令!',
    installDone: '已将 {module} 模块安装至 {moduleCwd} ,自动修复成功,请重新运行命令!',
    installDoneTips: '若重新运行仍然出现问题，请在命令前面加上：DEBUG=core-error 来获取详细错误堆栈',
    installError: 'sorry 自动修复失败, 请手动修复',
    notFound: '运行时出现了错误, 未找到 {file} 文件,请确认 {file} 是否存在!',
    detailError: '详细错误堆栈信息如下:',
    npmNotFound: '安装 {module} 出错,请确认网络是否正常及包名是否输入正确'
  },
  'en-us': {
// handle-default.js
    intranetTips: 'Run the error, please https://aone.alibaba-inc.com/project/500969/issue/new?toPage=1 or dingding group 11751953 feedback problem',
    extranetTips: 'Run the error, please feedback here to hugohua https://github.com/fieteam/fie/issues/new ',
    winPidTips: `   # Look at which PID occupies the port
   $ lsof -i :{port}
   # Kill process
   $ kill -9 【pid】`,
    macPidTips: `   # Look at which PID occupies the port
   $ netstat -anop tcp | find /i ":{port}" |  find "LISTENING"
   # Kill process
   $ taskkill /F /pid 【pid】`,
    helpTips: `The operation failed and the current port number {port} was detected to be occupied by other programs
Fix suggestions：
  1. Try switching to another port
  2. Please follow the procedure below to close the program that occupies the port
 
{solution}  
`,
    commandNotFound: 'There was an error when running the plugin or toolkit, and the {module} command was not found. Please see if there is an installation!',
    fixLocalTips: 'Fix Suggestions: Try {installer} install {runModule} on the console!',
    fixGlobalTips: 'Fix Suggestions: Try {installer} install -g {module} on the console!',
    moduleNotFound: 'There was an error when running the plugin or toolkit, and the {module} module was not found! Trying to fix it automatically ...',
    installSuccess: 'To successfully install dependencies in the current project, rerun the command!',
    installDone: 'The {module} module has been installed to {moduleCwd} and the automatic repair is successful. Please re-run the command!',
    installDoneTips: 'If there is still a problem with the rerun, please add: DEBUG = core-error to the detailed error stack',
    installError: 'sorry automatic repair failed, please manually repair',
    notFound: 'There was an error in the run, and the {file} file was not found. Please make sure {file} is present!',
    detailError: 'Detailed error stack information is as follows:',
    npmNotFound: 'Install {module} error, please confirm whether the network is normal and whether the package name is correct'
  },
};
